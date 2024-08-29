"use client";
import Link from "next/link";
import Image from "next/image.js";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Select from "react-select";

const JobListingsTable = () => {
  const [jobId, setJobdId] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [jobStatus, setJobStatus] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  const access = window.localStorage.getItem("access");
  const fetchCompany = async () => {
    const response = await axios.get(`${process.env.GLOBAL_API}/comp-user/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return response.data;
  };

  const { data: Companies } = useQuery({
    queryKey: ["companyList", access],
    queryFn: () => fetchCompany(),
    enabled: !!access,
    retry: 2,
  });

  const CompanyOptions = [
    { value: "", label: "Select", isDisabled: true },
    ...Companies?.data.map((company) => {
      return { value: company.id, label: company.name };
    }),
  ];

  const handleCompany = (selectedOption) => {
    setSelectedCompany(selectedOption);
    setCompanyId(selectedOption.value);
  };
  const fetchJobs = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/comp-job/${companyId}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { data: Jobs, refetch } = useQuery({
    queryKey: ["AllJobs", companyId],
    queryFn: () => fetchJobs(),
    retry: 2,
  });

  useEffect(() => {
    // Reset filtered jobs when companyId changes
    setFilteredJobs([]);

    if (Jobs) {
      if (jobStatus === "active") {
        // Filter jobs where is_published is true (active jobs)
        setFilteredJobs(Jobs?.data.filter((job) => job.is_published === true));
      } else if (jobStatus === "inactive") {
        // Filter jobs where is_published is false (inactive jobs)
        setFilteredJobs(Jobs?.data.filter((job) => job.is_published === false));
      } else {
        // If no status is selected, show all jobs
        setFilteredJobs(Jobs?.data);
      }
    }
  }, [Jobs, jobStatus, companyId]);

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

  const { data: AppliedCandidates } = useQuery({
    queryKey: ["AllJobs", jobId],
    queryFn: () => fetchAppliedCandidates(),
    enabled: !!jobId,
  });

  const callApplied = (id) => {
    setJobdId(id);
  };

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
  const publishJob = async (job) => {
    const response = await axios.put(
      `${process.env.GLOBAL_API}/job_api/${job.job_id}/`,
      { is_published: job.is_published },
      {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-type": "multipart/form-data",
        },
      }
    );
    return response.data;
  };

  // Setup the mutation with react-query
  const { mutate: publish } = useMutation({
    mutationFn: publishJob,
    onSuccess: (data) => {
      console.log(data, "data from successful publish");
      toast.success("Job published", {
        position: toast.POSITION.TOP_RIGHT,
      });
      refetch();
    },
    onError: (data) => {
      console.log(data, "error message");
      toast.error("Publishing Unsuccessful", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });
  const handleDelete = (job_id) => {
    mutate(job_id);
  };
  const handlePublish = ({ checked, job }) => {
    const dataToSend = {
      is_published: checked,
      job_id: job.job_id,
    };
    console.log(dataToSend, "console toggle");
    publish(dataToSend);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>Select Company</h4>

        <div className="form-group col-6">
          <Select
            options={CompanyOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleCompany}
            value={selectedCompany}
          />
        </div>
        <div className="chosen-outer">
          <select
            className="chosen-single form-select"
            onChange={(event) => setJobStatus(event.target.value)}
          >
            <option>All</option>
            <option value="active">Active</option>
            <option value="inactive">InActive</option>
          </select>
        </div>
      </div>

      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Applicants</th>
                <th>Created On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.map((item) => (
                <tr key={item.job_id}>
                  <td>
                    <div className="job-block">
                      <div className="inner-box">
                        <div className="content">
                          <span className="company-logo">
                            <Image
                              width={50}
                              height={49}
                              src={
                                item.company
                                  ? `${item.company?.logo}`
                                  : "/images/resource/richard.png"
                              }
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
                              {item?.city?.name}, {item?.country?.name}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="applied">
                    <a
                      href="/employers-dashboard/all-applicants"
                      onClick={() => callApplied(item?.job_id)}
                    >
                      {" "}
                      Applied
                    </a>
                  </td>
                  <td>{formatDate(item?.created_at)}</td>
                  <td
                    className=""
                    style={{ color: item.is_published ? "green" : "red" }}
                  >
                    {item?.is_published ? "Active" : "Inactive"}
                    <ul className="switchbox">
                      <li>
                        <label className="switch">
                          <input
                            type="checkbox"
                            value={item?.is_published}
                            checked={item.is_published}
                            onChange={(e) =>
                              handlePublish({
                                checked: e.target.checked,
                                job: item,
                              })
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </li>
                    </ul>
                  </td>
                  <td>
                    <div className="option-box">
                      <ul className="option-list">
                        <Link href={`/job-single-v1/${item.job_id}`}>
                          <li>
                            <button data-text="View">
                              <span className="la la-eye"></span>
                            </button>
                          </li>
                        </Link>
                        <Link
                          href={`/employers-dashboard/edit-job/${item.job_id}`}
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
    </div>
  );
};

export default JobListingsTable;
