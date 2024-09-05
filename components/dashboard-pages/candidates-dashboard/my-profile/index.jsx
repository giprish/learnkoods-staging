"use client";

import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import MyProfile from "./components/my-profile";
import SocialNetworkBox from "./components/SocialNetworkBox";
import ContactInfoBox from "./components/ContactInfoBox";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FormProvider, useForm } from "react-hook-form";
import ExperienceInfoBox from "./components/ExperienceInfoBox";
import EducationInfoBox from "./components/EducationInfoBox";
import CertificationInfoBox from "./components/CertificationInfoBox";

import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/validation/validation";
import ProfileTabs from "./components/profileTabs/ProfileTabs";

const index = () => {
  const methods = useForm({
    resolver: zodResolver(userSchema),
    mode: "onChange",
  });

  const dirtyFields = methods.formState.dirtyFields;
  const [tab, setTab] = useState("step1");
  const [access, setAccess] = useState(null);

  const [id, setId] = useState(null);
  const [image, setImage] = useState({
    file: null,
    url: "",
  });
  const [resume, setResume] = useState({
    file: null,
    url: "",
  });
  const [countryId, setCountryId] = useState({
    value: 0,
    label: "",
  });
  const [stateId, setStateId] = useState({
    value: 0,
    label: "",
  });

  useEffect(() => {
    const access = window.localStorage.getItem("access");
    const id = window.localStorage.getItem("id");
    setAccess(access);
    setId(id);
  }, []);

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

  const { data: user } = useQuery({
    queryKey: ["user", access],
    queryFn: () => fetchData(),
  });

  console.log(user, "candidate dashboard");

  useEffect(() => {
    if (user) {
      let array = user?.data?.skills.map((s1) => ({
        value: s1.id,
        label: s1.data,
      }));
      methods.reset(user?.data);
      methods.setValue("skills", array);
      methods.setValue("username", user?.user?.username);
      methods.setValue("email", user?.user?.email);
      methods.setValue("first_name", user?.user?.first_name);
      methods.setValue("last_name", user?.user?.last_name);
      methods.setValue("country", {
        value: user?.data?.country?.id,
        label: user?.data?.country?.name,
      });
      methods.setValue("state", {
        value: user?.data?.state?.id,
        label: user?.data?.state?.name,
      });
      methods.setValue("position", {
        value: user?.data?.position?.id,
        label: user?.data?.position?.name,
      });
      methods.setValue("city", {
        value: user?.data?.city?.id,
        label: user?.data?.city?.name,
      });
      setCountryId({
        value: user?.data?.country?.id,
        label: user?.data?.country?.name,
      });
      setStateId({
        value: user?.data?.state?.id,
        label: user?.data?.state?.name,
      });
      if (user?.data?.profile_image !== null) {
        setImage((prev) => ({
          ...prev,
          url: user?.data?.profile_image,
        }));
      }
      if (user?.data?.resume !== null) {
        setResume((prev) => ({
          ...prev,
          url: user?.data?.resume,
        }));
      }
    }
  }, [user]);

  const updateProfile = async (formdata) => {
    const { data: response } = await axios.put(
      `${process.env.GLOBAL_API}/usr_pro_id/${id}/`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ${access}`,
          // "Content-type": "multipart/form-data",
        },
      }
    );
    return response;
  };
  const { mutate, isLoading } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      console.log(data, "data from sucessful profile update");
      toast.success("Profile updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      // window.location.reload();
    },
    onError: (error) => {
      console.log(error, "error message");
      const errorFields = [
        "first_name",
        "last_name",
        "username",
        "gender",
        "position",
        "current_salary",
        "expected_salary",
        "experience_level",
        "age",
        "education_level",
        "languages",
        "skills",
        "profile_desc",
        "phone",
        "email",
        "country",
        "state",
        "city",
        "ddress1",
        "address",
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

  const handelImage = (e) => {
    setImage((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
    console.log(image.file, "image file");
  };
  const handelResume = (e) => {
    setResume((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
    console.log(resume.file, "image file");
  };

  const onSubmit = (data) => {
    console.log(data, "original data");
    // Debugging: Log dirtyFields to ensure it's being populated correctly
    console.log("Dirty Fields:", dirtyFields);

    const dirtyData = Object.keys(data).reduce((acc, key) => {
      if (dirtyFields[key]) {
        if (Array.isArray(data[key])) {
          // Handle multi-select fields by extracting labels
          acc[key] = data[key].map((option) => ({
            data: option.label,
          }));
        } else if (typeof data[key] === "object" && data[key].label) {
          // If the value is an object and has a label property, extract it
          acc[key] = data[key].value;
        } else if (
          key === "first_name" ||
          key === "last_name" ||
          key === "username" ||
          key === "email"
        ) {
          // Initialize the user object if it doesn't exist
          // if (!acc.user) {
          //   acc.user = {};
          // }
          // Add the fields to the user object
          acc[key] = data[key];
        } else {
          // Handle other fields
          acc[key] = data[key];
        }
      }
      return acc;
    }, {});
    // Debugging: Log dirtyData to ensure it's being populated correctly
    console.log("Dirty Data:", dirtyData);

    const formData = new FormData();

    for (const key in dirtyData) {
      if (Array.isArray(dirtyData[key])) {
        dirtyData[key].forEach((element, index) => {
          formData.append(`${key}[${index}]data`, element.data);
        });
      } else if (typeof dirtyData[key] === "object" && key === "user") {
        // Handle user object separately
        const user = dirtyData[key];
        for (const userKey in user) {
          formData.append(`user[${userKey}]`, user[userKey]);
        }
      } else {
        formData.append(key, dirtyData[key]);
      }
    }

    if (image.file) {
      formData.append("profile_image", image.file);
    }
    if (resume.file) {
      formData.append("resume", resume.file);
    }

    // Debugging: Log formData entries to ensure correct data is being appended
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    mutate(formData);
    // Submit only dirtyData to your API
  };

  const onError = (errors) => {
    console.log("Validation Errors:", errors);
  };

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardCandidatesHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardCandidatesSidebar />
      {/* <!-- End Candidates Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="" />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <ProfileTabs setTab={setTab} currentTab={tab} />

          <FormProvider {...methods}>
            <div className="row">
              <div className="col-lg-12">
                {tab === "step1" && (
                  <>
                    <div className="ls-widget">
                      <div className="tabs-box ">
                        <div className="widget-title">
                          <h4>My Profile</h4>
                        </div>
                        <MyProfile
                          onSubmit={onSubmit}
                          onError={onError}
                          handelImage={handelImage}
                          user={user}
                          handelResume={handelResume}
                          image={image}
                          resume={resume}
                        />
                      </div>
                    </div>
                  </>
                )}

                {tab === "step2" && (
                  <>
                    <div className="ls-widget">
                      <div className="tabs-box">
                        <div className="widget-title">
                          <h4>Contact Information</h4>
                        </div>
                        {/* End widget-title */}
                        <div className="widget-content">
                          <ContactInfoBox
                            onSubmit={onSubmit}
                            countryId={countryId}
                            setCountryId={setCountryId}
                            stateId={stateId}
                            setStateId={setStateId}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* <!-- Ls widget --> */}
                {tab === "step3" && (
                  <>
                    <div className="ls-widget">
                      <div className="tabs-box">
                        <div className="widget-title">
                          <h4>Education</h4>
                        </div>
                        {/* End widget-title */}
                        <div className="widget-content">
                          <EducationInfoBox onSubmit={onSubmit} />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {tab === "step4" && (
                  <>
                    <div className="ls-widget">
                      <div className="tabs-box">
                        <div className="widget-title">
                          <h4>Experience</h4>
                        </div>
                        {/* End widget-title */}
                        <div className="widget-content">
                          <ExperienceInfoBox onSubmit={onSubmit} />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {tab == "step5" && (
                  <>
                    <div className="ls-widget">
                      <div className="tabs-box">
                        <div className="widget-title">
                          <h4>Certification</h4>
                        </div>
                        {/* End widget-title */}
                        <div className="widget-content">
                          <CertificationInfoBox onSubmit={onSubmit} />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* <!-- Ls widget --> */}

                {/* <div className="ls-widget">
                  <div className="tabs-box">
                    <div className="widget-title">
                      <h4>Social Network</h4>
                    </div>
                    

                    <div className="widget-content">
                      <SocialNetworkBox />
                    </div>
                  </div>
                </div> */}
                {/* <!-- Ls widget --> */}
              </div>
            </div>
          </FormProvider>
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
