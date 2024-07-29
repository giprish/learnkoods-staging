"use client";

import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import RegisterProfile from "./components/register-profile";
import RegisterSocialnetworkBox from "./components/RegisterSocialnetworkBox";
import RegisterContactInfoBox from "./components/RegisterContactInfoBox";

import MenuToggler from "../../MenuToggler";
import axios from "axios";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ComapnyBreadCrumb from "./CompanyBreadCrumb";

import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema } from "@/validation/validation";

const index = () => {
  const methods = useForm({
    dirtyFields: true, // Set to true to trigger isDirty on the first change
    resolver: zodResolver(companySchema),
  });
  const [access, setAccess] = useState(null);
  const [id, setId] = useState();
  const [logo, setLogo] = useState({
    file: null,
    url: "",
  });
  const [cover, setCover] = useState({
    file: null,
    url: "",
  });

  const handelLogo = (e) => {
    setLogo((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
    console.log(logo.file, "image file");
  };
  const handleCover = (e) => {
    setCover((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
    console.log(cover.file, "image file");
  };

  useEffect(() => {
    const user = window.localStorage.getItem("user");
    const access = window.localStorage.getItem("access");
    const id = window.localStorage.getItem("id");
    setAccess(access);
    setId(id);
  }, []);

  const registerCompany = async (formdata) => {
    const { data: response } = await axios.post(
      `${process.env.GLOBAL_API}/comp/`,
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
    mutationFn: registerCompany,
    onSuccess: (data) => {
      console.log(data, "data from sucessful register");
      toast.success("Company registered successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      window.localStorage.setItem("company_id", data.data.id);
    },
    onError: (error) => {
      console.log(error, "error message");
      toast.error("Company registration Unsuccessful", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const onSubmit = (data) => {
    const Company = {
      ...data,
      address: data.address,
      city: data?.city?.value,
      description: data.description,
      email: data.email,
      industry: data?.industry?.value,
      name: data.name,
      phone_number: "+44 " + data.phone_number,
      website: data.website,
      user: id,
    };

    const formData = new FormData();

    // Append the company data to the formData
    Object.keys(Company).forEach((key) => {
      const value = Company[key];
      // Check if the value is an object and not null (excluding arrays and null)
      // if (value && typeof value === "object" && !Array.isArray(value)) {
      //   formData.append(key, JSON.stringify(value));
      // } else {
      formData.append(key, value);
      // }
    });

    // Print the FormData entries

    // Append the logo if it exists
    if (logo) {
      formData.append("logo_img", logo.file);
    }
    if (cover) {
      formData.append("cover_img", cover.file);
    }
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    // Debugging: Log formData entries to ensure correct data is being appended

    mutate(formData);
    // Submit only dirtyData to your API
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
          <ComapnyBreadCrumb title="Company Profile!" />
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
                    <RegisterProfile
                      onSubmit={onSubmit}
                      handelLogo={handelLogo}
                      handleCover={handleCover}
                      cover={cover}
                      logo={logo}
                    />
                  </div>
                </div>
                {/* <!-- Ls widget --> */}

                <div className="ls-widget">
                  <div className="tabs-box">
                    <div className="widget-title">
                      <h4>Social Network</h4>
                    </div>
                    {/* End .widget-title */}
                    <div className="widget-content">
                      <RegisterSocialnetworkBox onSubmit={onSubmit} />
                    </div>
                  </div>
                </div>
                {/* <!-- Ls widget --> */}

                <div className="ls-widget">
                  <div className="tabs-box">
                    <div className="widget-title">
                      <h4>Contact Information</h4>
                    </div>
                    {/* End .widget-title */}

                    <div className="widget-content">
                      <RegisterContactInfoBox onSubmit={onSubmit} />
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
