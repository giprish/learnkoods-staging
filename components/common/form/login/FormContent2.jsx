"use client";

import Link from "next/link";
import LoginWithSocial from "./LoginWithSocial";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { UserAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const FormContent2 = () => {
  const [id, setId] = useState(null);
  const [access, setAccess] = useState(null);

  const router = useRouter();
  const currentPath = router.pathname;

  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/usr_pro_id/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { data: user, isSuccess } = useQuery({
    queryKey: ["user", access, id],
    queryFn: () => fetchData(),
  });

  useEffect(() => {
    if (typeof window !== "undefined" && isSuccess) {
      window.localStorage.setItem("profile_image", user?.data?.profile_image);
    }
  }, [user, isSuccess]);

  const registerUser = async (data) => {
    const { data: response } = await axios.post(
      `${process.env.GLOBAL_API}/login_api/`,
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
    mutationFn: registerUser,
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
        setId(data.data.id);
        setAccess(data.data.access);
      }
      if (data.data.student === false) {
        router
          .push("/employers-dashboard/dashboard")
          .then(() => window.location.reload());
      }
      if (data.data.student === true) {
        router
          .push("/candidates-dashboard/dashboard")
          .then(() => window.location.reload());
      }
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
          Don&apos;t have an account? <Link href="/register">Signup</Link>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <LoginWithSocial />
      </div>
      {/* End bottom-box LoginWithSocial */}
    </div>
  );
};

export default FormContent2;
