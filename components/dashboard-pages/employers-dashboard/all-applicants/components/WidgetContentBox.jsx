import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Link from "next/link";
import Select from "react-select";
import axios from "axios";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import allApplicants from "@/pages/employers-dashboard/all-applicants";

const WidgetContentBox = () => {
  const [jobId, setJobdId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [access, setAccess] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccess(window.localStorage.getItem("access"));
    }
  }, []);
  const fetchAllApplicants = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/all-shortlist/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { data: Allapplicants } = useQuery({
    queryKey: ["Allapplicants"],
    queryFn: () => fetchAllApplicants(),

    enabled: !!access,
  });

  console.log(Allapplicants, "all shortlist");

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

    enabled: !!access,
  });

  const JobOptions = Jobs?.data.map((job) => {
    return { value: job.job_id, label: job.job_title };
  });

  const handleJob = (selectedOption) => {
    setSelectedOption(selectedOption);
    setJobdId(selectedOption.value);
  };

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
    queryKey: ["AppliedCandidates", jobId],
    queryFn: () => fetchAppliedCandidates(),
    enabled: !!jobId && !!access,
  });

  console.log(AppliedCandidates, "applied candidates usr_job_applied");

  const fetchApplicantStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.GLOBAL_API}/single_job_applied/${jobId}/`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // You can throw an error or return a specific value if you want to handle it in the query
      throw new Error("Failed to fetch applicant status");
    }
  };

  const { data: ApplicantStatus, isError } = useQuery({
    queryKey: ["ApplicantStatus", jobId],
    queryFn: fetchApplicantStatus, // No need to wrap in an arrow function
    enabled: !!jobId && !!access, // Only enable query if jobId and access are available
    staleTime: Infinity, // Prevents refetching until the component is unmounted or cache is invalidated manually
    cacheTime: Infinity, // Keeps the data in cache indefinitely
  });

  console.log(ApplicantStatus, "applicant status single_job_applied");
  useEffect(() => {
    if (isError) {
      toast.error("No Data found", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, [isError]);

  useEffect(() => {
    const mergedArray = AppliedCandidates?.data.map((item) => {
      const matchingProfile = AppliedCandidates?.profile.find(
        (profile) => profile.profile_id === item.student.id
      );

      const matchingStatus = ApplicantStatus?.data.find(
        (status) => status.student.id === item.student.id
      );
      if (matchingProfile) {
        return {
          ...item,
          ...matchingStatus,
          student: {
            ...item.student,
            ...matchingProfile,
          },
        };
      }
      return item;
    });
    if (mergedArray) {
      setApplicants(mergedArray);
    }
  }, [AppliedCandidates, ApplicantStatus]);

  console.log(applicants, "merged arrays");

  const toggleApplicantState = (id, key) => {
    setApplicants((prevApplicants) =>
      prevApplicants.map((applicant) => {
        if (applicant.applicant_id === id) {
          const newApplicantState = { ...applicant, [key]: !applicant[key] };

          return newApplicantState;
        }
        return applicant;
      })
    );
  };

  const updateApplicant = async (updatedApplicant) => {
    const response = await axios.put(
      `${process.env.GLOBAL_API}/shortlist/${updatedApplicant.application_id}/`,
      {
        // job_applicant: updatedApplicant.student.id,
        employer: updatedApplicant.job_employer.id,
        is_approved: updatedApplicant.is_approved,
        is_interview: updatedApplicant.is_interview,
        is_rejected: updatedApplicant.is_rejected,
        is_shortlist: updatedApplicant.is_shortlist,
      },
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { mutate } = useMutation({
    mutationFn: updateApplicant,
    onSuccess: (data) => {
      console.log("Applicant updated successfully:", data);
      // setApplicants((prevApplicants) =>
      //   prevApplicants.map((applicant) =>
      //     applicant.id === data.id ? data : applicant
      //   )
      // );
      toast.success("Applicant Status Updated", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (error) => {
      console.error("Error updating applicant:", error);
      toast.error("Could Not Update Applicant Status", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const handleUpdate = (id) => {
    console.log(id, "url id");
    const updatedApplicant = applicants.find(
      (applicant) => applicant.application_id === id
    );
    console.log(updatedApplicant, "updated applicant");
    mutate(updatedApplicant);
  };

  return (
    <div className="widget-content">
      <div className="tabs-box">
        <Tabs>
          <div className="d-flex aplicants-upper-bar">
            {/* <h6>Senior Product Designer</h6> */}
            <div className="form-group col-6">
              <Select
                options={JobOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleJob}
                value={selectedOption}
              />
            </div>
            <div className="col-6">
              <TabList className="aplicantion-status tab-buttons clearfix">
                <Tab className="tab-btn totals"> Total(s): 6</Tab>
                <Tab className="tab-btn approved"> Approved: 2</Tab>
                <Tab className="tab-btn rejected"> Rejected(s): 4</Tab>
              </TabList>
            </div>
          </div>

          <div className="tabs-content">
            <TabPanel>
              <div className="row">
                {applicants?.map((student) => (
                  <div
                    className="candidate-block-three col-lg-6 col-md-12 col-sm-12"
                    key={student.applicant_id}
                  >
                    <div className="inner-box">
                      <div className="content">
                        <figure className="image">
                          <img
                            src={student.student.profile_image}
                            alt="candidates"
                          />
                        </figure>
                        <h4 className="name">
                          <Link
                            href={`/candidates-single-v1/${student.student.id}`}
                          >
                            {student.student.name}
                          </Link>
                        </h4>

                        <ul className="candidate-info">
                          <li className="designation">
                            {student.student.designation || "null"}
                          </li>
                          <li>
                            <span className="icon flaticon-map-locator"></span>{" "}
                            {student.student.city?.name || "null"}
                          </li>
                          <li>
                            <span className="icon flaticon-money"></span> $
                            {student.student.hourlyRate || "null"} / hour
                          </li>
                        </ul>
                        <ul className="post-tags">
                          {student.student.skills.map((val, i) => (
                            <li key={i} className="my-2">
                              <a href="#">{val.data}</a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="option-box">
                        <ul className="option-list">
                          <li>
                            <button
                              data-text="ShortList Aplication"
                              onClick={() =>
                                toggleApplicantState(
                                  student.applicant_id,
                                  "is_shortlist"
                                )
                              }
                              style={{
                                backgroundColor: student.is_shortlist
                                  ? "#83da83"
                                  : "#f3a9a9",
                              }}
                            >
                              <span className="la la-eye"></span>
                            </button>
                          </li>
                          <li>
                            <button
                              data-text="Approve Aplication"
                              onClick={() =>
                                toggleApplicantState(
                                  student.applicant_id,
                                  "is_approved"
                                )
                              }
                              style={{
                                backgroundColor: student.is_approved
                                  ? "#83da83"
                                  : "#f3a9a9",
                              }}
                            >
                              <span className="la la-check"></span>
                            </button>
                          </li>
                          <li>
                            <button
                              data-text="Interview Aplication"
                              onClick={() =>
                                toggleApplicantState(
                                  student.applicant_id,
                                  "is_interview"
                                )
                              }
                              style={{
                                backgroundColor: student.is_interview
                                  ? "#83da83"
                                  : "#f3a9a9",
                              }}
                            >
                              <span className="la la-briefcase"></span>
                            </button>
                          </li>
                          <li>
                            <button
                              data-text="Reject Aplication"
                              onClick={() =>
                                toggleApplicantState(
                                  student.applicant_id,
                                  "is_rejected"
                                )
                              }
                              style={{
                                backgroundColor: student.is_rejected
                                  ? "#83da83"
                                  : "#f3a9a9",
                              }}
                            >
                              <span className="la la-times-circle"></span>
                            </button>
                          </li>
                          <li>
                            <button
                              data-text="Update Application"
                              onClick={() => {
                                handleUpdate(student.application_id);
                                console.log(student.application_id);
                              }}
                            >
                              <span className="la la-angle-double-up"></span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel>
            {/* End total applicants */}

            {/* <TabPanel>
              <div className="row">
                {candidatesData.slice(17, 19).map((candidate) => (
                  <div
                    className="candidate-block-three col-lg-6 col-md-12 col-sm-12"
                    key={candidate.id}
                  >
                    <div className="inner-box">
                      <div className="content">
                        <figure className="image">
                          <img src={candidate.avatar} alt="candidates" />
                        </figure>
                        <h4 className="name">
                          <Link href={`/candidates-single-v1/${candidate.id}`}>
                            {candidate.name}
                          </Link>
                        </h4>

                        <ul className="candidate-info">
                          <li className="designation">
                            {candidate.designation}
                          </li>
                          <li>
                            <span className="icon flaticon-map-locator"></span>{" "}
                            {candidate.location}
                          </li>
                          <li>
                            <span className="icon flaticon-money"></span> $
                            {candidate.hourlyRate} / hour
                          </li>
                        </ul>

                        <ul className="post-tags">
                          {candidate.tags.map((val, i) => (
                            <li key={i}>
                              <a href="#">{val}</a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="option-box">
                        <ul className="option-list">
                          <li>
                            <button data-text="View Aplication">
                              <span className="la la-eye"></span>
                            </button>
                          </li>
                          <li>
                            <button data-text="Approve Aplication">
                              <span className="la la-check"></span>
                            </button>
                          </li>
                          <li>
                            <button data-text="Reject Aplication">
                              <span className="la la-times-circle"></span>
                            </button>
                          </li>
                          <li>
                            <button data-text="Delete Aplication">
                              <span className="la la-trash"></span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel> */}
            {/* End approved applicants */}

            {/* <TabPanel>
              <div className="row">
                {candidatesData.slice(17, 21).map((candidate) => (
                  <div
                    className="candidate-block-three col-lg-6 col-md-12 col-sm-12"
                    key={candidate.id}
                  >
                    <div className="inner-box">
                      <div className="content">
                        <figure className="image">
                          <img src={candidate.avatar} alt="candidates" />
                        </figure>
                        <h4 className="name">
                          <Link href={`/candidates-single-v1/${candidate.id}`}>
                            {candidate.name}
                          </Link>
                        </h4>

                        <ul className="candidate-info">
                          <li className="designation">
                            {candidate.designation}
                          </li>
                          <li>
                            <span className="icon flaticon-map-locator"></span>{" "}
                            {candidate.location}
                          </li>
                          <li>
                            <span className="icon flaticon-money"></span> $
                            {candidate.hourlyRate} / hour
                          </li>
                        </ul>
                        

                        <ul className="post-tags">
                          {candidate.tags.map((val, i) => (
                            <li key={i}>
                              <a href="#">{val}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                     

                      <div className="option-box">
                        <ul className="option-list">
                          <li>
                            <button data-text="View Aplication">
                              <span className="la la-eye"></span>
                            </button>
                          </li>
                          <li>
                            <button data-text="Approve Aplication">
                              <span className="la la-check"></span>
                            </button>
                          </li>
                          <li>
                            <button data-text="Reject Aplication">
                              <span className="la la-times-circle"></span>
                            </button>
                          </li>
                          <li>
                            <button data-text="Delete Aplication">
                              <span className="la la-trash"></span>
                            </button>
                          </li>
                        </ul>
                      </div>
                      
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel> */}
            {/* End rejected applicants */}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default WidgetContentBox;
