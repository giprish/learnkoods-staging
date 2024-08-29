import { Controller, useFormContext } from "react-hook-form";
import Map from "../../../Map";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Select from "react-select";
import { error } from "jquery";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ContactInfoBox = ({
  onSubmit,
  countryId,
  setCountryId,
  stateId,
  setStateId,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  const fetch = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  const { data: country } = useQuery({
    queryKey: ["countryData"],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/country/`),
  });

  const { data: state } = useQuery({
    queryKey: ["stateData", countryId],
    queryFn: () =>
      fetch(`${process.env.GLOBAL_API}/state/${countryId?.value}/`),
  });

  const { data: city } = useQuery({
    queryKey: ["cityData", stateId],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/city/${stateId?.value}/`),
  });

  const options = (optiondata) => {
    if (optiondata?.message) {
      return optiondata?.message?.map((option) => ({
        value: option.id,
        label: option.data || option.name,
      }));
    }
    return optiondata?.data?.map((option) => ({
      value: option.id,
      label: option.data || option.name,
    }));
  };
  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Phone</label>
          <Controller
            name="phone"
            control={control}
            rules={{ required: "Phone number is required" }}
            render={({ field }) => (
              <PhoneInput
                country={"us"} // Default country
                value={field.value}
                onChange={(phone) => field.onChange(phone)}
                inputStyle={{
                  width: "100%",
                  padding: "28px 50px",
                  borderRadius: "8px",
                }}
              />
            )}
          />
          {errors.phone && (
            <p className="text-danger">{errors.phone.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="creativelayers"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-danger">{errors.email.message}</p>
          )}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Country</label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={options(country)}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(selectedOption) => {
                  field.onChange(selectedOption); // Update React Hook Form state
                  setCountryId({
                    value: selectedOption.value, // Set the selected country value
                    label: selectedOption.label, // Set the selected country label
                  }); // Set the selected country ID
                  setValue("state", null);
                  setValue("city", null);
                }}
              />
            )}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>State</label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={options(state)}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(selectedOption) => {
                  field.onChange(selectedOption); // Update React Hook Form state
                  setStateId({
                    value: selectedOption.value, // Set the selected country value
                    label: selectedOption.label, // Set the selected country label
                  });
                  setValue("city", null);
                }}
              />
            )}
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>City</label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={options(city)}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            )}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Zipcode</label>
          <input
            type="number"
            name="pincode"
            placeholder="Zipcode"
            {...register("pincode")}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Address Line 1</label>
          <input
            type="text"
            name="address1"
            placeholder="329 Queensberry Street."
            {...register("address1")}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Address Line 2</label>
          <input
            type="text"
            name="name"
            placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
            {...register("address")}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <button type="submit" className="theme-btn btn-style-one">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactInfoBox;
