"use client";
import dynamic from "next/dynamic";
import LoginPopup from "../../components/common/form/login/LoginPopup";
import FooterDefault from "../../components/footer/common-footer";
import DefaulHeader from "../../components/header/DefaulHeader";
import MobileMenu from "../../components/header/MobileMenu";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Seo from "../../components/common/Seo";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/loader";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import Link from "next/link";
import { toast } from "react-toastify";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const checkIfApplied = async (student_id, jobId, access) => {
  try {
    await axios.post(
      `${process.env.GLOBAL_API}/job_applied_check/`,
      {
        student_id,
        job_id: jobId,
      },
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return false;
  } catch (error) {
    return true;
  }
};

const ApplyJobs = () => {
  const router = useRouter();
  const jobId = router.query.id;
  const access = window.localStorage.getItem("access");
  const student_id = window.localStorage.getItem("id");
  const student = window.localStorage.getItem("student");
  const userName = window.localStorage.getItem("user");
  const [jobAppliedCheck, setJobAppliedCheck] = useState(null);

  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/job_api/${jobId}/`
    );
    return response.data.data;
  };

  const { data: job, isLoading } = useQuery({
    queryKey: ["jobdata", jobId],
    queryFn: fetchData,
    enabled: !!jobId,
  });
  useEffect(() => {
    if (job && student_id && access) {
      checkIfApplied(student_id, jobId, access).then((result) => {
        setJobAppliedCheck(result);
        if (result) {
          router.replace(`/job-single/${jobId}`);
        }
      });
    }
  }, [job, student_id, jobId, access]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { dirtyFields, errors, isDirty },
    setValue,
    getValues,
    watch,
    trigger,
  } = useForm({ mode: "onChange" });

  const { fields } = useFieldArray({ control, name: "questions" });

  const fetchQuestions = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/get-ques/${jobId}/`,
      {
        headers: { Authorization: `Bearer ${access}` },
      }
    );
    return response.data;
  };

  const { data: questions } = useQuery({
    queryKey: ["questions", access],
    queryFn: fetchQuestions,
    enabled: !!access,
  });

  const fetchAllAnswers = async () => {
    const responses = await Promise.allSettled(
      questions?.data?.map((question) =>
        axios.get(`${process.env.GLOBAL_API}/ans-ques/${question.id}/`, {
          headers: { Authorization: `Bearer ${access}` },
        })
      )
    );

    return responses.map((response) => response?.value?.data?.data[0]);
  };

  const { data: allAnswers } = useQuery({
    queryKey: ["allAnswers", access],
    queryFn: fetchAllAnswers,
    enabled: !!questions,
  });

  const combineQuestionsAndAnswers = (questions, allAnswers) => {
    return questions?.map((question) => {
      const answer = allAnswers?.find((ans) => ans?.question === question.id);
      return {
        ...question,
        answer_text: answer ? answer.answer_text : null,
        answer_id: answer ? answer.id : null,
      };
    });
  };

  const combinedData = combineQuestionsAndAnswers(questions?.data, allAnswers);

  console.log(combinedData, "combined data");

  useEffect(() => {
    if (questions && allAnswers) {
      reset({ questions: combinedData });
    }
  }, [questions, allAnswers]); // Ensure dependencies are accurate

  const isRequired = (mustHave) =>
    mustHave ? { required: "This field is required" } : {};

  const answers = async ({ answersData, combinedData }) => {
    if (!answersData) {
      throw new Error("Both answersData and combinedData must be provided");
    }

    const createPromises = [];
    const updatePromises = [];

    answersData.forEach((item2) => {
      const correspondingItem1 = combinedData.find(
        (item) => item.id === item2.id
      );

      if (
        correspondingItem1 &&
        (correspondingItem1.answer_text === "" ||
          correspondingItem1.answer_text === null) &&
        item2.answer_text
      ) {
        createPromises.push(
          axios.post(
            `${process.env.GLOBAL_API}/answers/`,
            {
              student: student_id,
              question: item2?.id,
              answer_text: item2?.answer_text,
            },
            {
              headers: {
                Authorization: `Bearer ${access}`,
                "Content-Type": "multipart/form-data",
              },
            }
          )
        );
      } else if (item2.answer_text && item2.answer_id) {
        updatePromises.push(
          axios.put(
            `${process.env.GLOBAL_API}/answers/${item2?.answer_id}/`,
            {
              student: student_id,
              question: item2?.id,
              answer_text: item2?.answer_text,
            },
            {
              headers: {
                Authorization: `Bearer ${access}`,
                "Content-Type": "multipart/form-data",
              },
            }
          )
        );
      }
    });

    await Promise.all([...createPromises, ...updatePromises]);
  };

  const { mutate: mutateAnswers } = useMutation({
    mutationFn: answers,
    onSuccess: (data) => {
      toast.success("Answer updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (error) => {
      toast.error("Answer update unsuccessful", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const submitAnswers = async () => {
    await trigger();
    if (errors?.questions?.length > 0) {
      toast.error("Please correct the errors before submitting.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    const formData = getValues();
    const answersData = formData?.questions;
    console.log(answersData, "answer data");
    mutateAnswers({ answersData, combinedData });
  };

  const applyJob = async (applyData) => {
    const response = await axios.post(
      `${process.env.GLOBAL_API}/job-applicant/`,
      applyData,
      {
        headers: { Authorization: `Bearer ${access}` },
      }
    );
    return response;
  };

  const { mutate } = useMutation({
    mutationFn: applyJob,
    onSuccess: (data) => {
      toast.success("Job applied successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      window.location.reload();
    },
    onError: (error) => {
      const err = error?.response?.data?.error?.detail[0];
      toast.error(err, { position: toast.POSITION.TOP_RIGHT });
    },
  });

  const onSubmit = async (data) => {
    await trigger();
    console.log(errors, "errors");
    if (errors.length > 0) {
      toast.error("Please correct the errors before submitting.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const applyData = {
      cover_letter: data.cover_letter,
      student: student_id,
      job: jobId,
    };
    console.log(applyData, "applydata");
    // mutate(applyData);
  };
  const onApply = async () => {
    const data = getValues();
    await trigger();
    console.log(errors, "errors");
    if (errors?.questions?.length > 0) {
      toast.error("Please correct the errors before submitting.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const applyData = {
      cover_letter: data.cover_letter,
      student: student_id,
      job: jobId,
    };
    console.log(applyData, "applydata");
    mutate(applyData);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <Seo pageTitle="Job Single Dynamic V1" />

      <LoginPopup />

      <DefaulHeader />

      <MobileMenu />

      {/* <!-- End Main Footer --> */}
      <section className="job-apply-section">
        <div className="m-5">
          <div className="text-center">
            {combinedData?.length > 0 && (
              <h4 className="m-3">
                Answer following questions to apply for the job
              </h4>
            )}
          </div>
          <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              {fields?.map((item, index) => {
                return (
                  <div className="form-group  col-lg-12 col-md-12 ">
                    <div className="">
                      <label>
                        Question {index + 1} : {item?.question_name}
                      </label>
                      <p>Answer {index + 1}</p>
                    </div>
                    <Controller
                      name={`questions[${index}].answer_text`}
                      control={control}
                      rules={isRequired(item?.must_have)}
                      render={({ field }) => (
                        <ReactQuill
                          value={field.value} // Make sure value is managed properly
                          onChange={(content) => field.onChange(content)} // Call onChange with content
                          theme="snow"
                        />
                      )}
                    />
                    {errors?.questions?.[index]?.answer_text && (
                      <p className="text-danger">
                        {errors.questions[index]?.answer_text?.message}
                      </p>
                    )}
                  </div>
                );
              })}
              <div className="form-group col-lg-12 col-md-12">
                <button
                  type="button"
                  className="theme-btn btn-style-one"
                  onClick={submitAnswers}
                >
                  Submit Answers
                </button>
              </div>

              <div className="form-group col-lg-12 col-md-12">
                <label>Cover Letter</label>
                <Controller
                  name="cover_letter"
                  control={control}
                  defaultValue={`hi my name is <b>${userName}</b> and i am applying for the job <b>${job?.job_title}</b>`}
                  rules={{ required: "Cover letter is required" }} // Optional: Validation rules
                  render={({ field }) => (
                    <ReactQuill
                      value={field.value} // Make sure value is managed properly
                      onChange={(content) => field.onChange(content)} // Call onChange with content
                      theme="snow"
                    />
                  )}
                />
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                <div className="input-group checkboxes square">
                  <input type="checkbox" name="remember-me" id="rememberMe" />
                  <label htmlFor="rememberMe" className="remember">
                    <span className="custom-checkbox"></span> You accept our
                    <span data-bs-dismiss="modal">
                      <Link href="/terms">
                        Terms and Conditions and Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <button
                  type="button"
                  className="theme-btn btn-style-one"
                  onClick={onApply}
                >
                  Apply for Job
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <FooterDefault footerStyle="alternate5" />
    </>
  );
};

export default dynamic(() => Promise.resolve(ApplyJobs), {
  ssr: false,
});
