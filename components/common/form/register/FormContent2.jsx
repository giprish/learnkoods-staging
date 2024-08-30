"use client";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const FormContent2 = ({ usertype }) => {
  const [resume, setResume] = useState();
  const [url, setUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (usertype === "candidate") {
      setUrl(`${process.env.GLOBAL_API}/user_api/`);
    } else {
      setUrl(`${process.env.GLOBAL_API}/customuser/`);
    }
  }, [usertype]);

  const registerUser = async (userdata) => {
    const { data: response } = await axios.post(url, userdata, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    });
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
      console.log(data, "data from successful register");
      toast.success("User created successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      if (typeof window !== "undefined") {
        window.localStorage.setItem("access", data.access);
        window.localStorage.setItem("refresh", data.refresh);
        window.localStorage.setItem("student", data?.student);
        if (usertype === "candidate") {
          window.localStorage.setItem("id", data?.payload?.id);
          window.localStorage.setItem("user", data.payload.username);
        }
        if (usertype === "employer") {
          window.localStorage.setItem("id", data.payload.id);
          window.localStorage.setItem("user", data.payload.username);
        }
      }
      router.push("/");
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
    const formData = new FormData();

    // Iterate through userdata keys
    Object.keys(userdata).forEach((key) => {
      // If the value is not null, not empty, and not 'resume', append to formData
      if (userdata[key] !== null && userdata[key] !== "" && key !== "resume") {
        formData.append(key, userdata[key]);
      }
    });

    // Append resume if it exists, or append null if it doesn't
    formData.append("resume", resume || null);

    console.log(userdata, "form data");
    mutate(formData); // Assuming mutate accepts formData
  };

  return (
    <form
      method="post"
      action="add-parcel.html"
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
    >
      <div className="d-flex flex-row justify-content-between">
        <div className="form-group">
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
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            required
            {...register("last_name")}
          />
        </div>
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
        <label></label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          {...register("email")}
        />
      </div>
      {/* name */}

      <div className="form-group">
        <label>Password</label>
        <input
          id="password-field"
          type="password"
          name="password"
          placeholder="Password"
          {...register("password")}
        />
      </div>
      <div className="form-group">
        <label>Resume</label>
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
      {/* password */}

      <div className="form-group">
        <button className="theme-btn btn-style-one" type="submit">
          Register
        </button>
      </div>
      {/* login */}
    </form>
  );
};

export default FormContent2;
