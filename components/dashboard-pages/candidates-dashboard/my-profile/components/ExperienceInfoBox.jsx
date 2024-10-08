"use client";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Map from "../../../Map";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Select from "react-select";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { userExperienceSchema } from "@/validation/validation";

const ExperienceInfoBox = () => {
  const [userId, setUserId] = useState("");
  const [access, setAccess] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("id"));
      setAccess(localStorage.getItem("access"));
    }
  }, []);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { dirtyFields, errors },
    getValues,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(userExperienceSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  const fetchExperience = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/exp-pro/${userId}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { data: userExperience } = useQuery({
    queryKey: ["userExperience", access],
    queryFn: () => fetchExperience(),
  });

  useEffect(() => {
    reset({ experience: userExperience?.data });
  }, [userExperience]);

  const [workingState, setWorkingState] = useState({});

  const addEntry = () => {
    append({});
  };

  const handleWorkingChange = (index) => {
    setWorkingState((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const createOrUpdateExperience = async ({ data, dirtyFields }) => {
    const createPromises = [];
    const updatePromises = [];

    data?.experience.forEach((experience, index) => {
      if (experience.id) {
        // Update existing experience
        const dirtyFieldsForExperience = dirtyFields.experience?.[index]
          ? Object.keys(dirtyFields.experience[index])
          : [];
        if (dirtyFieldsForExperience.length > 0) {
          const filteredExperience = dirtyFieldsForExperience.reduce(
            (acc, field) => {
              acc[field] = experience[field];
              return acc;
            },
            {}
          );

          updatePromises.push(
            axios.put(
              `${process.env.GLOBAL_API}/experience/${experience.id}/`,
              { ...filteredExperience },
              {
                headers: {
                  Authorization: `Bearer ${access}`,
                },
              }
            )
          );
        }
      } else {
        // Create new experience
        createPromises.push(
          axios.post(
            `${process.env.GLOBAL_API}/experience/`,
            { ...experience, user_profile: userId },
            {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            }
          )
        );
      }
    });

    // Wait for all promises to complete
    await Promise.all([...createPromises, ...updatePromises]);
  };

  const { mutate } = useMutation({
    mutationFn: createOrUpdateExperience,
    onSuccess: (data) => {
      console.log(data, "data from sucessful experience update");
      toast.success("Profile updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (error) => {
      console.log(error, "error message");
      const errorFields = [
        "title",
        "description",
        "employment_type",
        "company_name",
        "location",
        "location_type",
        "start_date",
        "end_date",
        "is_current",
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

  const onSubmit = () => {
    const formData = getValues();
    console.log(formData, "education data");
    console.log(dirtyFields, "dirty fields");
    mutate({ data: formData, dirtyFields });
  };

  const deleteFieldAPI = async (fieldId) => {
    const response = await axios.delete(
      `${process.env.GLOBAL_API}/experience/${fieldId}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    return response;
  };
  const deleteMutation = useMutation({
    mutationFn: deleteFieldAPI,
    onSuccess: (data) => {
      console.log(data, "data from sucessful experience delete");
      toast.success("experience deleted successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (error) => {
      console.log(error, "data from sucessful experience delete");
      toast.error("experience deletion successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const handleDelete = async (index) => {
    // Ensure userExperience.data exists and index is within bounds
    if (
      Array.isArray(userExperience?.data) &&
      index >= 0 &&
      index < userExperience.data.length
    ) {
      const fieldId = userExperience.data[index]?.id;

      if (fieldId) {
        deleteMutation.mutate(fieldId, {
          onSuccess: () => {
            remove(index);
          },
        });
      } else {
        remove(index);
      }
    } else {
      remove(index);
    }
  };

  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((item, index) => (
        <div className="row border rounded-3 p-2 mb-4 " key={item.id}>
          {/* <input type="hidden" {...register(`experience.${index}.id`)} /> */}
          <div className="form-group col-lg-12 col-md-12 d-flex flex-row-reverse">
            <button
              type="button"
              onClick={() => handleDelete(index)}
              className="border p-2 rounded-4 theme-btn btn-style-one"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Delete"
            >
              <i className="la la-trash font-weight-bold"></i>
            </button>
          </div>
          <div className="form-group col-lg-12 col-md-12">
            <label>Title</label>
            <input
              type="text"
              name={`experience[${index}].title`}
              placeholder="Title"
              {...register(`experience[${index}].title`)}
              required
            />
            {errors.experience?.[index]?.title && (
              <p className="text-danger">
                {errors.experience[index].title.message}
              </p>
            )}
          </div>
          <div className="form-group col-lg-12 col-md-12">
            <label>Description</label>
            <input
              type="text"
              name={`experience[${index}].description`}
              placeholder="Description"
              {...register(`experience[${index}].description`)}
              required
            />
            {errors.experience?.[index]?.description && (
              <p className="text-danger">
                {errors.experience[index].description.message}
              </p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Employment Type</label>
            <select
              className="chosen-single form-select"
              {...register(`experience[${index}].employment_type`)}
            >
              <option disabled>Select</option>
              <option value="Full_time">Full-time</option>
              <option value="Part_time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Temporary">Temporary</option>
            </select>
            {errors.experience?.[index]?.employment_type && (
              <p className="text-danger">
                {errors.experience[index].employment_type.message}
              </p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Company Name</label>
            <input
              type="text"
              name={`experience[${index}].company_name`}
              placeholder="Company Name"
              {...register(`experience[${index}].company_name`)}
              required
            />
            {errors.experience?.[index]?.company_name && (
              <p className="text-danger">
                {errors.experience[index].company_name.message}
              </p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Location</label>
            <input
              type="text"
              name={`experience[${index}].location`}
              placeholder="Location"
              {...register(`experience[${index}].location`)}
              required
            />
            {errors.experience?.[index]?.location && (
              <p className="text-danger">
                {errors.experience[index].location.message}
              </p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Location Type</label>
            <select
              className="chosen-single form-select"
              {...register(`experience[${index}].location_type`)}
            >
              <option disabled>Select</option>
              <option value="Remote">Remote</option>
              <option value="On-site">Onsite</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            {errors.experience?.[index]?.location_type && (
              <p className="text-danger">
                {errors.experience[index].location_type.message}
              </p>
            )}
          </div>

          <div className="form-group-date col-lg-6 col-md-12 ">
            <label className="">Start Date</label>
            <input
              type="date"
              name={`experience[${index}].start_date`}
              placeholder="Start Date"
              {...register(`experience[${index}].start_date`)}
              className="border p-3 rounded-3"
              required
            />
            {errors.experience?.[index]?.start_date && (
              <p className="text-danger">
                {errors.experience[index].start_date.message}
              </p>
            )}
          </div>
          {workingState[index] === false && (
            <>
              <div className="form-group-date col-lg-6 col-md-12">
                <label>End Date</label>
                <input
                  type="date"
                  name={`experience[${index}].end_date`}
                  placeholder="End Date"
                  {...register(`experience[${index}].end_date`)}
                  className="border p-3 rounded-3"
                />
                {errors.experience?.[index]?.end_date && (
                  <p className="text-danger">
                    {errors.experience[index].end_date.message}
                  </p>
                )}
              </div>
            </>
          )}
          <div className="form-group col-lg-12 col-md-12 p-4">
            <input
              type="checkbox"
              placeholder=""
              {...register(`experience[${index}].is_current`)}
              className="mx-4"
              onChange={() => handleWorkingChange(index)}
            />

            <label>I am currently working in this role</label>
            {errors.experience?.[index]?.is_current && (
              <p className="text-danger">
                {errors.experience[index].is_current.message}
              </p>
            )}
          </div>
        </div>
      ))}
      <div className="form-group col-lg-12 col-md-12">
        <button
          type="button"
          onClick={addEntry}
          className="theme-btn btn-style-one"
        >
          Add Experience
        </button>
      </div>
      <div className="m-0 pb-4 form-group col-lg-12 col-md-12">
        <button type="submit" className="theme-btn btn-style-one">
          Save
        </button>
      </div>
    </form>
  );
};

export default ExperienceInfoBox;
