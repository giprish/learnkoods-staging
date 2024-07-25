"use client";
import Link from "next/link";
import jobs from "../../../../../data/job-featured.js";
import Image from "next/image.js";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import appliedJobs from "@/pages/candidates-dashboard/applied-jobs/index.js";

const JobListingsTable = () => {
  const [jobId, setJobdId] = useState(null);
  const access = window.localStorage.getItem("access");
  const fetchJobs = async () => {
    const response = await axios.get(`${process.env.GLOBAL_API}/job-user/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return response.data;
  };

  const { data: Jobs } = useQuery({
    queryKey: ["AllJobs"],
    queryFn: () => fetchJobs(),
  });
  const fetchAppliedCandidates = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/usr_job_applied/${jobId}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { data: AppliedCandidates, refetch } = useQuery({
    queryKey: ["AllJobs", jobId],
    queryFn: () => fetchAppliedCandidates(),
  });

  const callApplied = (id) => {
    setJobdId(id);
  };

  console.log(AppliedCandidates);
  const deleteJob = async (job_id) => {
    const response = await axios.delete(
      `${process.env.GLOBAL_API}/job_api/${job_id}/`,
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
    mutationFn: deleteJob,
    onSuccess: (data) => {
      console.log(data, "data from successful deletion");
      toast.success("Job deleted", {
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

  // Define the handleDelete function to call mutate with job_id
  const handleDelete = (job_id) => {
    mutate(job_id);
  };

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>My Job Listings</h4>

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
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Applications</th>
                <th>Created & Expired</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {Jobs?.data.map((item) => (
                <tr key={item.job_id}>
                  <td>
                    <div className="job-block">
                      <div className="inner-box">
                        <div className="content">
                          <span className="company-logo">
                            <Image
                              width={50}
                              height={49}
                              src={`${process.env.GLOBAL_API}${item.job_image}`}
                              alt="logo"
                            />
                          </span>
                          <h4>
                            <Link href={`/job-single-v1/${item.job_id}`}>
                              {item.job_title}
                            </Link>
                          </h4>
                          <ul className="job-info">
                            <li>
                              <span className="icon flaticon-briefcase"></span>
                              {item?.job_type}
                            </li>
                            <li>
                              <span className="icon flaticon-map-locator"></span>
                              {item?.city?.name}, UK
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="applied">
                    <a href="#" onClick={() => callApplied(item?.job_id)}>
                      {" "}
                      Applied
                    </a>
                  </td>
                  <td>
                    October 27, 2017 <br />
                    April 25, 2011
                  </td>
                  <td className="status">
                    {item?.is_published ? "Active" : "Inactive"}
                  </td>
                  <td>
                    <div className="option-box">
                      <ul className="option-list">
                        <Link
                          // href={`/employers-dashboard/edit-job/${item.job_id}`}
                          href={`/job-single-v1/${item.job_id}`}
                        >
                          <li>
                            <button data-text="View Aplication">
                              <span className="la la-eye"></span>
                            </button>
                          </li>
                        </Link>
                        <Link
                          href={`/employers-dashboard/edit-job/${item.job_id}`}
                        >
                          <li>
                            <button data-text="Edit Aplication">
                              <span className="la la-pencil"></span>
                            </button>
                          </li>
                        </Link>
                        <li>
                          <button
                            data-text="Delete Aplication"
                            onClick={() => {
                              handleDelete(item.job_id);
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
      {/* End table widget content */}
    </div>
  );
};

export default JobListingsTable;
