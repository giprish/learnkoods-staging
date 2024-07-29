import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

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
          <label>User Name</label>
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
          <label>Position </label>

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
          <input
            type="text"
            name="name"
            placeholder="5-10 Years"
            {...register("experience_level")}
          />
          {errors.experience_level && (
            <p className="text-danger">{errors.experience_level.message}</p>
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

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-6 col-md-12">
          <label>Allow In Search & Listing</label>
          <select className="chosen-single form-select">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div> */}

        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Description</label>
          <textarea
            placeholder="Spent several years working on sheep on Wall Street. Had moderate success investing in Yugo's on Wall Street. Managed a small team buying and selling Pogo sticks for farmers. Spent several years licensing licorice in West Palm Beach, FL. Developed several new methods for working it banjos in the aftermarket. Spent a weekend importing banjos in West Palm Beach, FL.In this position, the Software Engineer collaborates with Evention's Development team to continuously enhance our current software solutions as well as create new solutions to eliminate the back-office operations and management challenges present"
            {...register("profile_desc")}
          ></textarea>
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
