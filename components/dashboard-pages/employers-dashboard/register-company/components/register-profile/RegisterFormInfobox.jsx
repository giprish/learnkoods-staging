import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Controller, useFormContext } from "react-hook-form";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Tooltip from "@/components/tooltip/ToolTip";
import { toast } from "react-toastify";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const RegisterFormInfoBox = ({
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
    getValues,
  } = useFormContext();

  const [access, setAccess] = useState(null);
  useEffect(() => {
    const access = window.localStorage.getItem("access");
    setAccess(access);
  }, []);

  const fetch = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };
  const fetchIndustry = async () => {
    const response = await axios.get(`${process.env.GLOBAL_API}/industry_api/`);
    return response.data;
  };

  const { data: industry } = useQuery({
    queryKey: ["industryData"],
    queryFn: () => fetchIndustry(),
  });

  const { data: country } = useQuery({
    queryKey: ["countryData"],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/country/`),
  });

  const { data: state } = useQuery({
    queryKey: ["stateData", countryId],
    queryFn: () =>
      fetch(`${process.env.GLOBAL_API}/state/${countryId?.value}/`),
    enabled: !!countryId?.value,
  });

  const { data: city } = useQuery({
    queryKey: ["cityData", stateId],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/city/${stateId?.value}/`),
    enabled: !!countryId?.value,
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

  const generateDescriptionFn = async (formdata) => {
    const { data: response } = await axios.post(
      `${process.env.GLOBAL_API}/comp-desc-ai/`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response;
  };
  const { mutate } = useMutation({
    mutationFn: generateDescriptionFn,
    onSuccess: (data) => {
      console.log(data, "data from sucessful description generated");
      const formattedHTML = data?.data
        ?.map((line) => (line.trim() === "" ? "<br/>" : `<p>${line}</p>`))
        .join("");
      setValue("description", formattedHTML);
      toast.success("Company description generated", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (error) => {
      console.log(error, "error message from api");
      toast.error("Couldnot generate description", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const generate = () => {
    const data = {
      name: getValues("name"),
      industry: getValues("industry")?.label,
    };
    console.log(data);
    mutate(data);
  };
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
            placeholder="Company Website url"
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
          <select
            name="established"
            className="chosen-single form-select"
            {...register("since")}
            required
          >
            <option value="">Select Year</option>
            {Array.from(
              { length: new Date().getFullYear() - 1900 + 1 },
              (_, i) => {
                const year = 1900 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              }
            )}
          </select>

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
            {...register("pincode")}
          />
          {errors.pincode && (
            <p className="text-danger">{errors.pincode.message}</p>
          )}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Address Line 1 <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="address1"
            placeholder=" Address Line 1"
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
            placeholder=" Address Line 2"
            required
            {...register("address")}
          />
          {errors.address && (
            <p className="text-danger">{errors?.address?.message}</p>
          )}
        </div>
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
          <button
            className="theme-btn btn-style-blue mt-3"
            type="button"
            onClick={generate}
          >
            Generate Description
          </button>
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

export default RegisterFormInfoBox;
