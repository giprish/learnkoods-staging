"use client";
import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";

import MenuToggler from "../../MenuToggler";
import PostJobForm from "./components/PostJobForm";
import { useEffect, useState } from "react";
import ComapnyBreadCrumb from "../register-company/CompanyBreadCrumb";
import PostJobSteps from "../post-jobs/components/PostJobSteps";
import UpdateStepTwo from "./components/UpdateStepTwo";
import UpdateStepThree from "./components/UpdateStepThree";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const index = () => {
  const methods = useForm();
  const [tab, setTab] = useState("step1");
  const [jobName, setJobName] = useState(null);
  const router = useRouter();
  const [cat, setCat] = useState({
    value: 0,
    label: "",
  });
  const [subcat, setSubCat] = useState({
    value: 0,
    label: "",
  });
  const [countryId, setCountryId] = useState({
    value: 0,
    label: "",
  });
  const [stateId, setStateId] = useState({
    value: 0,
    label: "",
  });

  const [selectedsubcat, setSelectedSubCat] = useState(null);
  const [jobImage, setJobImage] = useState(null);
  const access = window.localStorage.getItem("access");
  const id = router.query.id;

  const dirtyFields = methods.formState.dirtyFields;

  const fetch = async (url) => {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return response.data;
  };
  const { data: job } = useQuery({
    queryKey: ["job", id],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/job_api/${id}/`),
  });

  useEffect(() => {
    if (job) {
      let skills = job?.data?.skills_req.map((skill) => {
        return { label: skill.data };
      });
      methods.reset(job?.data);
      methods.setValue("skills_req", skills);
      setCat({
        value: job?.category?.id,
        label: job?.category?.name,
      });
      setSubCat({
        value: job?.data?.sub_category?.id,
        label: job?.data?.sub_category?.name,
      });
      methods.setValue("category", {
        value: job?.category?.id,
        label: job?.category?.name,
      });
      methods.setValue("sub_category", {
        value: job?.data?.sub_category?.id,
        label: job?.data?.sub_category?.name,
      });
      methods.setValue("country", {
        value: job?.data?.country?.id,
        label: job?.data?.country?.name,
      });
      methods.setValue("state", {
        value: job?.data?.state?.id,
        label: job?.data?.state?.name,
      });
      methods.setValue("city", {
        value: job?.data?.city?.id,
        label: job?.data?.city?.name,
      });
      setCountryId({
        value: job?.data?.country?.id,
        label: job?.data?.country?.name,
      });
      setStateId({
        value: job?.data?.state?.id,
        label: job?.data?.state?.name,
      });
      console.log(job, "fetched job data");
    }
  }, [job]);

  console.log(stateId, "state from job fetched");
  console.log(countryId, "country from job fetched");
  console.log(subcat, "subcat from job fetched");

  const updateJob = async (formData) => {
    const { data: response } = await axios.put(
      `${process.env.GLOBAL_API}/job_api/${id}/`,
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
    mutationFn: updateJob,
    onSuccess: (data) => {
      console.log(data, "data from sucessful job update");
      toast.success("Job updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      //   window.localStorage.setItem("company_id", data.data.id);
    },
    onError: (error) => {
      console.log(error, "error message");
      toast.error("Job updating Unsuccessful", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const onSubmit = (data) => {
    // Debugging: Log dirtyFields to ensure it's being populated correctly
    console.log(data, "original data");
    console.log("Dirty Fields:", dirtyFields);
    if (dirtyFields.category) {
      delete dirtyFields.category;
    }
    const formData = new FormData();

    const dirtyData = Object.keys(data).reduce((acc, key) => {
      if (dirtyFields[key]) {
        if (Array.isArray(data[key]) && key === "questions") {
          // Handle multi-select fields by extracting labels
          acc[key] = data[key].map((option) => ({
            question_name: option.question_name,
            must_have: option.must_have,
          }));
        } else if (Array.isArray(data[key])) {
          // Handle multi-select fields by extracting labels
          acc[key] = data[key].map((option) => ({
            data: option.label,
          }));
        } else if (typeof data[key] === "object" && data[key].value) {
          // If the value is an object and has a value property, extract it
          acc[key] = data[key].value;
        } else {
          // Handle other fields
          acc[key] = data[key];
        }
      }
      return acc;
    }, {});
    // Debugging: Log dirtyData to ensure it's being populated correctly
    console.log("Dirty Data:", dirtyData);

    // Print the FormData entries
    for (const key in dirtyData) {
      if (key === "skills_req" && Array.isArray(dirtyData[key])) {
        dirtyData[key].forEach((element, index) => {
          formData.append(`skills_req[${index}]data`, element.data);
        });
        // formData.append(key, JSON.stringify(dirtyData[key]));
      }
      if (key === "questions" && Array.isArray(dirtyData[key])) {
        dirtyData[key].forEach((element, index) => {
          formData.append(
            `questions[${index}]question_name`,
            element.question_name
          );
          formData.append(`questions[${index}]must_have`, element.must_have);
        });
        // formData.append(key, JSON.stringify(dirtyData[key]));
      } else {
        formData.append(key, dirtyData[key]);
      }
    }
    // for (const key in postData) {
    //   formData.append(key, JSON.stringify(postData[key]));
    // }

    // Append the logo if it exists
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

    // Debugging: Log formData entries to ensure correct data is being appended

    mutate(formData);
    // Submit only dirtyData to your API
  };
  return (
    <div className="page-wrapper-employer page-wrapper dashboard ">
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
            title="Update Job!"
            // setCompanyId={setCompanyId}
            // setComanyName={setComanyName}
            // companyname={companyname}
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
                    <h4>Edit Job</h4>
                  </div>

                  <FormProvider {...methods}>
                    <div className="widget-content">
                      <PostJobSteps setTab={setTab} currentTab={tab} />
                      {/* End job steps form */}
                      {tab === "step1" && (
                        <PostJobForm
                          // companyname={companyname}
                          // companyId={companyId}
                          onSubmit={onSubmit}
                          setJobImage={setJobImage}
                          cat={cat}
                          setCat={setCat}
                          subcat={subcat}
                          setSubCat={setSubCat}
                          countryId={countryId}
                          setCountryId={setCountryId}
                          stateId={stateId}
                          setStateId={setStateId}
                          setTab={setTab}
                        />
                      )}
                      {tab === "step2" && (
                        <UpdateStepTwo setTab={setTab} onSubmit={onSubmit} />
                      )}
                      {tab === "step3" && (
                        <UpdateStepThree setTab={setTab} onSubmit={onSubmit} />
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
