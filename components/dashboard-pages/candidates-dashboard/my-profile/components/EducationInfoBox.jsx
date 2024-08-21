"use client";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Map from "../../../Map";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Select from "react-select";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
    formState: { dirtyFields, errors },
  } = useForm();

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
  }, [userEducation]);

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
    console.log(data, "education data");
    console.log(dirtyFields);
    mutate({ data, dirtyFields });
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
      console.log(error, "data from sucessful education delete");
      toast.error("education deletion successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
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
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Field of Study</label>
            <input
              type="text"
              name={`education[${index}].employment_type`}
              placeholder="Btech"
              {...register(`education[${index}].field_of_study`)}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Degree</label>

            <select
              className="chosen-single form-select"
              {...register(`education[${index}].degree`)}
            >
              <option value="">Select</option>
              <option value="HS">High School</option>
              <option value="AD">Associate Degree</option>
              <option value="BD">Bachelor's Degree</option>
              <option value="MD">Master's Degree</option>
              <option value="PHD">Doctorate</option>
              <option value="OT">Other</option>
            </select>
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Location</label>
            <input
              type="text"
              name={`education[${index}].location`}
              placeholder="Location"
              {...register(`education[${index}].location`)}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Grade</label>
            <input
              type="text"
              name={`education[${index}].location_type`}
              placeholder="Location Type"
              {...register(`education[${index}].grade`)}
            />
          </div>
          <div className="form-group col-lg-12 col-md-12">
            <label>Description</label>
            <input
              type="text"
              name={`education[${index}].location_type`}
              placeholder="Location Type"
              {...register(`education[${index}].description`)}
            />
          </div>
          <div className="form-group-date col-lg-6 col-md-12 ">
            <label className=""></label>
            <input
              type="date"
              name={`education[${index}].start_date`}
              placeholder="Additional Field 1"
              {...register(`education[${index}].start_date`)}
              className="border p-3 rounded-3"
            />
          </div>

          {!workingState[index] && (
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
              </div>
            </>
          )}
          <div className="form-group col-lg-12 col-md-12 p-4">
            <input
              type="checkbox"
              placeholder="creativelayers"
              {...register(`education[${index}].working`)}
              className="mx-4"
              onChange={() => handleWorkingChange(index)}
            />
            <label>I am currently studying here</label>
          </div>
        </div>
      ))}
      <div className="form-group col-lg-12 col-md-12">
        <button
          type="button"
          onClick={addEntry}
          className="theme-btn btn-style-one"
        >
          Add
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
