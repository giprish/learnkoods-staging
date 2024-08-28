import axios from "axios";
import Map from "../../../Map";
import Select from "react-select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PostjobForm = ({
  onSubmit,
  setJobImage,
  cat,
  setCat,
  subcat,
  setSubCat,
  setTab,
  countryId,
  setCountryId,
  stateId,
  setStateId,
}) => {
  const {
    register,
    handleSubmit,
    control,
    resetField,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const access = window.localStorage.getItem("access");
  const [selectedsubcat, setSelectedSubCat] = useState(null);

  const fetch = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  const { data: category } = useQuery({
    queryKey: ["categoryData"],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/cat-api/`),
  });

  const { data: subCategory } = useQuery({
    queryKey: ["SubCategorydata", cat?.value],
    queryFn: () =>
      fetch(`${process.env.GLOBAL_API}/sub_cat_id-api/${cat.value}/`),
  });

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
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Title</label>
          <input
            type="text"
            name="name"
            placeholder="Title"
            {...register("job_title")}
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Job Type</label>
          <select
            className="chosen-single form-select"
            {...register("job_type")}
          >
            <option value="">Select</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Workplace Type</label>
          <select
            className="chosen-single form-select"
            {...register("workplace_type")}
          >
            <option disabled>Select</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Experience</label>
          {/* <input
            type="text"
            name="exp_required"
            placeholder=""
            {...register("exp_required")}
          /> */}
          <select
            className="chosen-single form-select"
            {...register("exp_required")}
          >
            <option disabled>Select</option>
            <option value="1-2 years">1-2 years</option>
            <option value="2-3 years">2-3 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5-7 years">5-7 years</option>
            <option value="7-9 years">7-9 years</option>
            <option value="9-11 years">9-11 years</option>
            <option value="11-13 years">11-13 years</option>
            <option value="13-15 years">13-15 years</option>
            <option value="15+ above years">15+ above years</option>
          </select>
          {errors.exp_required?.message && (
            <p className="text-danger">{errors.exp_required?.message}</p>
          )}
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Gender</label>
          <select className="chosen-single form-select" {...register("gender")}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="All">All</option>
          </select>
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Url</label>
          <input type="url" name="url" placeholder="Url" {...register("url")} />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Is published</label>
          <select
            className="chosen-single form-select"
            {...register("is_published")}
          >
            <option disabled>Select</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          {/* {errors.is_published?.message && (
            <p className="text-danger">{errors.is_published?.message}</p>
          )} */}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Is Closed</label>
          <select
            className="chosen-single form-select"
            {...register("is_closed")}
          >
            <option disabled>Select</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          {/* {errors.is_closed?.message && (
            <p className="text-danger">{errors.is_closed?.message}</p>
          )} */}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Category</label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={options(category)}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(selectedOption) => {
                  setCat({
                    value: selectedOption.value, // Set the selected country value
                    label: selectedOption.label, // Set the selected country label
                  });
                  field.onChange(selectedOption);
                  setValue("sub_category", null);
                }}
              />
            )}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Sub Category</label>
          <Controller
            name="sub_category"
            control={control}
            rules={{ required: "Sub category is required !" }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Select
                  {...field}
                  options={options(subCategory)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(selectedOption) => {
                    setSubCat({
                      value: selectedOption.value, // Set the selected country value
                      label: selectedOption.label, // Set the selected country label
                    });
                    field.onChange(selectedOption);
                  }}
                />
                {error && <p className="error">{error.message}</p>}
              </>
            )}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Recruitment Timeline</label>
          <select
            className="chosen-single form-select"
            {...register("recruitment_timeline")}
          >
            <option disabled>Select</option>
            <option value="1-7 days">1-7 days</option>
            <option value="8-15 days">8-15 days</option>
            <option value="16-30 days">16-30 days</option>
            <option value="31-60 days">31-60 days</option>
          </select>
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

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Address Line 1</label>
          <input
            type="text"
            name="name"
            placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
            {...register("location1")}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Address Line 2</label>
          <input
            type="text"
            name="location"
            placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
            {...register("location")}
          />
          {errors.location?.message && (
            <p className="text-danger">{errors.location?.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-6 col-md-12">
          <label>Find On Map</label>
          <input
            type="text"
            name="name"
            placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
          />
        </div> */}

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-3 col-md-12">
          <label>Latitude</label>
          <input type="text" name="name" placeholder="Melbourne" />
        </div> */}

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-3 col-md-12">
          <label>Longitude</label>
          <input type="text" name="name" placeholder="Melbourne" />
        </div> */}

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-12 col-md-12">
          <button className="theme-btn btn-style-three">Search Location</button>
        </div> */}

        {/* <div className="form-group col-lg-12 col-md-12">
          <div className="map-outer">
            <div style={{ height: "420px", width: "100%" }}>
              <Map />
            </div>
          </div>
        </div> */}

        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12 text-right d-flex justify-content-between ">
          <button className="theme-btn btn-style-one" type="submit">
            Save
          </button>
          <button
            className="theme-btn btn-style-one"
            type="button"
            onClick={() => setTab("step2")}
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostjobForm;
