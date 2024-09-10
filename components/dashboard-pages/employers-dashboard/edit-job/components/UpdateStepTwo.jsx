import { jobUpdateSecondSchema } from "@/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { toast } from "react-toastify";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const UpdateStepTwo = ({ setTab }) => {
  const {
    reset,
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, dirtyFields },
    getValues,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(jobUpdateSecondSchema),
  });
  const maxSalary = watch("max_salary");
  const router = useRouter();
  const id = router.query.id;
  const access = window.localStorage.getItem("access");

  const fetch = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };
  const { data: skills } = useQuery({
    queryKey: ["skillData"],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/skill_api/`),
  });

  const skillOptions = skills?.data?.map((skill) => {
    return {
      value: skill.id,
      label: skill.data,
    };
  });

  const { data: job } = useQuery({
    queryKey: ["job", id],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/job_api/${id}/`),
  });

  useEffect(() => {
    if (job) {
      let skills = job?.data?.skills_req?.map((skill) => {
        return { label: skill.data, value: skill.id };
      });
      setValue("job_des", job?.data?.job_des);
      setValue("skills_req", skills);
      setValue("max_salary", job?.data?.max_salary);
      setValue("min_salary", job?.data?.min_salary);
      setValue("rate_type", job?.data?.rate_type);
      setValue("currency_symbol", job?.data?.currency_symbol);
    }
  }, [job]);

  const updateJob = async (formData) => {
    const { data: response } = await axios.put(
      `${process.env.GLOBAL_API}/job_api/${id}/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-type": "multipart/form-data",
        },
      }
    );
    return response;
  };
  const { mutate, isLoading } = useMutation({
    mutationFn: updateJob,
    onSuccess: (data) => {
      console.log(data, "data from sucessful job update");
      toast.success("Job updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      //   window.localStorage.setItem("company_id", data.data.id);
    },
    onError: (error) => {
      console.log(error, "error message");
      const errorFields = [
        "job_title",
        "job_type",
        "workplace_type",
        "exp_required",
        "gender",
        "url",
        "is_published",
        "is_closed",
        "category",
        "sub_category",
        "recruitment_timeline",
        "country",
        "state",
        "city",
        "pincode",
        "location1",
        "location",
        "job_des",
        "skills_req",
        "max_salary",
        "min_salary",
        "rate",
        "currency_symbol",
      ];

      let errorHandled = false;

      errorFields.forEach((field) => {
        if (error.response.data[field]) {
          const errorMessage = Array.isArray(error.response.data[field])
            ? error.response.data[field][0]
            : error.response.data[field].error || error.response.data[field];

          toast.error(`${field}: ${errorMessage}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          errorHandled = true;
        }
      });
      // Handle errors not in the errorFields array
      if (!errorHandled) {
        toast.error("An unexpected error occurred. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    },
  });

  const onSubmit = (data) => {
    // Debugging: Log dirtyFields to ensure it's being populated correctly
    console.log(data, "original data");
    console.log("Dirty Fields:", dirtyFields);
    if (dirtyFields.category) {
      delete dirtyFields.category;
    }
    const formData = new FormData();

    const dirtyData = Object.keys(data).reduce((acc, key) => {
      if (dirtyFields[key]) {
        if (Array.isArray(data[key]) && key === "questions") {
          // Handle multi-select fields by extracting labels
          acc[key] = data[key]?.map((option) => ({
            question_name: option.question_name,
            must_have: option.must_have,
          }));
        } else if (Array.isArray(data[key])) {
          // Handle multi-select fields by extracting labels
          acc[key] = data[key]?.map((option) => ({
            data: option.label,
          }));
        } else if (typeof data[key] === "object" && data[key].value) {
          // If the value is an object and has a value property, extract it
          acc[key] = data[key].value;
        } else {
          // Handle other fields
          acc[key] = data[key];
        }
      }
      return acc;
    }, {});
    // Debugging: Log dirtyData to ensure it's being populated correctly
    console.log("Dirty Data:", dirtyData);

    // Print the FormData entries
    for (const key in dirtyData) {
      if (key === "skills_req" && Array.isArray(dirtyData[key])) {
        dirtyData[key].forEach((element, index) => {
          formData.append(`skills_req[${index}]data`, element.data);
        });
        // formData.append(key, JSON.stringify(dirtyData[key]));
      }
      if (key === "questions" && Array.isArray(dirtyData[key])) {
        dirtyData[key].forEach((element, index) => {
          formData.append(
            `questions[${index}]question_name`,
            element.question_name
          );
          formData.append(`questions[${index}]must_have`, element.must_have);
        });
        // formData.append(key, JSON.stringify(dirtyData[key]));
      } else {
        formData.append(key, dirtyData[key]);
      }
    }
    // for (const key in postData) {
    //   formData.append(key, JSON.stringify(postData[key]));
    // }

    // Append the logo if it exists

    for (let pair of formData.entries()) {
      console.log(
        pair[0],
        Array.isArray(pair[1])
          ? pair[1]?.map((obj) => JSON.stringify(obj))
          : pair[1]
      );
    }

    // Debugging: Log formData entries to ensure correct data is being appended

    mutate(formData);
    // Submit only dirtyData to your API
  };
  const onError = (error) => {
    console.log(error);
  };
  const generateDescriptionFn = async (formdata) => {
    const { data: response } = await axios.post(
      `${process.env.GLOBAL_API}/job-desc-ai/`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response;
  };
  const { mutate: generateDescription } = useMutation({
    mutationFn: generateDescriptionFn,
    onSuccess: (data) => {
      console.log(data, "data from sucessful description generated");
      const formattedHTML = data?.data
        ?.map((line) => (line.trim() === "" ? "<br/>" : `<p>${line}</p>`))
        .join("");
      setValue("job_des", formattedHTML);
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
    const skills_req = getValues("skills_req")?.map((skill) => {
      return skill.label;
    });
    const data = {
      title: job?.data?.job_title,
      job_type: job?.data?.job_type,
      work_type: job?.data?.workplace_type,
      experience: job?.data?.exp_required,
      skills: skills_req,
    };
    // console.log(data);
    // console.log(skills_req);
    generateDescription(data);
  };

  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="row">
        {/* <!-- Input --> */}

        {/* <!-- About Company --> */}
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
          <button
            className="theme-btn btn-style-blue mt-3"
            type="button"
            onClick={generate}
          >
            Generate AI based Description
          </button>
        </div>

        <div className="form-group col-lg-2 col-md-1">
          <label>Currency</label>
          <select
            className="chosen-single form-select"
            {...register("currency_symbol")}
          >
            <option disabled>Select</option>
            <option value="&#36;">&#36;</option>
            <option value="&#163;">&#163;</option>
            <option value="&#8377;">&#8377;</option>
          </select>
          {errors.currency_symbol?.message && (
            <p className="text-danger">{errors.currency_symbol?.message}</p>
          )}
        </div>

        <div className="form-group col-lg-3 col-md-12">
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
              valueAsNumber: true, // Ensures the value is treated as a number
            })}
          />
          {errors?.min_salary && (
            <p className="text-danger">{errors?.min_salary?.message}</p>
          )}
        </div>

        <div className="form-group col-lg-3 col-md-12">
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
              valueAsNumber: true, // Ensures the value is treated as a number
            })}
          />
          {errors?.max_salary && (
            <p className="text-danger">{errors?.max_salary?.message}</p>
          )}
        </div>

        <div className="form-group col-lg-3 col-md-12">
          <label>Rate</label>
          <select
            className="chosen-single form-select"
            {...register("rate_type", {
              required: "Rate type is required",
            })}
          >
            <option disabled>Select</option>
            <option value="Per Year">per year</option>
            <option value="Per Month">per month</option>
            <option value="Per Week">per week</option>
            <option value="Per Hour">per hour</option>
          </select>
          {errors?.rate_type && (
            <p className="text-danger">{errors?.rate_type?.message}</p>
          )}
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
