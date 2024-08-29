"use client";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Map from "../../../Map";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Select from "react-select";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { userEducationSchema } from "@/validation/validation";

const EducationInfoBox = () => {
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
    setValue,
    formState: { dirtyFields, errors },
    getValues,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(userEducationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const fetchEducation = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/educations-list/${userId}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { data: userEducation } = useQuery({
    queryKey: ["userEducation", access],
    queryFn: () => fetchEducation(),
  });

  useEffect(() => {
    reset({ education: userEducation?.data });
    console.log("Form after reset:", getValues());
  }, [userEducation]);
  console.log(userEducation?.data);

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

  const createOrUpdateEducation = async ({ data, dirtyFields }) => {
    const createPromises = [];
    const updatePromises = [];

    data?.education.forEach((education, index) => {
      if (education.id) {
        // Update existing education
        const dirtyFieldsForEducation = dirtyFields.education?.[index]
          ? Object.keys(dirtyFields.education[index])
          : [];
        if (dirtyFieldsForEducation.length > 0) {
          const filteredEducation = dirtyFieldsForEducation.reduce(
            (acc, field) => {
              acc[field] = education[field];
              return acc;
            },
            {}
          );

          updatePromises.push(
            axios.put(
              `${process.env.GLOBAL_API}/educations/${education.id}/`,
              { ...filteredEducation },
              {
                headers: {
                  Authorization: `Bearer ${access}`,
                },
              }
            )
          );
        }
      } else {
        // Create new education
        createPromises.push(
          axios.post(
            `${process.env.GLOBAL_API}/educations/`,
            { ...education, user_profile: userId },
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
    mutationFn: createOrUpdateEducation,
    onSuccess: (data) => {
      console.log(data, "data from sucessful education update");
      toast.success("Profile updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (error) => {
      console.log(error, "error message");
      toast.error("education update Unsuccessful", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const onSubmit = (data) => {
    const formData = getValues();
    console.log(formData, "education data");
    console.log(dirtyFields, "dirty fields");
    mutate({ data: formData, dirtyFields });
  };

  const deleteFieldAPI = async (fieldId) => {
    const response = await axios.delete(
      `${process.env.GLOBAL_API}/educations/${fieldId}/`,
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
      console.log(data, "data from sucessful education delete");
      toast.success("education deleted successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (error) => {
      console.log(error, "error message");
      const errorFields = [
        "institution_name",
        "field_of_study",
        "degree",
        "location",
        "grade",
        "description",
        "start_date",
        "end_date",
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

  const handleDelete = async (index) => {
    const fieldId = userEducation?.data[index]?.id;
    if (fieldId) {
      deleteMutation.mutate(fieldId, {
        onSuccess: () => {
          remove(index);
        },
      });
    } else {
      remove(index);
    }
  };

  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((item, index) => (
        <div className="row border rounded-3 p-2 mb-4 " key={item.id}>
          <input type="hidden" {...register(`education.${index}.id`)} />
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
            <label>School or Institute Name</label>
            <input
              type="text"
              name={`education[${index}].title`}
              placeholder="University of Pennsylvania"
              {...register(`education[${index}].institution_name`)}
            />
            {errors.education?.[index]?.institution_name && (
              <p className="text-danger">
                {errors.education[index].institution_name.message}
              </p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Field of Study</label>
            <input
              type="text"
              name={`education[${index}].field_of_study`}
              placeholder="Btech"
              {...register(`education[${index}].field_of_study`)}
            />
            {errors.education?.[index]?.field_of_study && (
              <p className="text-danger">
                {errors.education[index].field_of_study.message}
              </p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Degree</label>

            <select
              className="chosen-single form-select"
              {...register(`education[${index}].degree`)}
            >
              <option disabled>Select</option>
              <option value="HS">High School</option>
              <option value="AD">Associate Degree</option>
              <option value="BD">Bachelor's Degree</option>
              <option value="MD">Master's Degree</option>
              <option value="PHD">Doctorate</option>
              <option value="OT">Other</option>
            </select>
            {errors.education?.[index]?.degree && (
              <p className="text-danger">
                {errors.education[index].degree.message}
              </p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Location</label>
            <input
              type="text"
              name={`education[${index}].location`}
              placeholder="Location"
              {...register(`education[${index}].location`)}
            />
            {errors.education?.[index]?.location && (
              <p className="text-danger">
                {errors.education[index].location.message}
              </p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Grade</label>
            <input
              type="text"
              name={`education[${index}].grade`}
              placeholder="Location Type"
              {...register(`education[${index}].grade`)}
            />
            {errors.education?.[index]?.grade && (
              <p className="text-danger">
                {errors.education[index].grade.message}
              </p>
            )}
          </div>
          <div className="form-group col-lg-12 col-md-12">
            <label>Description</label>
            <input
              type="text"
              name={`education[${index}].description`}
              placeholder="Location Type"
              {...register(`education[${index}].description`)}
            />
            {errors.education?.[index]?.description && (
              <p className="text-danger">
                {errors.education[index].description.message}
              </p>
            )}
          </div>
          <div className="form-group-date col-lg-6 col-md-12 ">
            <label className="">Start Date</label>
            <input
              type="date"
              name={`education[${index}].start_date`}
              placeholder="Additional Field 1"
              {...register(`education[${index}].start_date`)}
              className="border p-3 rounded-3"
            />
            {errors.education?.[index]?.start_date && (
              <p className="text-danger">
                {errors.education[index].start_date.message}
              </p>
            )}
          </div>

          {/* {!workingState[index] && ( */}
          <>
            <div className="form-group-date col-lg-6 col-md-12">
              <label>End Date</label>
              <input
                type="date"
                name={`education[${index}].end_date`}
                placeholder="Additional Field 2"
                {...register(`education[${index}].end_date`)}
                className="border p-3 rounded-3"
              />
              {errors.education?.[index]?.end_date && (
                <p className="text-danger">
                  {errors.education[index].end_date.message}
                </p>
              )}
            </div>
          </>
        </div>
      ))}
      <div className="form-group col-lg-12 col-md-12">
        <button
          type="button"
          onClick={addEntry}
          className="theme-btn btn-style-one"
        >
          Add Education
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

export default EducationInfoBox;
