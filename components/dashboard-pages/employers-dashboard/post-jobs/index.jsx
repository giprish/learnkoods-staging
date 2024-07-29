"use client";
import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";

import PostJobSteps from "./components/PostJobSteps";
import PostBoxForm from "./components/PostBoxForm";
import MenuToggler from "../../MenuToggler";
import { FormProvider, useForm } from "react-hook-form";
import ComapnyBreadCrumb from "../register-company/CompanyBreadCrumb";
import { useEffect, useState } from "react";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { zodResolver } from "@hookform/resolvers/zod";
import { jobPostSchema } from "@/validation/validation.js";

const index = () => {
  const methods = useForm({
    mode: "onChange",
    resolver: zodResolver(jobPostSchema),
  });

  const [jobImage, setJobImage] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [companyname, setComanyName] = useState(null);
  const [tab, setTab] = useState("step1");
  const access = window.localStorage.getItem("access");

  const registerJob = async (formData) => {
    const { data: response } = await axios.post(
      `${process.env.GLOBAL_API}/jobs_api/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-type": "multipart/form-data",
        },
      }
    );
    return response;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: registerJob,
    onSuccess: (data) => {
      console.log(data, "data from sucessful job register");
      toast.success("Job posted successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (error) => {
      console.log(error, "error message");
      toast.error("Job posting Unsuccessful", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });
  const onSubmit = (data) => {
    if (!companyname) {
      toast.error("select company", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    const Job = {
      ...data,
      sub_category: data?.sub_category?.value,
      city: data?.city?.value,
      company: companyname,
      user: window.localStorage.getItem("user"),
    };

    const formData = new FormData();

    const postData = Object.keys(Job).reduce((acc, key) => {
      if (key === "skills_req" && Array.isArray(Job[key])) {
        acc[key] = Job[key].map((option) => ({ data: option.label }));
      } else {
        acc[key] = Job[key];
      }
      return acc;
    }, {});

    console.log(postData, "post data");

    // Print the FormData entries
    for (const key in postData) {
      if (key === "skills_req" && Array.isArray(postData[key])) {
        postData[key].forEach((element, index) => {
          formData.append(`skills_req[${index}]data`, element.data);
        });
        // formData.append(key, JSON.stringify(postData[key]));
      }
      if (key === "questions" && Array.isArray(postData[key])) {
        postData[key].forEach((element, index) => {
          formData.append(
            `questions[${index}]question_name`,
            element.question_name
          );
          formData.append(`questions[${index}]must_have`, element.must_have);
        });
      } else {
        formData.append(key, postData[key]);
      }
    }
    if (!jobImage) {
      toast.error("add job image file", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (jobImage) {
      formData.append("job_image", jobImage);
    }

    for (let pair of formData.entries()) {
      console.log(
        pair[0],
        Array.isArray(pair[1])
          ? pair[1].map((obj) => JSON.stringify(obj))
          : pair[1]
      );
    }

    mutate(formData);
  };

  return (
    <div className="page-wrapper-employer dashboard">
      <span className="header-span"></span>
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardEmployerSidebar />
      {/* <!-- End User Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <ComapnyBreadCrumb
            title="Post a New Job!"
            setCompanyId={setCompanyId}
            setComanyName={setComanyName}
            companyname={companyname}
          />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row">
            <div className="col-lg-12">
              {/* <!-- Ls widget --> */}
              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>Post Job</h4>
                  </div>

                  <FormProvider {...methods}>
                    <div className="widget-content">
                      <PostJobSteps setTab={setTab} currentTab={tab} />
                      {/* End job steps form */}
                      {tab === "step1" && (
                        <PostBoxForm
                          companyname={companyname}
                          companyId={companyId}
                          onSubmit={onSubmit}
                          // onError={onError}
                          setJobImage={setJobImage}
                          setTab={setTab}
                        />
                      )}
                      {tab === "step2" && (
                        <StepTwo setTab={setTab} onSubmit={onSubmit} />
                      )}
                      {tab === "step3" && (
                        <StepThree setTab={setTab} onSubmit={onSubmit} />
                      )}

                      {/* End post box form */}
                    </div>
                  </FormProvider>
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End dashboard-outer */}
      </section>
      {/* <!-- End Dashboard --> */}

      {/* <!-- End Copyright --> */}
    </div>
    // End page-wrapper
  );
};

export default index;
