"use client";

import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import MyProfile from "./components/my-profile/index";
// import ContactInfoBox from "./components/ContactInfoBox";
import MenuToggler from "../../MenuToggler";
import axios from "axios";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import ComapnyBreadCrumb from "../register-company/CompanyBreadCrumb";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyRegistrationSchema } from "@/validation/validation";

const index = () => {
  const methods = useForm({
    mode: "onChange",
    resolver: zodResolver(companyRegistrationSchema),
  });
  const dirtyFields = methods.formState.dirtyFields;
  const [access, setAccess] = useState(null);
  const router = useRouter();
  const companyid = router.query.id;
  const [companyname, setCompanyName] = useState(null);

  const [logo, setLogo] = useState({
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

  const [previousImage, setPreviousImage] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleLogo = (e) => {
    setLogo((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
    console.log(logo.file, "image file");
  };

  useEffect(() => {
    const access = window.localStorage.getItem("access");
    const userid = window.localStorage.getItem("id");
    setAccess(access);
    setUserId(userid);
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
    methods.setValue("pincode", company?.data.pincode);
    methods.setValue("email", company?.data.email);
    methods.setValue("since", company?.data.since);
    methods.setValue("industry", {
      value: company?.data?.industry?.id,
      label: company?.data?.industry?.name,
    });
    methods.setValue("country", {
      value: company?.data?.country?.id,
      label: company?.data?.country?.name,
    });
    methods.setValue("state", {
      value: company?.data?.state?.id,
      label: company?.data?.state?.name,
    });

    methods.setValue("name", company?.data.name);
    methods.setValue("phone_number", company?.data.phone_number);
    methods.setValue("website", company?.data.website);
    methods.setValue("address", company?.data.address);
    methods.setValue("team_size", company?.data.team_size);
    methods.setValue("since", company?.data.since);
    methods.setValue("address1", company?.data.address1);

    if (typeof company !== "undefined") {
      setPreviousImage(company?.data?.logo);
      setLogo((prev) => ({
        ...prev,
        url: company?.data?.logo,
      }));
      setStateId((prev) => ({
        ...prev,
        value: company?.data?.state?.id,
        label: company?.data?.state?.name,
      }));
      setCountryId((prev) => ({
        ...prev,
        value: company?.data?.country?.id,
        label: company?.data?.country?.name,
      }));
    }
    console.log(company, "company data");
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
    if (companyid === null) {
      toast.error("please select a company", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      console.log(dirtyFields, "dirtyfields");
      const Company = {
        ...data,
        address: data?.address,
        city: data?.city?.value,
        country: data?.country?.value,
        state: data?.state?.value,
        description: data?.description,
        email: data?.email,
        industry: data?.industry?.value, // Ensuring industry is an array of labels
        name: data?.name,
        phone_number: data?.phone_number,
        website: data?.website,
        since: data?.since,
        user: userId,
      };

      console.log(Company, "update data");
      const formData = new FormData();
      const imageChanged = logo?.file !== null;

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
        formData.append("logo_img", logo?.file);
      }
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // console.log(formData);
      mutate(formData);
      // Submit only dirtyData to your API
    }
  };

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>

      <LoginPopup />

      <DashboardHeader />

      <MobileMenu />

      <DashboardEmployerSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <ComapnyBreadCrumb
            title="Company Profile!"
            setComanyName={setCompanyName}
            companyname={companyname}
          />
          <MenuToggler />

          <FormProvider {...methods}>
            <div className="row">
              <div className="col-lg-12">
                <div className="ls-widget">
                  <div className="tabs-box">
                    <div className="widget-title">
                      <h4>{""}</h4>
                    </div>
                    <MyProfile
                      onSubmit={onSubmit}
                      company={company}
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
  );
};

export default index;
