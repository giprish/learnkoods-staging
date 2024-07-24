import { Controller, useFormContext } from "react-hook-form";
import Map from "../../../Map";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Select from "react-select";
import { error } from "jquery";
const ContactInfoBox = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useFormContext();
  const fetchCity = async () => {
    const response = await axios.get(` ${process.env.GLOBAL_API}/city/`);
    return response.data;
  };

  const { data: cities } = useQuery({
    queryKey: ["cityData"],
    queryFn: () => fetchCity(),
  });

  const options = cities?.data?.map((option) => ({
    value: option.id,
    label: option.name,
  }));
  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="0 123 456 7890"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-danger">{errors.phone.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Email address</label>
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
          <select className="chosen-single form-select">
            <option>UK</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>City</label>

          <Controller
            name="city"
            control={control}
            rules={{ required: "Please select city" }}
            render={({ field }) => (
              <Select
                {...field}
                name="city"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            )}
          />
          {errors.email && (
            <p className="text-danger">{errors.email.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Complete Address</label>
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
