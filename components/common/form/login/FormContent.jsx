"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import LoginWithSocial from "./LoginWithSocial";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { saveUser, deleteUser } from "../../../../features/user/userslice.js";

import { UserAuth } from "@/context/AuthContext";

const GLOBAL_API = process.env.GLOBAL_API;

const FormContent = ({ hideModal }) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const [id, setId] = useState(null);
  const [access, setAccess] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setId(window.localStorage.getItem("id"));
      setAccess(window.localStorage.getItem("access"));
    }
  }, []);

  const fetchData = async () => {
    const response = await axios.get(`${GLOBAL_API}/usr_pro_id/${id}/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return response.data;
  };

  const { data: user, isSuccess } = useQuery({
    queryKey: ["user", access],
    queryFn: () => fetchData(),
  });

  useEffect(() => {
    if (typeof window !== "undefined" && isSuccess) {
      window.localStorage.setItem("profile_image", user?.data?.profile_image);
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
      toast.success("User loggedin successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });

      if (typeof window !== "undefined") {
        window.localStorage.setItem("access", data.data.access);
        window.localStorage.setItem("refresh", data.data.refresh);
        window.localStorage.setItem("id", data.data.id);
        window.localStorage.setItem("user", data.data.username);
        window.localStorage.setItem("student", data.data.student);
      }

      if (currentPath !== "/job-single-v1/[id]") {
        router.push("/");
      }
      window.location.reload();
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
      <h3>Login to Learnkoods</h3>

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
            type="password"
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
              <input type="checkbox" name="remember-me" id="remember" />
              <label htmlFor="remember" className="remember">
                <span className="custom-checkbox"></span> Remember me
              </label>
            </div>
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
          >
            Signup
          </Link>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <LoginWithSocial hideModal={hideModal} />
      </div>
      {/* End bottom-box LoginWithSocial */}
    </div>
  );
};

export default FormContent;
