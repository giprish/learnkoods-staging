"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const GLOBAL_API = process.env.GLOBAL_API;

const FormContent = ({ hideModal }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [id, setId] = useState(null);
  const [access, setAccess] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setId(window.localStorage.getItem("id"));
      setAccess(window.localStorage.getItem("access"));
      setStudent(localStorage.getItem("student"));
    }
  }, []);

  const { data: user, isSuccess } = useQuery({
    queryKey: ["user", access, id],
    queryFn: () => fetchData(),
    enabled: !!access && student === "true",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && isSuccess) {
      // console.log(user, "form content");
      window.localStorage.setItem("profile_image", user?.data?.profile_image);
      window.localStorage.setItem("resume", user?.data?.resume);
      window.localStorage.setItem("skills", JSON.stringify(user?.data?.skills));
    }
  }, [user, isSuccess]);

  const loginUser = async (data) => {
    const { data: response } = await axios.post(
      `${GLOBAL_API}/login_api/`,
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

  const { mutate, isLoading } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log(data, "data from sucessful login");
      console.log(typeof data.data.student, "student from sucessful login");
      toast.success("User loggedin successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });

      if (typeof window !== "undefined") {
        window.localStorage.setItem("access", data.data.access);
        window.localStorage.setItem("refresh", data.data.refresh);
        window.localStorage.setItem("id", data.data.id);
        window.localStorage.setItem("user", data.data.username);
        window.localStorage.setItem("student", data.data.student);
        setId(data.data.id);
        setAccess(data.data.access);
      }
      if (data.data.student === false) {
        // router.push("/employers-dashboard/dashboard")
        window.location.reload();
      }
      if (data.data.student === true) {
        // router.push("/candidates-dashboard/dashboard")
        window.location.reload();
      }

      hideModal();
    },
    onError: (data) => {
      console.log(data, "error message");
      toast.error("Login Unsuccessful", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const onSubmit = (data) => {
    console.log(data, "form data");
    mutate(data);
  };
  return (
    <div className="form-inner">
      <h3>Login to SkillThrive</h3>

      {/* <!--Login Form--> */}
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
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
        {/* name */}

        <div className="form-group">
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
            {...register("password")}
          />
        </div>
        {/* password */}
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

        <div className="form-group">
          <div className="field-outer">
            <Link
              href="#"
              className="call-modal signup"
              data-bs-toggle="modal"
              data-bs-target="#otpModal"
            >
              Forgot Password ?
            </Link>
          </div>
        </div>
        {/* forgot password */}

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            name="log-in"
          >
            Log In
          </button>
        </div>
        {/* login */}
      </form>
      {/* End form */}

      <div className="bottom-box">
        <div className="text">
          Don&apos;t have an account?{" "}
          <Link
            href="#"
            className="call-modal signup"
            data-bs-toggle="modal"
            data-bs-target="#registerModal"
            style={{ color: "#1967d2", fontWeight: "500" }}
          >
            Sign up
          </Link>
        </div>

        {/* <div className="divider">
          <span>or</span>
        </div> */}

        {/* <LoginWithSocial hideModal={hideModal} /> */}
      </div>
      {/* End bottom-box LoginWithSocial */}
    </div>
  );
};

export default FormContent;
