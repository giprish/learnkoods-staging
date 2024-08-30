"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Select from "react-select";

const ComapnyBreadCrumb = ({
  title,
  setCompanyId,
  setComanyName,
  companyname,
}) => {
  const access = window.localStorage.getItem("access");
  const router = useRouter();

  const fetchCompany = async () => {
    const response = await axios.get(`${process.env.GLOBAL_API}/comp-user/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return response.data;
  };

  const { data: company } = useQuery({
    queryKey: ["companyList", access],
    queryFn: () => fetchCompany(),
  });

  // console.log(company);
  const options = [
    { value: "", label: "Select", isDisabled: true }, // Disabled "Select" option
    ...(company?.data?.map((option) => ({
      value: option.id,
      label: option.name,
    })) || []),
  ];

  return (
    <div className="upper-title-box">
      <h3 className="mb-3">{title}</h3>
      {/* <h3>{companyname ? companyname : ""}</h3> */}
      {(router.pathname === "/employers-dashboard/company-profile" ||
        router.pathname === "/employers-dashboard/post-jobs") && (
        <>
          <div className="">
            {router.pathname === "/employers-dashboard/company-profile" ||
            router.pathname === "/employers-dashboard/post-jobs" ? (
              <h5 className="mb-4">
                <b>Select Company</b>
              </h5>
            ) : (
              " "
            )}
          </div>
          <Select
            name="colors"
            options={options} // Adding the "Select" default option
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(e) => {
              setCompanyId(e.value);
              setComanyName(e.label);
            }}
            required
          />
        </>
      )}
    </div>
  );
};

export default ComapnyBreadCrumb;
