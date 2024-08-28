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
            placeholder="Jerome"
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
            placeholder="kumar"
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
            placeholder="John Doe"
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
            placeholder=""
            {...register("current_salary")}
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
            placeholder=""
            {...register("expected_salary")}
          />
          {errors.expected_salary && (
            <p className="text-danger">{errors.expected_salary.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Experience</label>

          <select
            className="chosen-single form-select"
            {...register("experience_level")}
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
          {errors.experience_level?.message && (
            <p className="text-danger">{errors.experience_level?.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Age</label>
          <input
            type="number"
            name="age"
            placeholder="20"
            {...register("age")}
          />
          {errors.age && <p className="text-danger">{errors.age.message}</p>}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Education Levels</label>
          <input
            type="text"
            name="name"
            placeholder="Certificate"
            {...register("education_level")}
          />
          {errors.education_level && (
            <p className="text-danger">{errors.education_level.message}</p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Languages</label>
          <input
            type="text"
            name="name"
            placeholder="English, Turkish"
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
            // defaultValue={[]}
            // rules={{ required: "Please select at least one skill" }}
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
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <ReactQuill
                {...field}
                theme="snow"
                onChange={(content) => field.onChange(content)}
              />
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
