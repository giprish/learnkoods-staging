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

const JobPreviewV1 = () => {
  const job = JSON.parse(window.localStorage.getItem("job_preview"));
  return (
    <>
      <Seo pageTitle="Job Single Dyanmic V1" />

      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      {/* <DefaulHeader /> */}
      {/* <!--End Main Header --> */}

      {/* <MobileMenu /> */}
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="job-detail-section">
        <div className="upper-box">
          <div className="auto-container">
            <div className="job-block-seven">
              <div className="inner-box">
                <div className="content">
                  {/* <span className="job?.data?.data-logo">
                    <img
                      src={`${process.env.GLOBAL_API}${job?.job_image}`}
                      alt="logo"
                    />
                  </span> */}
                  <h4>{job?.job_title}</h4>

                  <ul className="job-info">
                    <li>
                      <span className="icon flaticon-briefcase"></span>
                      {job?.job_type}
                    </li>
                    {/* compnay info */}
                    <li>
                      <span className="icon flaticon-map-locator"></span>
                      {job?.city?.label}
                    </li>
                    {/* location info */}
                    {/* <li>
                      <span className="icon flaticon-clock-3"></span>
                       {localDate} 
                    </li> */}
                    {/* time info */}
                    <li>
                      <span className="icon flaticon-money"></span>{" "}
                      {job?.min_salary}$-
                      {job?.max_salary}$
                    </li>
                    {/* salary info */}
                  </ul>
                  {/* End .job-info */}

                  <ul className="job-other-info">
                    {job?.skills_req?.map((val, i) => (
                      <li key={i} className={`${val?.styleClass}`}>
                        {val?.label}
                      </li>
                    ))}
                  </ul>
                  {/* End .job-other-info */}
                </div>
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

                <div className="other-options">
                  <div className="social-share">
                    <h5>Share this job</h5>
                    <SocialTwo />
                  </div>
                </div>
                {/* <!-- Other Options --> */}

                <div className="related-jobs">
                  <div className="title-box">
                    <h3>Related Jobs</h3>
                    <div className="text">
                      2020 jobs live - 293 added today.
                    </div>
                  </div>
                  {/* End title box */}

                  <RelatedJobs />
                </div>
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
                    <h4 className="widget-title mt-5">Job Location</h4>
                    <div className="widget-content">
                      <div className="map-outer">
                        <div style={{ height: "300px", width: "100%" }}>
                          <MapJobFinder />
                        </div>
                      </div>
                    </div>
                    {/* <!--  Map Widget --> */}

                    <h4 className="widget-title">Job Skills</h4>
                    <div className="widget-content">
                      <JobSkills jobDetails={job} />
                    </div>
                    {/* <!-- Job Skills --> */}
                  </div>
                  {/* End .sidebar-widget */}

                  <div className="sidebar-widget job?.data?.data-widget">
                    <div className="widget-content">
                      <div className="job?.data?.data-title">
                        {/* <div className="job?.data?.data-logo">
                          <img src={job?.logo} alt="resource" />
                        </div> */}
                        <h5 className="data-name">{job?.job_title}</h5>
                        {/* <a href="#" className="profile-link">
                          View job?.data?.data profile
                        </a> */}
                      </div>
                      {/* End job?.data?.data title */}

                      {/* <CompnayInfo jobDetails={job} /> */}

                      <div className="btn-box">
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="theme-btn btn-style-three"
                        >
                          {job?.url}
                        </a>
                      </div>
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

      {/* <FooterDefault footerStyle="alternate5" /> */}
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(JobPreviewV1), {
  ssr: false,
});
