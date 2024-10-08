import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import Tooltip from "@/components/tooltip/ToolTip";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const FormInfoBox = ({
  onSubmit,
  logo,
  handleLogo,
  countryId,
  setCountryId,
  stateId,
  setStateId,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();

  const fetch = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  const { data: industry } = useQuery({
    queryKey: ["industryData"],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/industry_api/`),
  });
  console.log(industry, "industry");
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

  // useEffect(() => {
  //   register("description", { required: true, minLength: 11 });
  // }, [register]);

  // const onEditorStateChange = (editorState) => {
  //   setValue("description", editorState);
  // };
  // const editorContent = watch("description");
  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Company name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Company name"
            {...register("name")}
            required
          />
          {errors.name && (
            <p className="text-danger">{errors?.name?.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Email <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-danger">{errors?.email?.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Phone <span style={{ color: "red" }}>*</span>
          </label>
          <Controller
            name="phone_number"
            control={control}
            rules={{ required: "Phone number is required" }}
            render={({ field }) => (
              <>
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
                {errors.phone_number && (
                  <p className="text-danger">{errors?.phone_number?.message}</p>
                )}
              </>
            )}
          />
          {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Company Website <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="url"
            name="website"
            placeholder="Company Website Url"
            required
            {...register("website")}
          />
          {errors.website && (
            <p className="text-danger">{errors?.website?.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Established Since</label>
          <input
            type="date"
            name="established"
            className="form-control py-3"
            {...register("since")}
            required
          />
          {errors.since && (
            <p className="text-danger">{errors?.since?.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Team Size</label>
          <select
            className="chosen-single form-select"
            {...register("team_size")}
          >
            <option disabled>Select</option>
            <option value="50-100">50-100</option>
            <option value="100-150">100-150</option>
            <option value="150-200">150-200</option>
            <option value="200-250">200-250</option>
            <option value="250-300">250-300</option>
            <option value="300-500">300-500</option>
            <option value="500+">500+</option>
          </select>
          {errors.team_size && (
            <p className="text-danger">{errors?.team_size?.message}</p>
          )}
        </div>

        {/* <!-- Search Select --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Industry <span style={{ color: "red" }}>*</span>
          </label>
          <Controller
            name="industry"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  options={options(industry)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                {errors.industry && (
                  <p className="text-danger">{errors?.industry?.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label className="" for="job_image">
            Company Logo <span style={{ color: "red" }}>*</span>
            <Tooltip title={"Resolution"} text={""} />
          </label>
          {logo ? (
            <>
              <div className="d-flex flex-row uploadButton justify-content-center align-items-center">
                <input
                  className=" form-control py-3 logo-input"
                  type="file"
                  name="profile_image"
                  accept="image/*"
                  id="upload"
                  required={!(logo.url.length > 2 || logo.file)}
                  onChange={(e) => {
                    handleLogo(e);
                  }}
                />
                {logo.url.length > 2 && !logo.file && (
                  <Image
                    src={`${logo?.url}`}
                    width={50}
                    height={50}
                    alt="profile image"
                    className="rounded-circle border"
                  />
                )}
                {logo.file && (
                  <img
                    src={URL.createObjectURL(logo.file)}
                    alt="preview"
                    width="50"
                    height="50"
                    className="uploadedImage rounded-circle border"
                  />
                )}
              </div>
              {errors.profile_image && (
                <p className="text-danger">{errors?.profile_image?.message}</p>
              )}
            </>
          ) : (
            <>
              {" "}
              <label className="" for="job_image">
                Company Logo <span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="form-control py-3 "
                type="file"
                name="profile_image"
                accept="image/*"
                id="upload"
                required
                onChange={(e) => {
                  handleLogo(e);
                }}
              />
              {errors.profile_image && (
                <p className="text-danger">{errors?.profile_image?.message}</p>
              )}
            </>
          )}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Country <span style={{ color: "red" }}>*</span>
          </label>
          <Controller
            name="country"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field, fieldState: { error } }) => (
              <>
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
                {errors.country && (
                  <p className="text-danger">{errors?.country?.message}</p>
                )}
                {/* Display error */}
              </>
            )}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>
            State <span style={{ color: "red" }}>*</span>
          </label>
          <Controller
            name="state"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field, fieldState: { error } }) => (
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
                  <p className="text-danger">{errors?.state?.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>
            City <span style={{ color: "red" }}>*</span>
          </label>
          <Controller
            name="city"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Select
                  {...field}
                  options={options(city)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                {errors.city && (
                  <p className="text-danger">{errors?.city?.message}</p>
                )}
              </>
            )}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Zipcode <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="pincode"
            placeholder="Zipcode"
            required
            {...register("pincode")}
          />
          {errors.pincode && (
            <p className="text-danger">{errors?.pincode?.message}</p>
          )}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Address Line 1 <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="address1"
            placeholder="Address Line 1"
            required
            {...register("address1")}
          />
          {errors.address1 && (
            <p className="text-danger">{errors?.address1?.message}</p>
          )}
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>
            Address Line 2 <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Address Line 2"
            required
            {...register("address")}
          />
          {errors.address && (
            <p className="text-danger">{errors?.address?.message}</p>
          )}
        </div>

        {/* <!-- About Company --> */}
        {/* <div className="form-group col-lg-12 col-md-12">
        <label>About Company</label>
        <textarea
          placeholder="Welcome to [Company Name], where innovation meets excellence. Founded in [Year], we are dedicated to delivering top-quality [products/services] that make a difference in people's lives. Our mission is to [brief mission statement or core goal], and we strive to achieve this through [brief mention of strategy or values].At [Company Name], our team of passionate professionals is committed to [mention unique selling points, e.g., customer satisfaction, sustainable practices, cutting-edge technology, etc.]. We believe in continuous improvement and are always looking for new ways to innovate and grow.Join us on our journey as we aim to shape the future of [industry or field] and provide unmatched value to our customers."
          {...register("description")}
        ></textarea>
      </div> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>About Company</label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <ReactQuill
                {...field}
                theme="snow"
                onChange={(content) => field.onChange(content)}
              />
            )}
          />

          {errors.description && (
            <p style={{ color: "red" }}>{errors.description.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <button className="theme-btn btn-style-one" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormInfoBox;
