import { useMutation } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

const Form = ({ onSubmit, onError }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    getValues,
  } = useFormContext();

  const otp = async (otpdata) => {
    const { data: response } = await axios.post(
      `${process.env.GLOBAL_API}/register-user-otp/`,
      otpdata,
      {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }
    );
    return response;
  };
  const { mutate: otpMutate } = useMutation({
    mutationFn: otp,
    onSuccess: (data) => {
      toast.success("OTP sent successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("otp_key", data?.key);
      }
      setShowOtp(true);
    },
    onError: (error) => {
      toast.error(`Could not send OTP: ${error?.response?.data?.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });
  const sendOtp = () => {
    let email = { email: getValues("email") };
    otpMutate(email);
  };
  const verifyemail = async (verifydata) => {
    const { data: response } = await axios.post(
      `${process.env.GLOBAL_API}/verify-register-user-otp/`,
      verifydata,
      {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }
    );
    return response;
  };
  const { mutate: verifyMutate } = useMutation({
    mutationFn: verifyemail,
    onSuccess: (data) => {
      toast.success("Email verified successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setShowRegister(true);
      setShowOtp(false);
      setEmailVerified(true); // Set emailVerified to true
    },
    onError: (error) => {
      toast.error(`Could not verify email: ${error?.response?.data?.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });
  const verify = () => {
    if (typeof window !== "undefined") {
      let data = {
        otp: getValues("otp"),
        otp_key: localStorage.getItem("otp_key"),
      };
      verifyMutate(data);
    }
  };
  return (
    <div className="widget-content">
      <form
        action="#"
        className="default-form px-4"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <div className="row">
          {/* <!-- Input --> */}
          <div className="form-group col-lg-6 col-md-12">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter first name"
              required
              {...register("first_name")}
            />
            {errors.first_name && (
              <p className="text-danger">{errors.first_name.message}</p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Enter last name"
              required
              {...register("last_name")}
            />
            {errors.last_name && (
              <p className="text-danger">{errors.last_name.message}</p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>User Name</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              required
              {...register("username")}
            />
            {errors.username && (
              <p className="text-danger">{errors.username.message}</p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              required
              {...register("email")}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
            {dirtyFields.email && (
              <div className="form-group my-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  // onClick={sendOtp}
                >
                  Verify Email
                </button>
              </div>
            )}
          </div>
          {dirtyFields.email && (
            <>
              <div className="form-group col-md-6">
                <label>Verification Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Verification Code"
                  {...register("otp")}
                />
              </div>
              <div className="form-group ">
                <button
                  type="button"
                  className="btn btn-primary"
                  // onClick={verify}
                >
                  Verify OTP
                </button>
              </div>
            </>
          )}
          <div className="form-group col-lg-12 col-md-12">
            <button type="submit" className="theme-btn btn-style-one">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
