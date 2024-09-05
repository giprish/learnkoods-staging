"use client";
import Link from "next/link";
import jobs from "../../../../../data/job-featured.js";
import Image from "next/image.js";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import appliedJobs from "@/pages/candidates-dashboard/applied-jobs/index.js";

const CompanyListingsTable = () => {
  const [jobId, setJobdId] = useState(null);
  const access = window.localStorage.getItem("access");

  const fetchCompany = async () => {
    const response = await axios.get(`${process.env.GLOBAL_API}/comp-user/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return response.data;
  };

  const { data: companies } = useQuery({
    queryKey: ["companyList", access],
    queryFn: () => fetchCompany(),
    retry: 1,
  });

  console.log(companies, "list of companies");

  const deleteCompany = async (company_id) => {
    const response = await axios.delete(
      `${process.env.GLOBAL_API}/comp/${company_id}/`,

      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  // Setup the mutation with react-query
  const { mutate, isLoading } = useMutation({
    mutationFn: deleteCompany,
    onSuccess: (data) => {
      console.log(data, "data from successful deletion");
      toast.success("Company deleted", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (data) => {
      console.log(data, "error message");
      toast.error("Deletion Unsuccessful", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  // Setup the mutation with react-query

  const handleDelete = (company_id) => {
    mutate(company_id);
  };

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>Company Listings</h4>
      </div>

      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Website</th>
                <th>Industry</th>
                <th>Size</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {companies?.data.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="job-block">
                      <div className="inner-box">
                        <div className="content">
                          <span className="company-logo">
                            <Image
                              width={50}
                              height={49}
                              src={
                                item.logo
                                  ? `${item.logo}`
                                  : "/images/resource/richard.png"
                              }
                              alt="logo"
                            />
                          </span>
                          <h4>
                            <Link
                              href={`/employers-dashboard/edit-companies/${item.id}`}
                            >
                              {item.name}
                            </Link>
                          </h4>
                          <ul className="job-info">
                            {/* <li>
                              <span className="icon flaticon-briefcase"></span>
                              {item?.industry?.name}
                            </li> */}
                            <li>
                              <span className="icon flaticon-map-locator"></span>
                              {item?.city?.name}, {item?.country?.name}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="applied">
                    <a href="#"> {item.website}</a>
                  </td>
                  <td>{item?.industry?.name}</td>
                  <td className="">{item?.team_size}</td>
                  <td>
                    <div className="option-box">
                      <ul className="option-list">
                        <Link
                          href={`/employers-dashboard/edit-companies/${item.id}`}
                        >
                          <li>
                            <button data-text="Edit">
                              <span className="la la-pencil"></span>
                            </button>
                          </li>
                        </Link>
                        <li>
                          <button
                            data-text="Delete"
                            onClick={() => {
                              handleDelete(item.id);
                            }}
                          >
                            <span className="la la-trash"></span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyListingsTable;
