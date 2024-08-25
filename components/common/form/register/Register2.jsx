"use client";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  const [url, setUrl] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // const usertype = useSelector((state) => state.user.userType);
  const [usertype, setUserType] = useState("candidate"); // Default to 'candidate'

  const handleRadioChange = (e) => {
    setUserType(e.target.value);
  };

  useEffect(() => {
    if (usertype === "candidate") {
      setUrl(`${process.env.GLOBAL_API}/user_api/`);
    } else {
      setUrl(`${process.env.GLOBAL_API}/customuser/`);
    }
  }, [usertype]);

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
      console.log(data, "data from successful otp send");
      toast.success("otp send successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("otp_key", data?.key);
      }
      setShowOtp(true);
    },
    onError: (error) => {
      console.log(error, "error message");
      toast.error(`${error?.response?.data?.message}Could not send otp`, {
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
      console.log(data, "data from successful email verify");
      toast.success("email verified successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setShowRegister(true);
      setShowVerifyEmail(false);
      setShowOtp(false);
    },
    onError: (error) => {
      console.log(error, "error message");
      toast.error(`${error?.response?.data?.message}Could not verify mail`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const sendOtp = () => {
    let email = { email: getValues("email") };
    console.log(email);
    otpMutate(email);
  };

  const verify = () => {
    if (typeof window !== "undefined") {
      let data = {
        otp: getValues("otp"),
        otp_key: localStorage.getItem("otp_key"),
      };
      console.log(data);
      verifyMutate(data);
    }
  };

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
      console.log(data, "data from successful register");
      toast.success("User created successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("student", data?.student);
        localStorage.removeItem("otp_key");
        if (usertype === "candidate") {
          localStorage.setItem("id", data?.payload?.id);
          localStorage.setItem("user", data.payload.username);
          // router.push("/");
        }
        if (usertype === "employer") {
          localStorage.setItem("id", data.payload.id);
          localStorage.setItem("user", data.payload.username);
          // router.push("/employers-dashboard/dashboard");
        }
        window.location.reload();
      }

      // hideModal();
    },
    onError: (error) => {
      console.log(error, "error message");
      toast.error("Could not register user", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const handleEvent = (e) => {
    setResume(e.target.files[0]);
    console.log(e.target.files[0], "handle event resume");
  };

  const onSubmit = (userdata) => {
    const { otp, ...updateduserdata } = userdata;
    const datatosend = {
      ...updateduserdata,
      otp_key:
        typeof window !== "undefined" ? localStorage.getItem("otp_key") : "",
    };
    const formData = new FormData();

    // Iterate through datatosend keys
    Object.keys(datatosend).forEach((key) => {
      // If the value is not null, not empty, and not 'resume', append to formData
      if (
        datatosend[key] !== null &&
        datatosend[key] !== "" &&
        key !== "resume"
      ) {
        formData.append(key, datatosend[key]);
      }
    });

    // Append resume if it exists, or append null if it doesn't
    formData.append("resume", resume || null);

    console.log(datatosend, "form data");
    mutate(formData); // Assuming mutate accepts formData
  };
  return (
    <div className="form-inner">
      <div className="row">
        <div className="form-group col-lg-6 col-md-6 col-sm-12">
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="student"
              name="userType"
              value="candidate"
              checked={usertype === "candidate"}
              onChange={handleRadioChange}
            />
            <label className="form-check-label" htmlFor="student">
              Student
            </label>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-12">
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="employer"
              name="userType"
              value="employer"
              checked={usertype === "employer"}
              onChange={handleRadioChange}
            />
            <label className="form-check-label" htmlFor="employer">
              Employer
            </label>
          </div>
        </div>
      </div>
      <h3>Create a Free SkillThrive Account</h3>

      <form
        method="post"
        action="add-parcel.html"
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <div className="d-flex flex-row justify-content-between">
          <div className="form-group col-lg-5">
            <label>First Name</label>
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              required
              {...register("first_name")}
            />
          </div>
          {/* First name */}
          <div className="form-group col-lg-5">
            <label>Last Name</label>
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              required
              {...register("last_name")}
            />
          </div>
          {/* Last name */}
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            {...register("username")}
          />
        </div>

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
        {showVerifyEmail && (
          <div className="form-group">
            <button
              className="theme-btn btn-style-one"
              type="button"
              onClick={sendOtp}
            >
              Verify Email
            </button>
          </div>
        )}

        {/* email */}
        {showOtp && (
          <>
            <div className="form-group">
              <label>OTP</label>
              <input
                id="otp-field"
                type="text"
                name="otp"
                placeholder="OTP"
                {...register("otp")}
              />
            </div>
            <div className="form-group">
              <button
                className="theme-btn btn-style-one"
                type="button"
                onClick={verify}
              >
                Verify Otp
              </button>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Password</label>
          <input
            id="password-field"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            {...register("password")}
          />
        </div>
        <div className="form-group">
          <div className="field-outer">
            <div className="input-group checkboxes square">
              <input
                type="checkbox"
                id="showPassword"
                onChange={() => setShowPassword((prev) => !prev)}
              />
              <label htmlFor="showPassword" className="showPassword">
                <span className="custom-checkbox"></span> Show Password
              </label>
            </div>
          </div>
        </div>
        {usertype === "candidate" ? (
          <div className="form-group">
            <label for="uploadresume">Resume</label>
            <input
              className="form-control py-3 "
              type="file"
              name="resume"
              id="uploadresume"
              required
              accept=".pdf, .docx"
              onChange={(e) => {
                handleEvent(e);
              }}
              // {...register("resume")}
            />
          </div>
        ) : (
          <></>
        )}

        {/* password */}
        {showRegister && (
          <div className="form-group">
            <button className="theme-btn btn-style-one" type="submit">
              Register
            </button>
          </div>
        )}

        {/* register */}
      </form>
      {/* <Tabs>
        <div className="form-group register-dual">
          <TabList className="btn-box row">
            <Tab className="col-lg-6 col-md-12">
              <button
                className="theme-btn btn-style-four"
                onClick={() => setUserType("candidate")}
              >
                <i className="la la-user"></i> Candidate
              </button>
            </Tab>

            <Tab className="col-lg-6 col-md-12">
              <button
                className="theme-btn btn-style-four"
                onClick={() => setUserType("employer")}
              >
                <i className="la la-briefcase"></i> Employer
              </button>
            </Tab>
          </TabList>
        </div>
        

        <TabPanel>
          <FormContent2 usertype={usertype} />
        </TabPanel>
       

        <TabPanel>
          <FormContent2 usertype={usertype} />
        </TabPanel>
        
      </Tabs> */}

      <div className="bottom-box">
        <div className="text">
          Already have an account?{" "}
          <Link href="/login" className="call-modal login">
            LogIn
          </Link>
        </div>
        {/* <div className="divider">
          <span>or</span>
        </div>
        <LoginWithSocial /> */}
      </div>
    </div>
  );
};

export default Register2;
