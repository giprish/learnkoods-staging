"use client";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import Link from "next/link";
import $ from "jquery";

const EnterEmail = ({ hideModal }) => {
  const otp = async (data) => {
    const { data: response } = await axios.post(
      `${process.env.GLOBAL_API}/send_otp_api/`,
      data
    );
    return response;
  };
  const mail = async (data) => {
    const { data: response } = await axios.post(
      `${process.env.GLOBAL_API}/sent-pass/`,
      data
    );
    return response;
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { mutate: sendOtp } = useMutation({
    mutationFn: otp,
    onSuccess: (data) => {
      console.log(data, "data from sucessful otp");
      toast.success("Otp sent on your registered mail", {
        position: toast.POSITION.TOP_CENTER,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("otp_key", data.key);
      }
      $("#submitotp").click();
    },
    onError: (error) => {
      console.log(error, "error message otp");
    },
  });
  const { mutate: sendMail } = useMutation({
    mutationFn: mail,
    onSuccess: (data) => {
      console.log(data, "data from sucessful mail");
      toast.success("Mail sent on your registered email id", {
        position: toast.POSITION.TOP_CENTER,
      });
      hideModal();
    },
    onError: (error) => {
      console.log(error, "error message mail");
    },
  });

  const onSubmit = (data) => {
    console.log(data, "form data");
  };
  const handleSendOTP = (data) => {
    console.log(data, "form data");
    sendOtp(data);
  };
  const handleSendMail = (data) => {
    console.log(data, "form data");
    sendMail(data);
  };

  return (
    <>
      <form
        method="post"
        action="add-parcel.html"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* user name */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            {...register("email")}
          />
        </div>
        {/* email */}

        <div className="form-group d-flex gap-4">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            onClick={handleSubmit(handleSendOTP)}
          >
            Send OTP
          </button>
          <button
            className="theme-btn btn-style-one"
            type="submit"
            onClick={handleSubmit(handleSendMail)}
          >
            Send mail
          </button>
        </div>

        <button
          className="call-modal signup"
          id="submitotp"
          data-bs-toggle="modal"
          data-bs-target="#otpVerificationModal"
        >
          Submit OTP
        </button>

        {/* login */}
      </form>
    </>
  );
};

export default EnterEmail;
