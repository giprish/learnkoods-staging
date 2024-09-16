import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addLocation,
  addCountry,
  addState,
} from "../../../features/filter/filterSlice";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";

const LocationBox = () => {
  const {
    control,
    formState: { errors, dirtyFields },
    setValue,
  } = useForm({
    mode: "onChange",
  });
  const { jobList } = useSelector((state) => state.filter);
  const [getLocation, setLocation] = useState(jobList.location);
  const dispath = useDispatch();
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);

  const locationHandler = (e) => {
    const newValue = e.label;
    console.log(newValue, "new value location ");
    setLocation(newValue);
    clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        dispath(addLocation(newValue));
      }, 500)
    );
  };

  useEffect(() => {
    setLocation(jobList.location);
  }, [setLocation, jobList]);

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
    <>
      <div className="form-group">
        <label>Country</label>
        <Controller
          name="country"
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <>
              <Select
                {...field}
                placeholder="select country"
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
              />
              {errors.country && (
                <p className="text-danger">{errors.country.message}</p>
              )}
            </>
          )}
        />
      </div>
      <div className="form-group my-3">
        <label>State</label>
        <Controller
          name="state"
          control={control}
          rules={{ required: "State is required" }}
          render={({ field }) => (
            <>
              <Select
                {...field}
                placeholder="select state"
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

      <div className="form-group ">
        <label>City</label>
        <Controller
          name="city"
          control={control}
          rules={{ required: "City is required" }}
          render={({ field }) => (
            <>
              <Select
                {...field}
                placeholder="select city"
                options={options(city)}
                className="basic-multi-select"
                classNamePrefix="select"
                value={getLocation}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption); // Update React Hook Form state
                  setValue("city", null);
                  setValue("country", null);
                  setValue("state", null);
                  locationHandler(selectedOption);
                }}
              />
              {errors.city && (
                <p className="text-danger">{errors.city.message}</p>
              )}
            </>
          )}
        />
      </div>

      {/* <input
        type="text"
        name="listing-search"
        placeholder="City or Zipcode"
        value={getLocation}
        onChange={locationHandler}
      /> */}
      {/* <span className="icon flaticon-map-locator"></span> */}
    </>
  );
};

export default LocationBox;
