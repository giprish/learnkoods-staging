import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import Tooltip from "@/components/tooltip/ToolTip";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const FormInfoBox = ({ onSubmit, onError }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useFormContext();

  const fetchIndustry = async () => {
    const response = await axios.get(`${process.env.GLOBAL_API}/industry_api/`);
    return response.data;
  };

  const { data: positions } = useQuery({
    queryKey: ["industryData"],
    queryFn: () => fetchIndustry(),
  });

  const fetchSkill = async () => {
    const response = await axios.get(`${process.env.GLOBAL_API}/skill_api/`);
    return response.data;
  };

  const { data: skills } = useQuery({
    queryKey: ["skillData"],
    queryFn: () => fetchSkill(),
  });

  const options = positions?.data?.map((option) => ({
    value: option.id,
    label: option.name,
  }));
  const skillOption = skills?.data?.map((option) => ({
    value: option.id,
    label: option.data,
  }));

  return (
    <form
      action="#"
      className="default-form"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            {...register("first_name")}
          />
          {errors.first_name && (
            <p className="text-danger">{errors.first_name.message}</p>
          )}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            {...register("last_name")}
          />
          {errors.last_name && (
            <p className="text-danger">{errors.last_name.message}</p>
          )}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-danger">{errors.username.message}</p>
          )}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Gender</label>
          <select className="chosen-single form-select" {...register("gender")}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          {errors.gender && (
            <p className="text-danger">{errors.gender.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Currently working as </label>

          <Controller
            name="position"
            control={control}
            rules={{ required: "Please select position" }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti={false}
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            )}
          />
          {errors.position && (
            <p className="text-danger">{errors.position.message}</p>
          )}
        </div>
        {/* <!-- Input --> */}

        <div className="form-group col-lg-3 col-md-12">
          <label>Current Salary($)</label>
          <input
            type="number"
            name="current_salary"
            placeholder="Current Salary"
            {...register("current_salary", {
              valueAsNumber: true, // Convert the input value to a number
            })}
          />
          {errors.current_salary && (
            <p className="text-danger">{errors.current_salary.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-3 col-md-12">
          <label>Expected Salary($)</label>
          <input
            type="number"
            name="expected_salary"
            placeholder="Expected Salary"
            {...register("expected_salary", {
              valueAsNumber: true, // Convert the input value to a number
            })}
            required
          />
          {errors.expected_salary && (
            <p className="text-danger">{errors.expected_salary.message}</p>
          )}
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Age</label>
          <input
            type="number"
            name="age"
            placeholder="Age"
            {...register("age", {
              valueAsNumber: true, // Convert the input value to a number
            })}
          />
          {errors.age && <p className="text-danger">{errors.age.message}</p>}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Languages</label>
          <input
            type="text"
            name="name"
            placeholder="Languages"
            {...register("languages")}
          />
          {errors.languages && (
            <p className="text-danger">{errors.languages.message}</p>
          )}
        </div>

        {/* <!-- Search Select --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Skills </label>
          <Controller
            name="skills"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={skillOption}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            )}
          />
          {errors.skills && (
            <p className="text-danger">{errors.skills.message}</p>
          )}
        </div>

        <div className="form-group col-lg-12 col-md-12">
          <label>About Me</label>
          <Controller
            name="profile_desc"
            control={control}
            render={({ field }) => (
              <>
                <ReactQuill
                  value={field.value} // Make sure value is managed properly
                  onChange={(content) => field.onChange(content)} // Call onChange with content
                  theme="snow"
                />
                {errors.profile_desc && (
                  <p className="text-danger">{errors.profile_desc.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <button type="submit" className="theme-btn btn-style-one">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormInfoBox;
