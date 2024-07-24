"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { element } from "prop-types";
import { useEffect, useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { toast } from "react-toastify";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const UpdateStepThree = ({ setTab }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { dirtyFields },
    setValue,
  } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "questions", // unique name for your Field Array
    }
  );
  const access = window.localStorage.getItem("access");
  const userId = window.localStorage.getItem("id");
  const router = useRouter();
  const job_id = router.query.id;

  const addEntry = () => {
    append({});
  };
  const [questionIds, setQuestionIds] = useState([]);

  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/get-ques/${job_id}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { data: question } = useQuery({
    queryKey: ["questions", access],
    queryFn: () => fetchData(),
  });

  const quesdataWithIds = question?.data.map((item) => ({
    ...item,
  }));
  useEffect(() => {
    if (question) {
      reset({ questions: quesdataWithIds });
      setQuestionIds(question.data.map((item) => item.id));
    }
    console.log(question);
  }, [question]);

  const createOrUpdateExperience = async ({ data, dirtyFields }) => {
    const createPromises = [];
    const updatePromises = [];

    data?.questions.forEach((question, index) => {
      if (question.id) {
        // Update existing question
        // Check if there are dirty fields for this question
        const dirtyFieldsForQuestion = dirtyFields.questions?.[index]
          ? Object.keys(dirtyFields.questions[index])
          : [];
        if (dirtyFieldsForQuestion.length > 0) {
          const filteredQuestion = dirtyFieldsForQuestion.reduce(
            (acc, field) => {
              acc[field] = question[field];
              return acc;
            },
            {}
          );

          updatePromises.push(
            axios.put(
              `${process.env.GLOBAL_API}/questions/${question.id}/`,
              { ...filteredQuestion },
              {
                headers: {
                  Authorization: `Bearer ${access}`,
                },
              }
            )
          );
        }
      } else {
        // Create new question
        createPromises.push(
          axios.post(
            `${process.env.GLOBAL_API}/questions/`,
            { ...question, employer: userId, job: job_id },
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

  const Delete = async (id) => {
    const response = await axios.delete(
      `${process.env.GLOBAL_API}/questions/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    return response;
  };
  const { mutate: deleteMutate } = useMutation({
    mutationFn: Delete,
    onSuccess: (data) => {
      console.log(data, " question deleted");
      toast.success("question deleted successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (error) => {
      console.log(error, "question deleted");
      toast.error("question deletion Unsuccessful", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });
  const handleDelete = (id) => {
    console.log(id, "question id");
    deleteMutate(id);
  };

  const { mutate: updateMutate } = useMutation({
    mutationFn: createOrUpdateExperience,
    onSuccess: (data) => {
      console.log(data, "data from sucessful question update");
      toast.success("Profile updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (error) => {
      console.log(error, "error message");
      toast.error("question update Unsuccessful", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const onSubmit = (data) => {
    console.log(data, "question data");
    console.log(dirtyFields);
    updateMutate({ data, dirtyFields });
  };

  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row border p-2 rounded-4 mb-4">
        <h4 className="border-bottom p-2 mb-3">Receive qualified applicants</h4>
        <span className="p-2">Applicant collection</span>
        <div className="form-group col-lg-4 col-md-6">
          <label>Recieve Applicants</label>
          <select className="chosen-single form-select">
            <option value="">Select</option>
            <option value="By email">By email</option>
          </select>
        </div>
        <div className="form-group col-lg-8 col-md-6">
          <label>By Email</label>
          <input type="email" name="email" placeholder="john@mail.com" />
        </div>
      </div>
      <div>
        <div className="w-100">
          <h5>Screening Question</h5>
          <span>
            we recommend adding 3 or more questions.Applicants must answer each
            question.
          </span>
          {fields.map((element, index) => {
            return (
              <div className="border rounded-4 mb-3">
                <div className="d-flex flex-col flex-lg-row align-items-center justify-content-between">
                  <div className="d-flex flex-row col-10 ">
                    <label className="p-2 pt-2.5 mt-1">Ques.</label>
                    <input
                      // key={element.id}
                      type="text"
                      className="border w-75 m-2 rounded-2 px-2"
                      {...register(`questions.${index}.question_name`)}
                    />
                    <span className="border rounded-4 p-1 px-2 m-2 bg-success text-white">
                      Recommended
                    </span>
                  </div>
                  <div className="px-4">
                    <button onClick={() => remove(index)} type="button">
                      <i className="la la-times font-weight-bold"></i>
                    </button>
                  </div>
                </div>
                <div className="form-group pt-2 d-flex mb-1">
                  <input
                    type="checkbox"
                    {...register(`questions.${index}.must_have`)}
                    className="checkbox"
                  />
                  <label>Must Have</label>
                </div>
                {/* <input
                  type="hidden"
                  {...register(`questions.${index}.id`)}
                  defaultValue={element.id}
                />
                <div className="d-flex justify-content-end delete-button">
                  <button
                    data-text="Delete Aplication"
                    onClick={() => {
                      handleDelete(element.id);
                    }}
                    className="border border-danger m-2 rounded-2 btn btn-danger"
                    type="button"
                  >
                    <span className="la la-trash"></span>
                  </button>
                </div> */}
              </div>
            );
          })}
        </div>
        <div className="mt-4 mx-4">
          <h6>Add Screening Questions</h6>
          <div className="d-flex flex-wrap">
            <button
              type="button"
              className={`btn border rounded-4 p-1 px-2 m-2 ${""}`}
              onClick={addEntry}
            >
              Add Question
            </button>
          </div>
        </div>
        <button className="theme-btn btn-style-one" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default UpdateStepThree;
