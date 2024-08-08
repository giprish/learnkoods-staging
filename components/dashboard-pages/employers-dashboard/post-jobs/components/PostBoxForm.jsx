"use client";
import axios from "axios";
import Map from "../../../Map";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";

const PostBoxForm = ({
  companyname,
  companyId,
  onSubmit,
  setJobImage,
  onError,
  setTab,
}) => {
  const {
    register,
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useFormContext();
  const [catId, setCatId] = useState(null);
  const [selectedsubcat, setSelectedSubCat] = useState(null);

  const access = window.localStorage.getItem("access");

  const fetch = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  const { data: category } = useQuery({
    queryKey: ["categoryData"],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/cat-api/`),
  });

  const { data: subCategory } = useQuery({
    queryKey: ["SubCategorydata", catId],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/sub_cat_id-api/${catId}/`),
  });

  useEffect(() => {
    // When subCategory changes, reset the selected value
    setSelectedSubCat(null);
    resetField("sub_category"); // or any default value
  }, [subCategory]);

  const { data: skills } = useQuery({
    queryKey: ["skillData"],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/skill_api/`),
  });
  const { data: city } = useQuery({
    queryKey: ["cityData"],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/city/`),
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
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Title</label>
          <input
            type="text"
            name="job_title"
            placeholder="Title"
            {...register("job_title")}
          />
          {errors.job_title?.message && (
            <p className="text-danger">{errors.job_title?.message}</p>
          )}
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Job Type</label>
          <select
            className="chosen-single form-select"
            {...register("job_type")}
          >
            <option>Select</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
          </select>
          {errors.job_type?.message && (
            <p className="text-danger">{errors.job_type?.message}</p>
          )}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Workplace Type</label>
          <select
            className="chosen-single form-select"
            {...register("workplace_type")}
          >
            <option>Select</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
          {errors.workplace_type?.message && (
            <p className="text-danger">{errors.workplace_type?.message}</p>
          )}
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Experience</label>
          <input
            type="text"
            name="exp_required"
            placeholder=""
            {...register("exp_required")}
          />
          {errors.exp_required?.message && (
            <p className="text-danger">{errors.exp_required?.message}</p>
          )}
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Gender</label>
          <select className="chosen-single form-select" {...register("gender")}>
            <option>Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender?.message && (
            <p className="text-danger">{errors.gender?.message}</p>
          )}
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Url</label>
          <input type="url" name="url" placeholder="Url" {...register("url")} />
          {errors.url?.message && (
            <p className="text-danger">{errors.url?.message}</p>
          )}
        </div>

        <div className="form-group col-lg-6 col-md-12 ">
          <label className="" for="job_image">
            Job Image
          </label>
          <input
            id="job_image"
            type="file"
            name="job_image"
            placeholder="Image"
            onChange={(e) => setJobImage(e.target.files[0])}
            className="form-control py-3"
            accept=".jpg, .png, .jgeg"
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Is published</label>
          <select
            className="chosen-single form-select"
            {...register("is_published")}
          >
            <option>Select</option>
            <option value="True">True</option>
            <option value="False">False</option>
          </select>
          {errors.is_published?.message && (
            <p className="text-danger">{errors.is_published?.message}</p>
          )}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Is Closed</label>
          <select
            className="chosen-single form-select"
            {...register("is_closed")}
          >
            <option>Select</option>
            <option value="True">True</option>
            <option value="False">False</option>
          </select>
          {errors.is_closed?.message && (
            <p className="text-danger">{errors.is_closed?.message}</p>
          )}
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Category</label>

          <Controller
            name="category"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <Select
                  {...field}
                  value={
                    options(category)?.find(
                      (option) => option.value === field.value?.value
                    ) || null
                  }
                  onChange={(selectedOption) => {
                    setCatId(selectedOption.value);
                    field.onChange(selectedOption); // Pass the entire selectedOption object
                  }}
                  options={options(category)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                {error && <p className="text-danger">{error.message}</p>}
              </>
            )}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Sub Category</label>
          <Controller
            name="sub_category"
            control={control}
            // rules={{ required: "Sub category is required !" }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Select
                  {...field}
                  value={selectedsubcat}
                  onChange={(selectedOption) => {
                    setSelectedSubCat(selectedOption);
                    field.onChange(selectedOption);
                  }}
                  options={options(subCategory)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                {error && <p className="error text-danger">{error.message}</p>}
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
            <option value="">Select</option>
            <option value="1 to 3 days">1 to 3 days</option>
            <option value="3 to 7 days">3 to 7 days</option>
            <option value="1 to 2 weeks">1 to 2 weeks</option>
            <option value="2 to 4 weeks">2 to 4 weeks</option>
            <option value="More than 4 weeks">More than 4 weeks</option>
          </select>
          {errors.recruitment_timeline?.message && (
            <p className="text-danger">
              {errors.recruitment_timeline?.message}
            </p>
          )}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Application Deadline Date</label>
          <input type="text" name="name" placeholder="06.04.2020" />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Country</label>
          <select className="chosen-single form-select">
            <option>Select</option>
            <option value="uk">United Kindom</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>City</label>
          <Controller
            name="city"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <Select
                  {...field}
                  options={options(city)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                {error && <p className="error text-danger">{error.message}</p>}
              </>
            )}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Pincode</label>
          <input
            type="number"
            name="pincode"
            placeholder="PinCode"
            {...register("pincode")}
          />
          {errors.pincode?.message && (
            <p className="text-danger">{errors.pincode?.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Complete Address</label>
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
        {/* 
        <div className="form-group col-lg-12 col-md-12">
          <div className="map-outer">
            <div style={{ height: "420px", width: "100%" }}>
              <Map />
            </div>
          </div>
        </div> */}

        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12 text-right">
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

export default PostBoxForm;
