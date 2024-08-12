"use client";

import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";
import MyProfile from "./components/my-profile";
import SocialNetworkBox from "./components/SocialNetworkBox";
import ContactInfoBox from "./components/ContactInfoBox";

import MenuToggler from "../../MenuToggler";
import axios from "axios";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import ComapnyBreadCrumb from "../register-company/CompanyBreadCrumb";
import { toast } from "react-toastify";

const index = () => {
  const methods = useForm({
    mode: "onChange",
  });
  const dirtyFields = methods.formState.dirtyFields;
  const [access, setAccess] = useState(null);
  const [companyid, setCompanyId] = useState(null);
  const [companyname, setCompanyName] = useState(null);
  const [image, setImage] = useState({
    file: null,
    url: "",
  });
  const [cover, setCover] = useState({
    file: null,
    url: "",
  });
  const [previousImage, setPreviousImage] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleImage = (e) => {
    setImage((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
    console.log(image.file, "image file");
  };
  const handleCover = (e) => {
    setCover((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
    console.log(cover.file, "image file");
  };

  useEffect(() => {
    const access = window.localStorage.getItem("access");
    const userid = window.localStorage.getItem("id");
    setAccess(access);
    setUserId(userid);
    console.log(access);
  }, [companyid]);

  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/comp/${companyid}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { data: company } = useQuery({
    queryKey: ["company", companyid],
    queryFn: () => fetchData(),
  });

  useEffect(() => {
    methods.setValue("city", {
      value: company?.data?.city?.id,
      label: company?.data?.city?.name,
    });
    methods.setValue("description", company?.data.description);
    methods.setValue("email", company?.data.email);
    methods.setValue("industry", {
      value: company?.data?.industry?.id,
      label: company?.data?.industry?.name,
    });
    methods.setValue("name", company?.data.name);
    methods.setValue("phone_number", company?.data.phone_number);
    methods.setValue("website", company?.data.website);
    methods.setValue("address", company?.data.address);

    // Set the image from the company data
    // Keep track of the previous image
    if (typeof company !== "undefined") {
      setPreviousImage(company?.data?.logo);
      setImage((prev) => ({
        ...prev,
        url: company?.data?.logo,
      }));

      if (typeof company?.data?.cover !== "undefined") {
        setCover((prev) => ({
          ...prev,
          url: company?.data?.cover,
        }));
      }
    }
    console.log(company, "company data");
    // if (typeof window !== "undefined") {
    //   window.localStorage.setItem("profile_image", company?.data?.logo);
    // }
  }, [company]);

  const updateCompany = async (formdata) => {
    const { data: response } = await axios.put(
      `${process.env.GLOBAL_API}/comp/${companyid}/`,
      formdata,
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
    mutationFn: updateCompany,
    onSuccess: (data) => {
      console.log(data, "data from sucessful Company details update");
      toast.success("Company details updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (error) => {
      console.log(error, "error message");
      toast.error("Company details update Unsuccessful", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const onSubmit = (data) => {
    if (companyid === null) {
      toast.error("please select a company", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      console.log(dirtyFields, "dirtyfields");
      const Company = {
        ...data,
        address: data.address,
        city: data.city.value,
        description: data.description,
        email: data.email,
        industry: data.industry.value, // Ensuring industry is an array of labels
        name: data.name,
        phone_number: data.phone_number,
        website: data.website,
        user: userId,
      };
      const formData = new FormData();
      const imageChanged = image !== previousImage;

      const dirtyData = Object.keys(Company).reduce((acc, key) => {
        if (dirtyFields[key]) {
          acc[key] = Company[key];
        }
        return acc;
      }, {});

      console.log("Dirty Data:", dirtyData);

      // Append the dirty Data to the formData
      Object.keys(dirtyData).forEach((key) => {
        if (key === "logo_img" && !imageChanged) {
          // If the image hasn't changed and it's the logo_img field, skip appending it
          return;
        }
        formData.append(key, Company[key]);
      });
      if (imageChanged) {
        formData.append("logo_img", image?.file);
      }
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      mutate(formData);
      // Submit only dirtyData to your API
    }
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
            title="Company Profile!"
            setCompanyId={setCompanyId}
            setComanyName={setCompanyName}
            companyname={companyname}
          />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}
          <FormProvider {...methods}>
            <div className="row">
              <div className="col-lg-12">
                <div className="ls-widget">
                  <div className="tabs-box">
                    <div className="widget-title">
                      <h4>My Profile</h4>
                    </div>
                    <MyProfile
                      onSubmit={onSubmit}
                      handleCover={handleCover}
                      company={company}
                      handleImage={handleImage}
                      image={image}
                      cover={cover}
                    />
                  </div>
                </div>
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

                <div className="ls-widget">
                  <div className="tabs-box">
                    <div className="widget-title">
                      <h4>Contact Information</h4>
                    </div>
                    {/* End .widget-title */}

                    <div className="widget-content">
                      <ContactInfoBox onSubmit={onSubmit} />
                    </div>
                  </div>
                </div>
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
