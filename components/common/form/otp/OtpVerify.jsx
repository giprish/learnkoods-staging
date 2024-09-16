"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const otp = async (updatedData) => {
  const { data: response } = await axios.post(
    `${process.env.GLOBAL_API}/verify_otp_api/`,
    updatedData
  );
  return response;
};

const OtpVerify = ({ hideModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isLoading } = useMutation({
    mutationFn: otp,
    onSuccess: (data) => {
      console.log(data, "data from successful register");
      toast.success("OTP submitted", {
        position: toast.POSITION.TOP_CENTER,
      });
      hideModal();
      if (typeof window !== "undefined") {
        localStorage.removeItem("otp_key");
      }
    },
    onError: (error) => {
      console.error(error, "error message");
      toast.error("OTP submission failed", {
        position: toast.POSITION.TOP_CENTER,
      });
    },
  });

  const onSubmit = (data) => {
    const updatedData = {
      ...data,
      otp: parseInt(data.otp), // Ensure otp is an integer
      new_password: data.new_password,
      otp_key:
        typeof window !== "undefined" ? localStorage.getItem("otp_key") : "",
    };
    mutate(updatedData);
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
          <label>Enter Otp</label>
          <input
            type="number"
            name="otp"
            placeholder="OTP"
            // required
            {...register("otp")}
          />
        </div>
        <div className="form-group">
          <label>Enter New Password</label>
          <input
            type="text"
            name="password"
            placeholder="Enter new password"
            required
            {...register("new_password")}
          />
        </div>
        {/* otp */}

        <div className="form-group">
          <button className="theme-btn btn-style-one" type="submit">
            Submit OTP
          </button>
        </div>
        {/* login */}
      </form>
    </>
  );
};

export default OtpVerify;
