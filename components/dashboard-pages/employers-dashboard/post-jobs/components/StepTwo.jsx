import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const StepTwo = ({ setTab, onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const maxSalary = watch("max_salary");
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

  useEffect(() => {
    register("job_des", { required: true, minLength: 11 });
  }, [register]);

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
            render={({ field }) => (
              <>
                <ReactQuill
                  value={field.value} // Make sure value is managed properly
                  onChange={(content) => field.onChange(content)} // Call onChange with content
                  theme="snow"
                />
                {errors?.job_des && (
                  <p className="text-danger">{errors?.job_des?.message}</p>
                )}
              </>
            )}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Desired Skills</label>
          <Controller
            name="skills_req"
            control={control}
            rules={{ required: "Skills are required" }}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  isMulti
                  options={skillOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                {errors?.job_des && (
                  <p className="text-danger">{errors?.job_des?.message}</p>
                )}
              </>
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
              min="0" // Prevents negative numbers
              onInput={(e) => {
                if (e.target.value < 0) e.target.value = 0; // Resets to 0 if a negative number is entered
              }}
              {...register("min_salary", {
                required: "Minimum salary is required",
                min: {
                  value: 0,
                  message: "Salary must be a positive number",
                },
                validate: {
                  lessThanMax: (value) =>
                    value <= maxSalary ||
                    "Minimum salary must be less than or equal to maximum salary",
                },
                valueAsNumber: true,
              })}
            />
            {errors?.min_salary && (
              <p className="text-danger">{errors?.min_salary?.message}</p>
            )}
          </div>
          <div className="form-group col-lg-4 col-md-12">
            <label>Maximum Salary</label>
            <input
              type="number"
              name="max_salary"
              placeholder="Maximum Salary"
              step="0.01"
              min="0" // Prevents negative numbers
              onInput={(e) => {
                if (e.target.value < 0) e.target.value = 0; // Resets to 0 if a negative number is entered
              }}
              {...register("max_salary", {
                required: "Maximum salary is required",
                min: {
                  value: 0,
                  message: "Salary must be a positive number",
                },
                valueAsNumber: true,
              })}
            />
            {errors?.max_salary && (
              <p className="text-danger">{errors?.max_salary?.message}</p>
            )}
          </div>
          <div className="form-group col-lg-4 col-md-12">
            <label>Rate</label>
            <select
              className="chosen-single form-select"
              {...register("rate_type")}
            >
              <option disabled>Select</option>
              <option value="Per Year">per year</option>
              <option value="Per Month">per month</option>
              <option value="Per Week">per week</option>
              <option value="Per Hour">per hour</option>
            </select>
            {errors?.rate && (
              <p className="text-danger">{errors?.rate?.message}</p>
            )}
          </div>
        </div>

        {/* <!-- Input --> */}

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

export default StepTwo;
