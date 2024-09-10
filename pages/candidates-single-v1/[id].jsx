import dynamic from "next/dynamic";
import candidates from "../../data/candidates";
import candidateResume from "../../data/candidateResume";
import LoginPopup from "../../components/common/form/login/LoginPopup";
import FooterDefault from "../../components/footer/common-footer";
import DefaulHeader from "../../components/header/DefaulHeader";
import MobileMenu from "../../components/header/MobileMenu";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Seo from "../../components/common/Seo";
import Contact from "../../components/candidates-single-pages/shared-components/Contact";
import GalleryBox from "../../components/candidates-single-pages/shared-components/GalleryBox";
import Social from "../../components/candidates-single-pages/social/Social";
import JobSkills from "../../components/candidates-single-pages/shared-components/JobSkills";
import AboutVideo from "../../components/candidates-single-pages/shared-components/AboutVideo";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const CandidateSingleDynamicV1 = () => {
  const router = useRouter();
  const id = router.query.id;

  const [access, setAccess] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccess(window.localStorage.getItem("access"));
    }
  }, []);

  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/single-profile/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { data: candidate } = useQuery({
    queryKey: ["user", access, id],
    queryFn: () => fetchData(),
  });

  console.log(candidate, "fetched from api");

  return (
    <>
      <Seo pageTitle="Candidate Single Dyanmic V1" />

      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="candidate-detail-section">
        <div className="upper-box">
          <div className="auto-container">
            <div className="candidate-block-five">
              <div className="inner-box">
                <div className="content">
                  <figure className="image">
                    <img src={candidate?.data?.profile_image} alt="avatar" />
                  </figure>
                  <h4 className="name">{candidate?.user?.username}</h4>

                  <ul className="candidate-info">
                    <li className="designation">
                      {candidate?.user?.designation}
                    </li>
                    <li>
                      <span className="icon flaticon-map-locator"></span>
                      {candidate?.data?.city?.name || "null"}
                    </li>
                    <li>
                      <span className="icon flaticon-money"></span> $
                      {candidate?.data?.hourlyRate || "null"} / hour
                    </li>
                    <li>
                      <span className="icon flaticon-clock"></span> Member
                      Since,Aug 19, 2020
                    </li>
                  </ul>

                  <ul className="post-tags">
                    {candidate?.data?.skills?.map((val, i) => (
                      <li key={i}>{val.data}</li>
                    ))}
                  </ul>
                </div>

                <div className="btn-box">
                  <a
                    className="theme-btn btn-style-one"
                    href={candidate?.data?.resume}
                    download
                  >
                    Download CV
                  </a>
                  {/* <button className="bookmark-btn">
                    <i className="flaticon-bookmark"></i>
                  </button> */}
                </div>
              </div>
            </div>
            {/*  <!-- Candidate block Five --> */}
          </div>
        </div>
        {/* <!-- Upper Box --> */}

        <div className="candidate-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                <div className="job-detail">
                  <div className="video-outer">
                    <h4>Candidates About</h4>
                    {candidate?.data?.profile_desc}
                    {/* <AboutVideo /> */}
                  </div>
                  {/* <!-- About Video Box --> */}

                  {/* <!-- Portfolio --> */}
                  {/* <div className="portfolio-outer">
                    <div className="row">
                      <GalleryBox />
                    </div>
                  </div> */}

                  {/* <!-- Candidate Resume Start --> */}

                  <div className={`resume-outer `}>
                    <div className="upper-title">
                      <h4>Education</h4>
                    </div>

                    {candidate?.education?.map((education) => {
                      // Convert start_date and end_date to year
                      const startYear = new Date(
                        education.start_date
                      ).getFullYear();
                      const endYear = education.end_date
                        ? new Date(education.end_date).getFullYear()
                        : "";

                      return (
                        <div className="resume-block" key={education.id}>
                          <div className="inner">
                            <span className="name">{education?.id}</span>
                            <div className="title-box">
                              <div className="info-box">
                                <h3>{education.degree}</h3>
                                <span>{education.institution_name}</span>
                              </div>
                              <div className="edit-box">
                                <span className="year">
                                  {startYear}-{endYear}
                                </span>
                              </div>
                            </div>
                            <div className="text">{education.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className={`resume-outer theme-blue`}>
                    <div className="upper-title">
                      <h4>Experience</h4>
                    </div>

                    {candidate?.experience?.map((experience, index) => {
                      // Convert start_date and end_date to year
                      const startYear = new Date(
                        experience.start_date
                      ).getFullYear();
                      const endYear = experience.end_date
                        ? new Date(experience.end_date).getFullYear()
                        : "";

                      return (
                        <div className="resume-block" key={experience.id}>
                          <div className="inner">
                            <span className="name">{index}</span>
                            <div className="title-box">
                              <div className="info-box">
                                <h3>{experience?.company_name}</h3>
                                <span>{experience?.title}</span>
                              </div>
                              <div className="edit-box">
                                <span className="year">
                                  {startYear}-{endYear || "current"}
                                </span>
                              </div>
                            </div>
                            <div className="text">
                              {experience?.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* <!-- Candidate Resume End --> */}
                </div>
              </div>
              {/* End .content-column */}

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="sidebar-widget">
                    <div className="widget-content">
                      <ul className="job-overview">
                        <li>
                          <i className="icon icon-calendar"></i>
                          <h5>Experience:</h5>
                          <span>
                            {candidate?.data?.experience_level || "null"} Years
                          </span>
                        </li>

                        <li>
                          <i className="icon icon-expiry"></i>
                          <h5>Age:</h5>
                          <span>{candidate?.data?.age || "null"} Years</span>
                        </li>

                        <li>
                          <i className="icon icon-rate"></i>
                          <h5>Current Salary:</h5>
                          <span>
                            {candidate?.data?.current_salary || "null"}
                          </span>
                        </li>

                        <li>
                          <i className="icon icon-salary"></i>
                          <h5>Expected Salary:</h5>
                          <span>
                            {candidate?.data?.expected_salary || "null"}
                          </span>
                        </li>

                        <li>
                          <i className="icon icon-user-2"></i>
                          <h5>Gender:</h5>
                          <span>{candidate?.data?.gender || "null"}</span>
                        </li>

                        <li>
                          <i className="icon icon-language"></i>
                          <h5>Language:</h5>
                          <span>{candidate?.data?.languages || "null"}</span>
                        </li>

                        <li>
                          <i className="icon icon-degree"></i>
                          <h5>Education Level:</h5>
                          <span>
                            {candidate?.data?.education_level || "null"}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* End .sidebar-widget conadidate overview */}

                  {/* <div className="sidebar-widget social-media-widget">
                    <h4 className="widget-title">Social media</h4>
                    <div className="widget-content">
                      <div className="social-links">
                        <Social />
                      </div>
                    </div>
                  </div> */}
                  {/* End .sidebar-widget social-media-widget */}

                  <div className="sidebar-widget">
                    <h4 className="widget-title">Professional Skills</h4>
                    <div className="widget-content">
                      <ul className="job-skills">
                        <JobSkills skills={candidate?.data?.skills} />
                      </ul>
                    </div>
                  </div>
                  {/* End .sidebar-widget skill widget */}

                  {/* <div className="sidebar-widget contact-widget">
                    <h4 className="widget-title">Contact Us</h4>
                    <div className="widget-content">
                      <div className="default-form">
                        <Contact />
                      </div>
                    </div>
                  </div> */}
                  {/* End .sidebar-widget contact-widget */}
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

export default dynamic(() => Promise.resolve(CandidateSingleDynamicV1), {
  ssr: false,
});
