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

const UpdateProfileDynamicV1 = () => {
  const router = useRouter();
  const userId = router.query.id;
  const [accessToken, setAccessToken] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const access = window.localStorage.getItem("access");
    const id = window.localStorage.getItem("id");
    console.log({ access, id }, "access and id");
    setAccessToken(access);
    setId(id);
  }, []);

  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/usr_pro_id/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  const {
    data: user,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["data", userId],
    queryFn: () => fetchData(),
  });

  console.log(user, "user");
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
        <div className="container">
          <div className=" text-center mt-5 ">
            <h1>Bootstrap Contact Form</h1>
          </div>

          <div className="row ">
            <div className="col-lg-7 mx-auto">
              <div className="card mt-2 mx-auto p-4 bg-light">
                <div className="card-body bg-light">
                  <div className="container">
                    <form id="contact-form" role="form">
                      <div className="controls">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label for="form_name">Firstname</label>
                              <input
                                id="form_name"
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Please enter your firstname *"
                                data-error="Firstname is required."
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label for="form_lastname">Lastname *</label>
                              <input
                                id="form_lastname"
                                type="text"
                                name="surname"
                                className="form-control"
                                placeholder="Please enter your lastname *"
                                data-error="Lastname is required."
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label for="form_email">Email *</label>
                              <input
                                id="form_email"
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Please enter your email *"
                                required="required"
                                data-error="Valid email is required."
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label for="form_need">
                                Please specify your need *
                              </label>
                              <select
                                id="form_need"
                                name="need"
                                className="form-control"
                                required="required"
                                data-error="Please specify your need."
                              >
                                <option value="" selected disabled>
                                  --Select Your Issue--
                                </option>
                                <option>Request Invoice for order</option>
                                <option>Request order status</option>
                                <option>Haven't received cashback yet</option>
                                <option>Other</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label for="form_message">Message *</label>
                              <textarea
                                id="form_message"
                                name="message"
                                className="form-control"
                                placeholder="Write your message here."
                                rows="4"
                                required="required"
                                data-error="Please, leave us a message."
                              ></textarea>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <input
                              type="submit"
                              className="btn btn-success btn-send  pt-2 btn-block
                            "
                              value="Send Message"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- End Job Detail Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(UpdateProfileDynamicV1), {
  ssr: false,
});
