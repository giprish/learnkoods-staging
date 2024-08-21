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
}) => {
  const { register, handleSubmit, control, resetField } = useFormContext();
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

  useEffect(() => {
    setSubCat({
      value: 0,
      label: "",
    });
  }, [cat.value]);

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
            <option value="">Select</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Experience</label>
          <input
            type="text"
            name="exp_required"
            placeholder=""
            {...register("exp_required")}
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Gender</label>
          <select className="chosen-single form-select" {...register("gender")}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Url</label>
          <input type="url" name="url" placeholder="Url" {...register("url")} />
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
            className="form-control py-3 "
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Is published</label>
          <input {...register("is_published")} type="checkbox" />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Is Closed</label>
          <input {...register("is_closed")} type="checkbox" />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Category</label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={cat}
                options={options(category)}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) => {
                  setCat(e);
                  field.onChange(e);
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
                  value={subcat}
                  onChange={(selectedOption) => {
                    setSubCat(selectedOption);
                    field.onChange(selectedOption);
                  }}
                  options={options(subCategory)}
                  className="basic-multi-select"
                  classNamePrefix="select"
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
            <option value="">Select</option>
            <option value="1 to 3 days">1 to 3 days</option>
            <option value="3 to 7 days">3 to 7 days</option>
            <option value="1 to 2 weeks">1 to 2 weeks</option>
            <option value="2 to 4 weeks">2 to 4 weeks</option>
            <option value="More than 4 weeks">More than 4 weeks</option>
          </select>
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Application Deadline Date</label>
          <input type="text" name="name" placeholder="06.04.2020" />
        </div>

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-6 col-md-12">
          <label>Country</label>
          <select className="chosen-single form-select">
            <option>Select</option>
            <option value="uk">United Kindom</option>
          </select>
        </div> */}

        {/* <!-- Input --> */}
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
        <div className="form-group col-lg-12 col-md-12">
          <label>Complete Address</label>
          <input
            type="text"
            name="name"
            placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
            {...register("location")}
          />
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

export default PostjobForm;
