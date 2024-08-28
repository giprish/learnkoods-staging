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
  const methods = useForm();
  //   {
  //   dirtyFields: true,
  //   resolver: zodResolver(companySchema),
  // }
  const [access, setAccess] = useState(null);
  const [id, setId] = useState();
  const [logo, setLogo] = useState({
    file: null,
    url: "",
  });
  const [countryId, setCountryId] = useState({
    value: null,
    label: "",
  });
  const [stateId, setStateId] = useState({
    value: null,
    label: "",
  });

  const handleLogo = (e) => {
    setLogo((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
    console.log(logo.file, "image file");
  };

  useEffect(() => {
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

      const errorFields = [
        "email",
        "name",
        "email",
        "phone_number",
        "website",
        "since",
        "team_size",
        "industry",
        "country",
        "state",
        "city",
        "address1",
        "address",
        "description",
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
    const Company = {
      ...data,
      address: data.address,
      city: data?.city?.value,
      country: data?.country?.value,
      state: data?.state?.value,
      description: data.description,
      email: data.email,
      industry: data?.industry?.value,
      name: data.name,
      phone_number: data.phone_number,
      website: data.website,
      user: id,
    };

    console.log(data, "company register data");
    const formData = new FormData();

    // Append the company data to the formData
    Object.keys(Company).forEach((key) => {
      const value = Company[key];

      formData.append(key, value);
    });

    // Append the logo if it exists
    if (logo) {
      formData.append("logo_img", logo.file);
    }

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    mutate(formData);
  };

  return (
    <div className="page-wrapper-employer dashboard">
      <span className="header-span"></span>

      <LoginPopup />

      <DashboardHeader />

      <MobileMenu />

      <DashboardEmployerSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <ComapnyBreadCrumb title="Add New Company!" />

          <MenuToggler />

          <FormProvider {...methods}>
            <div className="row">
              <div className="col-lg-12">
                <div className="ls-widget">
                  <div className="tabs-box">
                    <RegisterProfile
                      onSubmit={onSubmit}
                      handleLogo={handleLogo}
                      logo={logo}
                      countryId={countryId}
                      setCountryId={setCountryId}
                      stateId={stateId}
                      setStateId={setStateId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </FormProvider>
        </div>
      </section>
    </div>
    // End page-wrapper
  );
};

export default index;
