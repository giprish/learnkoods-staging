import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";

import { useEffect, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const UpdateStepTwo = ({ setTab, onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [jobDesc, setJobDesc] = useState("");

  const fetch = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };
  const { data: skills } = useQuery({
    queryKey: ["skillData"],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/skill_api/`),
  });

  const skillOptions = skills?.data.map((skill) => {
    return {
      value: skill.id,
      label: skill.data,
    };
  });

  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* <!-- Input --> */}

        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Description</label>
          <Controller
            name="job_des"
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
        <div className="form-group col-lg-6 col-md-12">
          <label>Desired Skills</label>
          <Controller
            name="skills_req"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={skillOptions}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            )}
          />
        </div>

        <div className=" row">
          <div className="form-group col-lg-4 col-md-12">
            <label>Minimum Salary</label>
            <input
              type="number"
              name="min_salary"
              placeholder="Minimum Salary"
              step="0.01"
              {...register("min_salary")}
            />
          </div>
          <div className="form-group col-lg-4 col-md-12">
            <label>Maximum Salary</label>
            <input
              type="number"
              name="max_salary"
              placeholder="Maximum Salary"
              step="0.01"
              {...register("max_salary")}
            />
            {errors?.max_salary && (
              <p className="text-danger">{errors?.max_salary?.message}</p>
            )}
          </div>
          <div className="form-group col-lg-4 col-md-12">
            <label>Rate</label>
            <select className="chosen-single form-select" {...register("rate")}>
              <option value="">Select</option>
              <option value="per year">per year</option>
              <option value="per month">per month</option>
              <option value="per week">per week</option>
              <option value="per hour">per hour</option>
            </select>
          </div>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-6 text-right">
          <button className="theme-btn btn-style-one" type="submit">
            Save
          </button>
        </div>
        <div className="form-group col-lg-6 col-md-6 text-right">
          <button
            className="theme-btn btn-style-one"
            onClick={() => setTab("step1")}
            type="button"
          >
            Previous
          </button>
        </div>

        <div className="form-group col-lg-6 col-md-6 text-right d-flex justify-content-end">
          <button
            className="theme-btn btn-style-one"
            type="button"
            onClick={() => setTab("step3")}
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateStepTwo;
