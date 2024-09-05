import { Controller, useForm, useFormContext } from "react-hook-form";
import Map from "../../../Map";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Select from "react-select";
import { error } from "jquery";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { userContact } from "@/validation/validation";

const ContactInfoBox = ({ countryId, setCountryId, stateId, setStateId }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    setValue,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(userContact),
  });
  const [access, setAccess] = useState(null);
  const [id, setId] = useState(null);
  useEffect(() => {
    const access = window.localStorage.getItem("access");
    const id = window.localStorage.getItem("id");
    setAccess(access);
    setId(id);
  }, []);
  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/usr_pro_id/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { data: user } = useQuery({
    queryKey: ["user", access],
    queryFn: () => fetchData(),
  });

  useEffect(() => {
    if (user) {
      let array = user?.data?.skills.map((s1) => ({
        label: s1.data,
      }));
      reset(user?.data);
      setValue("skills", array);
      setValue("position", { label: user?.data?.position });
      setValue("username", user?.user?.username);
      setValue("email", user?.user?.email);
      setValue("first_name", user?.user?.first_name);
      setValue("last_name", user?.user?.last_name);
      setValue("country", {
        value: user?.data?.country?.id,
        label: user?.data?.country?.name,
      });
      setValue("state", {
        value: user?.data?.state?.id,
        label: user?.data?.state?.name,
      });
      setValue("city", {
        value: user?.data?.city?.id,
        label: user?.data?.city?.name,
      });
      setCountryId({
        value: user?.data?.country?.id,
        label: user?.data?.country?.name,
      });
      setStateId({
        value: user?.data?.state?.id,
        label: user?.data?.state?.name,
      });
    }
  }, [user]);

  const updateProfile = async (formdata) => {
    const { data: response } = await axios.put(
      `${process.env.GLOBAL_API}/usr_pro_id/${id}/`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ${access}`,
          // "Content-type": "multipart/form-data",
        },
      }
    );
    return response;
  };
  const { mutate, isLoading } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      console.log(data, "data from sucessful contact update");
      toast.success("Contact updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      // window.location.reload();
    },
    onError: (error) => {
      console.log(error, "Contact error message");
      const errorFields = [
        "phone",
        "email",
        "country",
        "state",
        "city",
        "address1",
        "address",
      ];
      let errorHandled = false;

      errorFields.forEach((field) => {
        if (error.response.data[field]) {
          const errorMessage = Array.isArray(error.response.data[field])
            ? error.response.data[field][0]
            : error.response.data[field].error || error.response.data[field];

          toast.error(`${field}: ${errorMessage}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          errorHandled = true;
        }
      });

      // Handle errors not in the errorFields array
      if (!errorHandled) {
        toast.error("An unexpected error occurred. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    },
  });

  const onSubmit = (data) => {
    console.log(data, "original data");
    // Debugging: Log dirtyFields to ensure it's being populated correctly
    console.log("Dirty Fields:", dirtyFields);

    const dirtyData = Object.keys(data).reduce((acc, key) => {
      if (dirtyFields[key]) {
        if (Array.isArray(data[key])) {
          // Handle multi-select fields by extracting labels
          acc[key] = data[key].map((option) => ({
            data: option.label,
          }));
        } else if (typeof data[key] === "object" && data[key].label) {
          // If the value is an object and has a label property, extract it
          acc[key] = data[key].value;
        } else if (
          key === "first_name" ||
          key === "last_name" ||
          key === "username" ||
          key === "email"
        ) {
          // Initialize the user object if it doesn't exist
          if (!acc.user) {
            acc.user = {};
          }
          // Add the fields to the user object
          acc.user[key] = data[key];
        } else {
          // Handle other fields
          acc[key] = data[key];
        }
      }
      return acc;
    }, {});
    // Debugging: Log dirtyData to ensure it's being populated correctly
    console.log("Dirty Data:", dirtyData);

    const formData = new FormData();

    for (const key in dirtyData) {
      if (Array.isArray(dirtyData[key])) {
        dirtyData[key].forEach((element, index) => {
          formData.append(`${key}[${index}]data`, element.data);
        });
      } else if (typeof dirtyData[key] === "object" && key === "user") {
        // Handle user object separately
        const user = dirtyData[key];
        for (const userKey in user) {
          formData.append(`user[${userKey}]`, user[userKey]);
        }
      } else {
        formData.append(key, dirtyData[key]);
      }
    }

    // Debugging: Log formData entries to ensure correct data is being appended
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    mutate(formData);
    // Submit only dirtyData to your API
  };

  const onError = (errors) => {
    console.log("Validation Errors:", errors);
  };

  const fetch = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  const { data: country } = useQuery({
    queryKey: ["countryData"],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/country/`),
    retry: 1,
  });

  const { data: state } = useQuery({
    queryKey: ["stateData", countryId],
    queryFn: () =>
      fetch(`${process.env.GLOBAL_API}/state/${countryId?.value}/`),
    enabled: !!countryId?.value,
    retry: 1,
  });

  const { data: city } = useQuery({
    queryKey: ["cityData", stateId],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/city/${stateId?.value}/`),
    enabled: !!stateId?.value,
    retry: 1,
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
    <form className="default-form" onSubmit={handleSubmit(onSubmit, onError)}>
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
            placeholder="Email"
            {...register("email")}
            required
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
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  options={options(country)}
                  className={`basic-multi-select `}
                  classNamePrefix="select"
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption); // Update React Hook Form state
                    setCountryId({
                      value: selectedOption?.value, // Set the selected country value
                      label: selectedOption?.label, // Set the selected country label
                    }); // Set the selected country ID
                    setValue("state", null);
                    setValue("city", null);
                  }}
                  value={field.value} // Ensure the selected value is controlled, and default to null if undefined
                />
                {errors.country && (
                  <p className="text-danger">{errors.country.message}</p>
                )}
              </>
            )}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>State</label>
          <Controller
            name="state"
            control={control}
            rules={{ required: "State is required" }}
            render={({ field }) => (
              <>
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
                {errors.state && (
                  <p className="text-danger">{errors.state.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>City</label>
          <Controller
            name="city"
            control={control}
            rules={{ required: "City is required" }}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  options={options(city)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                {errors.city && (
                  <p className="text-danger">{errors.city.message}</p>
                )}
              </>
            )}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Zipcode</label>
          <input
            type="text"
            name="pincode"
            placeholder="Zipcode"
            {...register("pincode")}
          />
          {errors.pincode && (
            <p className="text-danger">{errors.pincode.message}</p>
          )}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Address Line 1</label>
          <input
            type="text"
            name="address1"
            placeholder="Address Line 1"
            {...register("address1")}
            required
          />
          {errors.address1 && (
            <p className="text-danger">{errors.address1.message}</p>
          )}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Address Line 2</label>
          <input
            type="text"
            name="name"
            placeholder="Address Line 2"
            {...register("address")}
            required
          />
          {errors.address && (
            <p className="text-danger">{errors.address.message}</p>
          )}
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
