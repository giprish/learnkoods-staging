"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";

import { toast } from "react-toastify";

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

  const quesdataWithIds = question?.data?.map((item) => ({
    ...item,
  }));
  useEffect(() => {
    if (question) {
      reset({ questions: quesdataWithIds });
      setQuestionIds(question.data?.map((item) => item.id));
    }
    console.log(question);
  }, [question]);

  const createOrUpdateQuestion = async ({ data, dirtyFields }) => {
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

  const handleDelete = async (index) => {
    // Ensure quesdataWithIds exists and index is within bounds
    if (
      Array.isArray(quesdataWithIds) &&
      index >= 0 &&
      index < quesdataWithIds.length
    ) {
      const fieldId = quesdataWithIds[index]?.id;

      if (fieldId) {
        deleteMutate(fieldId, {
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

  const { mutate: updateMutate } = useMutation({
    mutationFn: createOrUpdateQuestion,
    onSuccess: (data) => {
      console.log(data, "data from sucessful question update");
      toast.success("Question updated successfully", {
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
      <div>
        <div>
          <h5>Screening Question</h5>
          <span>
            we recommend adding 3 or more questions.Applicants must answer each
            question.
          </span>
          {fields?.map((element, index) => {
            return (
              <div className="border rounded-4 mb-3" key={element.id}>
                <div className="d-flex justify-content-between">
                  <label className="p-2 mx-4">Question {index + 1} :</label>
                  <button
                    onClick={() => handleDelete(index)}
                    type="button"
                    className="mx-3"
                  >
                    <i className="la la-times font-weight-bold"></i>
                  </button>
                </div>
                <div className="d-flex col-10 align-items-center mx-4 ">
                  <input
                    // key={element.id}
                    type="text"
                    className="border w-75 m-2 rounded-2 px-2"
                    {...register(`questions.${index}.question_name`)}
                    required
                  />
                  {/* <span className="border rounded-4 p-1 px-2 m-2 bg-success text-white">
                      Recommended
                    </span> */}

                  <div className="px-4">
                    <input
                      type="checkbox"
                      {...register(`questions.${index}.must_have`)}
                    />
                    <label className="mx-1">Mandatory</label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <h6>Add Screening Questions</h6>
          <div className="d-flex flex-wrap">
            <button
              type="button"
              className={`theme-btn small border rounded-3 p-2 px-2 my-2 bg-success text-white   ${""}`}
              onClick={addEntry}
            >
              Add Question
            </button>
          </div>
        </div>
        <div className="form-group col-lg-12 col-md-6 text-right d-flex justify-content-between py-4">
          <button
            className="theme-btn btn-style-one"
            type="button"
            onClick={() => setTab("step2")}
          >
            Previous
          </button>

          <button className="theme-btn btn-style-one" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateStepThree;
