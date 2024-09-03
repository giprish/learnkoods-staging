"use client";
import dynamic from "next/dynamic";
import jobs from "../../data/job-featured";
import LoginPopup from "../../components/common/form/login/LoginPopup";
import FooterDefault from "../../components/footer/common-footer";
import DefaulHeader from "../../components/header/DefaulHeader";
import MobileMenu from "../../components/header/MobileMenu";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Seo from "../../components/common/Seo";
import RelatedJobs from "../../components/job-single-pages/related-jobs/RelatedJobs";
import JobOverView from "../../components/job-single-pages/job-overview/JobOverView";
import JobSkills from "../../components/job-single-pages/shared-components/JobSkills";
import CompnayInfo from "../../components/job-single-pages/shared-components/CompanyInfo";
import MapJobFinder from "../../components/job-listing-pages/components/MapJobFinder";
import SocialTwo from "../../components/job-single-pages/social/SocialTwo";
import JobDetailsDescriptions from "../../components/job-single-pages/shared-components/JobDetailsDescriptions";
import ApplyJobModalContent from "../../components/job-single-pages/shared-components/ApplyJobModalContent";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { UserAuth } from "@/context/AuthContext";
import $ from "jquery";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/loader";
import Image from "next/image";

const checkIfApplied = async (student_id, jobId, access) => {
  try {
    await axios.post(
      `${process.env.GLOBAL_API}/job_applied_check/`,
      {
        student_id,
        job_id: jobId,
      },
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return false;
  } catch (error) {
    return true;
  }
};

const JobSingleDynamicV1 = () => {
  const { user, logOut } = UserAuth();
  const access =
    typeof window !== "undefined"
      ? window.localStorage.getItem("access")
      : null;
  const router = useRouter();
  const jobId = router.query.id;
  const student_id =
    typeof window !== "undefined" ? window.localStorage.getItem("id") : null;

  const [jobAppliedCheck, setJobAppliedCheck] = useState(null);
  const [student, setStudent] = useState({});

  const closeModal = () => {
    $(".closed-modal").click();
  };

  const fetchData = async (jobId) => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/job_api/${jobId}/`
    );
    return response.data.data;
  };

  const {
    data: job,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jobdata", jobId],
    queryFn: () => fetchData(jobId),
    enabled: !!jobId, // Ensure jobId is defined before fetching
  });

  console.log(job, "job fetched");

  useEffect(() => {
    if (job && student_id && access) {
      checkIfApplied(student_id, jobId, access).then((result) => {
        setJobAppliedCheck(result);
      });
      setStudent(window.localStorage.getItem("student"));
    }
  }, [job, student_id, jobId, access]);
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>Error fetching job data</h1>;
  }

  const handleClick = (e) => {
    if ((user || access) && student === "false") {
      e.preventDefault();
      toast.warning("You are not a student, access denied.", {
        position: "top-left",
      });
    }
  };

  const createdAtDate = new Date(job?.created_at);
  const localDate = createdAtDate.toLocaleDateString();

  return (
    <>
      <Seo pageTitle="Job Single Dyanmic V1" />

      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="job-detail-section">
        <div className="upper-box">
          <div className="auto-container">
            <div className="job-block-seven">
              <div className="inner-box">
                <div className="d-flex align-items-center">
                  <div className="mx-4">
                    <img
                      src={`${job?.company?.logo}` || "/images/logo.svg"}
                      alt="logo"
                      width={200}
                      height={200}
                    />
                  </div>
                  <div>
                    <h4>{job?.job_title}</h4>
                    <a href={job?.url} target="_blank">
                      <h5 className="mb-3">{job?.company?.name}</h5>
                    </a>

                    <ul className="job-info">
                      <li>
                        <span className="icon flaticon-briefcase"></span>
                        {job?.job_type}
                      </li>
                      {/* compnay info */}
                      <li>
                        <span className="icon flaticon-map-locator"></span>
                        {job?.city?.name}
                      </li>
                      {/* location info */}
                      <li>
                        <span className="icon flaticon-clock-3"></span>
                        {localDate}
                      </li>
                      {/* time info */}
                      <li>
                        <span className="icon flaticon-money"></span>{" "}
                        {job?.min_salary || "null"} $ -{" "}
                        {job?.max_salary || "null"} $
                      </li>
                      {/* salary info */}
                    </ul>
                    {/* End .job-info */}

                    <ul className="job-other-info">
                      {job?.skills_req?.slice(0, 3).map((val, i) => (
                        <li key={i} className={`border`}>
                          {val?.data}
                        </li>
                      ))}
                      {job?.skills_req?.length > 3 ? (
                        // Render this if there are more than 3 items
                        <li className="border">
                          <a
                            data-bs-toggle="modal"
                            data-bs-target="#skillModal"
                          >
                            Show more ...
                          </a>
                        </li>
                      ) : (
                        // Render this if there are 3 or fewer items
                        <></>
                      )}
                    </ul>
                  </div>
                </div>
                {/* End .content */}

                {student !== "false" && !jobAppliedCheck && (
                  <div className="btn-box">
                    <a
                      href="#"
                      className="theme-btn btn-style-one"
                      data-bs-toggle="modal"
                      // data-bs-target="#applyJobModal"
                      data-bs-target={
                        access && student === "true"
                          ? "#applyJobModal"
                          : "#loginPopupModal"
                      }
                      onClick={handleClick}
                    >
                      Apply For Job
                    </a>
                    <button className="bookmark-btn">
                      <i className="flaticon-bookmark"></i>
                    </button>
                  </div>
                )}
                {student === "true" && jobAppliedCheck && (
                  <div className="btn-box">
                    <a href="#" className="btn btn-danger">
                      Already applied
                    </a>
                    {/* <button className="bookmark-btn">
                      <i className="flaticon-bookmark"></i>
                    </button> */}
                  </div>
                )}
                {/* End apply for job btn */}

                {/* <!-- Modal --> */}
                <div
                  className="modal fade"
                  id="applyJobModal"
                  tabIndex="-1"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="apply-modal-content modal-content">
                      <div className="text-center">
                        <h3 className="title">Apply for this job</h3>
                        <button
                          type="button"
                          className="closed-modal"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <ApplyJobModalContent
                          closeModal={closeModal}
                          jobName={job?.job_title}
                        />
                      </div>
                      {/* End modal-header */}

                      {/* End PrivateMessageBox */}
                    </div>
                    {/* End .send-private-message-wrapper */}
                  </div>
                </div>
                <div
                  className="modal fade"
                  id="skillModal"
                  tabIndex="-1"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered ">
                    <div className="apply-modal-content modal-content">
                      <div className="text-center">
                        <h3 className="title">Desired Skills For Job</h3>
                        <button
                          type="button"
                          className="closed-modal"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      {/* End modal-header */}

                      <div className="modal-body">
                        <ul>
                          {job?.skills_req?.map((val, i) => (
                            <li key={i} className="border rounded-2 my-2">
                              <span className="p-3">{val?.data}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {/* End .send-private-message-wrapper */}
                  </div>
                </div>
                {/* End .modal */}
              </div>
            </div>
            {/* <!-- Job Block --> */}
          </div>
        </div>
        {/* <!-- Upper Box --> */}

        <div className="job-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                <JobDetailsDescriptions details={job?.job_des} />
                {/* End jobdetails content */}

                {/* <div className="other-options">
                  <div className="social-share">
                    <h5>Share this job</h5>
                    <SocialTwo />
                  </div>
                </div> */}
                {/* <!-- Other Options --> */}

                {/* <div className="related-jobs">
                    <div className="title-box">
                      <h3>Related Jobs</h3>
                      <div className="text">
                        2020 jobs live - 293 added today.
                      </div>
                    </div>
                    

                    <RelatedJobs />
                  </div> */}
                {/* <!-- Related Jobs --> */}
              </div>
              {/* End .content-column */}

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="sidebar-widget">
                    {/* <!-- Job Overview --> */}
                    <h4 className="widget-title">Job Overview</h4>
                    <JobOverView jobDetails={job} />

                    {/* <!-- Map Widget --> */}
                    {/* <h4 className="widget-title mt-5">Job Location</h4>
                    <div className="widget-content">
                      <div className="map-outer">
                        <div style={{ height: "300px", width: "100%" }}>
                          <MapJobFinder />
                        </div>
                      </div>
                    </div> */}
                    {/* <!--  Map Widget --> */}

                    <h4 className="widget-title mt-4">Job Skills</h4>
                    <div className="widget-content">
                      <JobSkills jobDetails={job} />
                    </div>
                    {/* <!-- Job Skills --> */}
                  </div>
                  {/* End .sidebar-widget */}

                  <div className="sidebar-widget job?.data?.data-widget">
                    <div className="widget-content">
                      <div className="text-center">
                        <div className="">
                          <img
                            src={job?.company?.logo}
                            alt="resource"
                            width={100}
                            height={100}
                          />
                        </div>
                        {/* <a href="#" className="profile-link">
                          View job?.data?.data profile
                        </a> */}
                      </div>
                      {/* End job?.data?.data title */}

                      <CompnayInfo jobDetails={job} />

                      {/* <div className="btn-box">
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="theme-btn btn-style-three"
                        >
                          {job?.link}
                        </a>
                      </div> */}
                      {/* End btn-box */}
                    </div>
                  </div>
                  {/* End .job?.data?.data-widget */}
                </aside>
                {/* End .sidebar */}
              </div>
              {/* End .sidebar-column */}
            </div>
          </div>
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>
      {/* <!-- End Job Detail Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(JobSingleDynamicV1), {
  ssr: false,
});
