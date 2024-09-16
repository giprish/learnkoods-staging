"use client";

import Link from "next/link.js";
import jobs from "../../../../../data/job-featured.js";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const JobListingsTable = () => {
  const [userId, setUserId] = useState("");
  const [access, setAccess] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("id"));
      setAccess(localStorage.getItem("access"));
    }
  }, []);

  const fetchAppliedJobs = async () => {
    const resposne = await axios.get(
      `${process.env.GLOBAL_API}/job-user-applicant/${userId}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    return resposne.data;
  };

  const { data: appliedJobs } = useQuery({
    queryKey: ["appliedJobs"],
    queryFn: () => fetchAppliedJobs(),
  });

  console.log(appliedJobs);
  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>My Applied Jobs</h4>

        <div className="chosen-outer">
          {/* <!--Tabs Box--> */}
          <select className="chosen-single form-select">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Last 16 Months</option>
            <option>Last 24 Months</option>
            <option>Last 5 year</option>
          </select>
        </div>
      </div>
      {/* End filter top bar */}

      {/* Start table widget content */}
      <div className="widget-content">
        <div className="table-outer">
          <div className="table-outer">
            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Date Applied</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {appliedJobs?.jobs?.map((item) => {
                  const matchedObj = appliedJobs?.data.find(
                    (obj) => obj.job_id === item.job
                  );
                  return (
                    <tr key={item.job_id}>
                      <td>
                        {/* <!-- Job Block --> */}
                        <div className="job-block">
                          <div className="inner-box">
                            <div className="content">
                              <span className="company-logo">
                                <img
                                  src={`${item?.company?.logo}`}
                                  alt="logo"
                                />
                              </span>
                              <h4>
                                <Link href={`/job-single/${item.job_id}`}>
                                  {item.job_title}
                                </Link>
                              </h4>
                              <ul className="job-info">
                                <li>
                                  <span className="icon flaticon-briefcase"></span>
                                  {item.job_type}
                                </li>
                                <li>
                                  <span className="icon flaticon-map-locator"></span>
                                  {item?.city?.name ? item?.city?.name : "N/A"},
                                  UK
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {matchedObj?.created_at
                          ? new Date(matchedObj.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="status">
                        {item?.is_published ? "Active" : "Inactive"}
                      </td>
                      <td>
                        <div className="option-box">
                          <ul className="option-list">
                            <li>
                              <button data-text="View">
                                <span className="la la-eye"></span>
                              </button>
                            </li>
                            <li>
                              <button data-text="Delete">
                                <span className="la la-trash"></span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* End table widget content */}
    </div>
  );
};

export default JobListingsTable;
