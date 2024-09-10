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
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/loader";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import Link from "next/link";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ApplyJobs = () => {
  const router = useRouter();
  const jobId = router.query.id;
  const access = window.localStorage.getItem("access");
  const student_id = window.localStorage.getItem("id");
  const student = window.localStorage.getItem("student");
  const userName = window.localStorage.getItem("user");

  const fetchData = async (jobId) => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/job_api/${jobId}/`
    );
    return response.data.data;
  };

  const { data: job, isLoading } = useQuery({
    queryKey: ["jobdata", jobId],
    queryFn: () => fetchData(jobId),
    enabled: !!jobId, // Ensure jobId is defined before fetching
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { dirtyFields, errors },
    setValue,
    getValues,
    watch,
  } = useForm({
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const fetchQuestions = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/get-ques/${jobId}/`,
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
    queryFn: () => fetchQuestions(),
  });

  const quesdataWithIds = question?.data?.map((item) => ({
    ...item,
  }));
  useEffect(() => {
    if (question) {
      reset({ questions: quesdataWithIds });
    }
  }, [question]);

  useEffect(() => {
    register("cover_letter", { required: true, minLength: 11 });
  }, [register]);

  const onEditorStateChange = (editorState) => {
    setValue("cover_letter", editorState);
  };

  const editorContent = watch("cover_letter");
  const onSubmit = (data) => {
    const formData = getValues();
    console.log(formData, "education data");
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
            <h4 className="m-3">
              Answer following questions to apply for the job
            </h4>
          </div>
          <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              {fields?.map((item, index) => {
                return (
                  <div className="form-group col-lg-6 col-md-12">
                    <label>
                      Question {index + 1} : {item?.question_name}
                    </label>
                    <input
                      type="text"
                      name={`questions[${index}].answer`}
                      placeholder="Answer"
                      {...register(`questions[${index}].answer`)}
                      required
                    />
                  </div>
                );
              })}
              <div className="form-group col-lg-12 col-md-12">
                <label>Cover Letter</label>
                <Controller
                  name="profile_desc"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      value={
                        editorContent ||
                        `hi my name is <b>${userName}</b> and i am applying for the job <b>${job?.job_title}</b>`
                      }
                      onChange={onEditorStateChange}
                    />
                  )}
                />
                {errors?.cover_letter && (
                  <p className="text-danger">{errors?.cover_letter?.message}</p>
                )}
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
                <button type="submit" className="theme-btn btn-style-one">
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
