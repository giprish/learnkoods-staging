"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Link from "next/link";

const Register2 = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm();
  const [resume, setResume] = useState();
  const [url, setUrl] = useState(`${process.env.GLOBAL_API}/user_api/`);
  const [showOtp, setShowOtp] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isStudent, setIsStudent] = useState(true); // Track if the user is a student or employer
  const [emailVerified, setEmailVerified] = useState(false); // New state for email verification
  const router = useRouter();

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

  const registerUser = async (userdata) => {
    const { data: response } = await axios.post(url, userdata, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    });
    return response;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success("User created successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("student", data?.student);
        localStorage.setItem("id", data.payload.id);
        localStorage.setItem("user", data.payload.username);
        localStorage.removeItem("otp_key");
        if (url.includes("user_api")) {
          router.replace("/candidates-dashboard/dashboard");
        } else {
          router.replace("/employers-dashboard/dashboard");
        }
      }
    },
    onError: (error) => {
      toast.error("Could not register user", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const handleEvent = (e) => {
    setResume(e.target.files[0]);
  };

  const onSubmit = (userdata) => {
    const { otp, ...updateduserdata } = userdata;
    const datatosend = {
      ...updateduserdata,
      otp_key:
        typeof window !== "undefined" ? localStorage.getItem("otp_key") : "",
    };
    const formData = new FormData();

    Object.keys(datatosend).forEach((key) => {
      if (
        datatosend[key] !== null &&
        datatosend[key] !== "" &&
        key !== "resume"
      ) {
        formData.append(key, datatosend[key]);
      }
    });

    if (isStudent) {
      formData.append("resume", resume || null);
    }

    mutate(formData);
  };

  const sendOtp = () => {
    let email = { email: getValues("email") };
    otpMutate(email);
  };

  const verify = () => {
    if (typeof window !== "undefined") {
      let data = {
        otp: getValues("otp"),
        otp_key: localStorage.getItem("otp_key"),
      };
      verifyMutate(data);
    }
  };

  const handleTabClick = (tabType) => {
    if (tabType === "student") {
      setUrl(`${process.env.GLOBAL_API}/user_api/`);
      setIsStudent(true);
    } else {
      setUrl(`${process.env.GLOBAL_API}/customuser/`);
      setIsStudent(false);
    }
    // Reset email verification state when switching tabs
    setEmailVerified(false);
    setShowOtp(false);
  };

  return (
    <div className="form-inner">
      <Tabs>
        <TabList className="nav nav-pills mb-3">
          <Tab
            onClick={() => handleTabClick("student")}
            className={`btn btn-outline-primary me-3 ${
              isStudent ? "active-tab" : ""
            }`}
          >
            Student
          </Tab>
          <Tab
            onClick={() => handleTabClick("employer")}
            className={`btn btn-outline-primary ${
              !isStudent ? "active-tab" : ""
            }`}
          >
            Employer
          </Tab>
        </TabList>

        <TabPanel className="customTabpannel">
          {/* Candidate Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <h3>Create a Free SkillThrive Account - Student</h3>
            <div className="row" style={{ marginBottom: "20px" }}>
              <div className="col-md-6">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    required
                    {...register("first_name")}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    required
                    {...register("last_name")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                required
                {...register("username")}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                required
                {...register("email")}
              />
            </div>
            {!showOtp && !emailVerified && (
              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={sendOtp}
                >
                  Verify Email
                </button>
              </div>
            )}
            {showOtp && (
              <>
                <div className="form-group">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Verification Code"
                    {...register("otp")}
                  />
                </div>
                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={verify}
                  >
                    Verify OTP
                  </button>
                </div>
              </>
            )}
            <div className="form-group">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                {...register("password")}
              />
            </div>
            <div className="form-group">
              <input
                type="checkbox"
                onChange={() => setShowPassword((prev) => !prev)}
              />
              <label>Show Password</label>
            </div>
            {isStudent && (
              <div className="form-group">
                <label>Resume</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf, .docx"
                  onChange={handleEvent}
                />
              </div>
            )}
            {showRegister && (
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </div>
            )}
          </form>
        </TabPanel>

        <TabPanel className="customTabpannel">
          {/* Employer Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <h3>Create a Free SkillThrive Account - Employer</h3>
            <div className="row" style={{ marginBottom: "20px" }}>
              <div className="col-md-6">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    required
                    {...register("first_name")}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    required
                    {...register("last_name")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                required
                {...register("username")}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                required
                {...register("email")}
              />
            </div>
            {!showOtp && !emailVerified && (
              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={sendOtp}
                >
                  Verify Email
                </button>
              </div>
            )}
            {showOtp && (
              <>
                <div className="form-group">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Verification Code"
                    {...register("otp")}
                  />
                </div>
                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={verify}
                  >
                    Verify OTP
                  </button>
                </div>
              </>
            )}
            <div className="form-group">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                {...register("password")}
              />
            </div>
            <div className="form-group">
              <input
                type="checkbox"
                onChange={() => setShowPassword((prev) => !prev)}
              />
              <label>Show Password</label>
            </div>
            {showRegister && (
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </div>
            )}
          </form>
        </TabPanel>
      </Tabs>
      <div className="bottom-box">
        <div className="text">
          Already have an account?{" "}
          <Link
            href="/login"
            className="call-modal login"
            style={{ color: "#1967d2", fontWeight: "500" }}
          >
            Login
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register2;
