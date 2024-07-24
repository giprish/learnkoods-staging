import dynamic from "next/dynamic";

import { useRouter } from "next/router";
import { useEffect } from "react";
import Seo from "../../../components/common/Seo";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const JobSingleDynamicV1 = () => {
  const router = useRouter();
  const uidb64 = router.query.uidb64;
  const token = router.query.token;

  useEffect(() => {
    console.log(router.query, "id from link");
  }, [router]);

  const updatePassword = async (data) => {
    const { data: response } = await axios.post(
      `${process.env.GLOBAL_API}/password-reset-confirm/${uidb64}/${token}/`,
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
    mutationFn: updatePassword,
    onSuccess: (data) => {
      console.log(data, "password updated succesfuly");
      toast.success("password updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      router.push("/");
    },
    onError: (data) => {
      console.log(data, "error message");
      toast.error("password update Unsuccessful", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const onSubmit = (data) => {
    console.log(data, "form data");
    mutate(data);
  };

  return (
    <>
      <Seo pageTitle="Job Single Dyanmic V1" />

      {/* <Header /> */}
      {/* <!--End Main Header -->  */}

      {/* <MobileMenu /> */}
      {/* End MobileMenu */}

      <div className="login-section">
        <div
          className="image-layer"
          style={{ backgroundImage: "url(/images/background/12.jpg)" }}
        ></div>
        <div className="outer-box">
          {/* <!-- Login Form --> */}
          <div className="login-form default-form">
            <div className="form-inner">
              <h3>Update Passowrd</h3>

              {/* <!--Login Form--> */}
              <form method="post" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label>Enter new pasword</label>
                  <input
                    type="password"
                    name="new_password"
                    placeholder="New Password"
                    required
                    {...register("new_password")}
                  />
                </div>
                {/* name */}

                <div className="form-group">
                  <label>Confirm new password</label>
                  <input
                    type="password"
                    name="confirm_password"
                    placeholder="Confrim new password"
                    required
                    {...register("confirm_password")}
                  />
                </div>
                {/* password */}

                {/* forgot password */}

                <div className="form-group">
                  <button
                    className="theme-btn btn-style-one"
                    type="submit"
                    name="log-in"
                  >
                    Update Password
                  </button>
                </div>
                {/* login */}
              </form>
              {/* End form */}

              {/* End bottom-box LoginWithSocial */}
            </div>
          </div>
          {/* <!--End Login Form --> */}
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(JobSingleDynamicV1), {
  ssr: false,
});
