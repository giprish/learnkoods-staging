import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const GLOBAL_API = process.env.GLOBAL_API;

const Form = () => {
  const [access, setAccess] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccess(window.localStorage.getItem("access"));
    }
  }, []);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const loginUser = async (data) => {
    const { data: response } = await axios.post(
      `${GLOBAL_API}/change-password/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log(data, "data from sucessful password change");
      toast.success("password changed successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (data) => {
      console.log(data, "error message");
      toast.error(
        data.response.data.old_password[0].length > 0
          ? "Wrong password"
          : "password change unsuccessful",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    },
  });

  const onSubmit = (data) => {
    console.log(data, "form data");
    mutate(data);
  };

  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-7 col-md-12">
          <label>Old Password </label>
          <input
            type="password"
            name="old_password"
            required
            {...register("old_password")}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-7 col-md-12">
          <label>New Password</label>
          <input
            type="password"
            name="new_password"
            required
            {...register("new_password")}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-7 col-md-12">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            required
            {...register("confirm_password", {
              validate: (val) => {
                if (watch("new_password") != val) {
                  return "Your passwords do no match";
                }
              },
            })}
          />
          {errors.confirm_password && (
            <p className="error-message" style={{ color: "red" }}>
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <button type="submit" className="theme-btn btn-style-one">
            Update
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
