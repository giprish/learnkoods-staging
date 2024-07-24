"use client";

import { UserAuth } from "@/context/AuthContext";
import { headers } from "@/next.config";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ApplyJobModalContent = ({ closeModal, jobName }) => {
  const { user } = UserAuth();
  const router = useRouter();
  const access = window.localStorage.getItem("access");
  const userName = window.localStorage.getItem("user");
  const jobId = router.query.id;
  const student = window.localStorage.getItem("id") || {
    if(user) {
      user?.id;
    },
  };
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const applyJob = async (applyData) => {
    const response = await axios.post(
      `${process.env.GLOBAL_API}/job-applicant/`,
      applyData,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response;
  };

  const { mutate } = useMutation({
    mutationFn: (applyData) => applyJob(applyData),
    onSuccess: (data) => {
      console.log(data, "data from successful job apply");
      toast.success("Job apllied successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      closeModal();
      window.location.reload();
    },
    onError: (error) => {
      const err = error?.response?.data?.error?.detail[0];
      console.log(error, "job apply error");
      toast.error(err, {
        position: toast.POSITION.TOP_RIGHT,
      });
      closeModal();
    },
  });
  useEffect(() => {
    register("cover_letter", { required: true, minLength: 11 });
  }, [register]);

  const onEditorStateChange = (editorState) => {
    setValue("cover_letter", editorState);
  };
  const editorContent = watch("cover_letter");

  const onSubmit = (data) => {
    const applyData = {
      ...data,
      student: student,
      job: jobId,
    };
    console.log(applyData, "job apply data");
    mutate(applyData);
  };

  return (
    <form
      className="default-form job-apply-form modal-dialog-scrollable overflow-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          CoverLetter
          <ReactQuill
            theme="snow"
            value={
              editorContent ||
              `hi my name is <b>${userName}</b> and i am applying for the job <b>${jobName}</b>`
            }
            onChange={onEditorStateChange}
          />
          {errors?.cover_letter && (
            <p className="text-danger">{errors?.cover_letter?.message}</p>
          )}
        </div>
        {/* End .col */}

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
        {/* End .col */}

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <button
            className="theme-btn btn-style-one w-100"
            type="submit"
            name="submit-form"
          >
            Apply Job
          </button>
        </div>
        {/* End .col */}
      </div>
    </form>
  );
};

export default ApplyJobModalContent;
