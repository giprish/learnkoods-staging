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

  const onEditorStateChange = (editorState) => {
    setValue("job_des", editorState);
  };
  const editorContent = watch("job_des");

  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* <!-- Input --> */}

        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Description</label>

          <ReactQuill
            theme="snow"
            value={editorContent || ""}
            onChange={onEditorStateChange}
          />
          {errors?.job_des && (
            <p className="text-danger">{errors?.job_des?.message}</p>
          )}
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Skills </label>
          <Controller
            name="skills_req"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <Select
                  {...field}
                  isMulti
                  options={skillOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                {error && <p className="text-danger"> {error.message}</p>}
              </>
            )}
          />
        </div>

        <div className=" row">
          <div className="form-group col-lg-4 col-md-12">
            <label>Max Salary</label>
            <input
              type="number"
              name="max_salary"
              placeholder=""
              step="0.01"
              {...register("max_salary")}
            />
            {errors?.max_salary && (
              <p className="text-danger">{errors?.max_salary?.message}</p>
            )}
          </div>
          <div className="form-group col-lg-4 col-md-12">
            <label>Minimum Salary</label>
            <input
              type="number"
              name="min_salary"
              placeholder=""
              step="0.01"
              {...register("min_salary")}
            />
            {errors?.min_salary && (
              <p className="text-danger">{errors?.min_salary?.message}</p>
            )}
          </div>
          <div className="form-group col-lg-4 col-md-12">
            <label>Rate</label>
            <select className="chosen-single form-select" {...register("rate")}>
              <option>Select</option>
              <option value="per year">per year</option>
              <option value="per month">per month</option>
              <option value="per week">per week</option>
              <option value="per hour">per hour</option>
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
