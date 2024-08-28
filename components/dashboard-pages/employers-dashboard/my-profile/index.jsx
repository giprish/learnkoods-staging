"use client";

import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import BreadCrumb from "../../BreadCrumb";
import Form from "./components/Form";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import DashboardHeader from "../../../header/DashboardHeader";
import MenuToggler from "../../MenuToggler";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FormProvider, useForm } from "react-hook-form";

const index = () => {
  const methods = useForm({
    // resolver: zodResolver(userSchema),
    // mode: "onChange",
  });

  const dirtyFields = methods.formState.dirtyFields;
  const [access, setAccess] = useState(null);
  const [id, setId] = useState(null);
  const [image, setImage] = useState({
    file: null,
    url: "",
  });

  useEffect(() => {
    const access = window.localStorage.getItem("access");
    const id = window.localStorage.getItem("id");
    setAccess(access);
    setId(id);
  }, []);

  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/comp-user/update/${id}/`,
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

  useEffect(() => {
    methods.reset(user?.data);

    console.log(user, "employer profile data");
  }, [user]);

  const updateProfile = async (formdata) => {
    const { data: response } = await axios.put(
      `${process.env.GLOBAL_API}/comp-user/update/${id}/`,
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
      if (typeof window !== "undefined") {
        localStorage.setItem("user", data?.data?.username);
      }
      // window.location.reload();
    },
    onError: (error) => {
      console.log(error, "error message");
      const errorFields = ["first_name", "last_name", "email", "username"];
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

  const handleImage = (e) => {
    setImage((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
    console.log(image.file, "image file");
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
          acc[key] = data[key].label;
        } else if (
          key === "first_name" ||
          key === "last_name" ||
          key === "username" ||
          key === "email"
        ) {
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
      {/* <!-- End Candidates Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="My Profile!" />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <FormProvider {...methods}>
            <div className="row">
              <div className="col-lg-12">
                <div className="ls-widget">
                  <div className="tabs-box ">
                    <div className="widget-title">
                      <h4>My Profile</h4>
                    </div>
                    <Form
                      onSubmit={onSubmit}
                      onError={onError}
                      handleImage={handleImage}
                      user={user}
                      image={image}
                    />
                  </div>
                </div>
              </div>
            </div>
          </FormProvider>
          {/* End .row */}
        </div>
      </section>
    </div>
  );
};

export default index;
