"use client";
import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
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
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("step1");
  const access = window.localStorage.getItem("access");
  const userId = window.localStorage.getItem("id");

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
  const createQuestion = async ({ questions, job_id }) => {
    const createPromises = [];

    questions.forEach((question) => {
      // Create new question with job_id and employer
      createPromises.push(
        axios.post(
          `${process.env.GLOBAL_API}/questions/`,
          { ...question, employer: userId, job: job_id },
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        )
      );
    });

    // Wait for all promises to complete
    await Promise.all(createPromises);
  };

  const { mutate: questionMutate } = useMutation({
    mutationFn: createQuestion,
    onSuccess: (data) => {
      console.log(data, "data from sucessful question update");
      toast.success("Questions added successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (error) => {
      console.log(error, "error message");
      const errorFields = [
        "job_title",
        "job_type",
        "workplace_type",
        "exp_required",
        "gender",
        "url",
        "is_published",
        "is_closed",
        "category",
        "sub_category",
        "recruitment_timeline",
        "country",
        "state",
        "city",
        "pincode",
        "location1",
        "location",
        "job_des",
        "skills_req",
        "max_salary",
        "min_salary",
        "rate",
      ];
      let errorHandled = false;

      errorFields.forEach((field) => {
        if (error.response.data[field]) {
          const errorMessage = Array.isArray(error.response.data[field])
            ? error.response.data[field][0]
            : error.response.data[field].error || error.response.data[field];

          toast.error(`${field}: ${errorMessage}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          errorHandled = true;
        }
      });

      // Handle errors not in the errorFields array
      if (!errorHandled) {
        toast.error("An unexpected error occurred. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    },
  });
  const onSubmit = (data) => {
    console.log(data, "data");
    console.log(data.questions, "questions");
    if (!companyname) {
      toast.error("Select company", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    const Job = {
      ...data,
      category: data?.category?.value,
      sub_category: data?.sub_category?.value,
      city: data?.city?.value,
      country: data?.country?.value,
      state: data?.state?.value,
      company: companyname,
      user: window.localStorage.getItem("user"),
    };

    const formData = new FormData();

    const postData = Object.keys(Job).reduce((acc, key) => {
      if (key === "skills_req" && Array.isArray(Job[key])) {
        acc[key] = Job[key].map((option) => ({ data: option.label }));
      } else if (key !== "questions") {
        acc[key] = Job[key];
      }
      return acc;
    }, {});

    for (const key in postData) {
      if (key === "skills_req" && Array.isArray(postData[key])) {
        postData[key].forEach((element, index) => {
          formData.append(`skills_req[${index}]data`, element.data);
        });
      } else {
        formData.append(key, postData[key]);
      }
    }

    // Call the job creation mutation

    mutate(formData, {
      onSuccess: (jobData) => {
        // Extract job_id from the job creation response
        const job_id = jobData.Data.job_id;

        // Check if there are any questions to create
        if (data.questions && data.questions.length > 0) {
          // Pass only the questions and job_id to the questionMutate function
          questionMutate({
            questions: data.questions,
            job_id,
          });
        }
      },
    });
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

          {companyname !== null && (
            <div className="row">
              <div className="col-lg-12">
                <div className="ls-widget">
                  <div className="tabs-box">
                    <div className="widget-title">
                      {/* <h4>Post Job</h4> */}
                    </div>

                    <FormProvider {...methods}>
                      <div className="widget-content">
                        <PostJobSteps setTab={setTab} currentTab={tab} />

                        {tab === "step1" && (
                          <PostBoxForm
                            companyname={companyname}
                            companyId={companyId}
                            onSubmit={onSubmit}
                            setJobImage={setJobImage}
                            setTab={setTab}
                            setError={setError}
                          />
                        )}
                        {tab === "step2" && (
                          <StepTwo
                            setTab={setTab}
                            onSubmit={onSubmit}
                            setError={setError}
                          />
                        )}
                        {tab === "step3" && (
                          <StepThree
                            setTab={setTab}
                            onSubmit={onSubmit}
                            setError={setError}
                          />
                        )}
                      </div>
                    </FormProvider>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default index;
