import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import ProfileChart from "./components/ProfileChart";
import Notification from "./components/Notification";
import JobApplied from "./components/JobApplied";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";
import ProfileBlock from "./components/ProfileBlock";
import AssessmentBlock from "./components/AssessmentBlock";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Index = () => {
  const { shortSidebar: isSidebarCollapsed } = useSelector(
    (state) => state.toggle
  );
  const [username, setUserName] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserName(localStorage.getItem("user"));
    }
  }, []);
  return (
    <div
      className={`page-wrapper dashboard ${
        isSidebarCollapsed ? "dashboard-collapsed" : ""
      }`}
    >
      <span className="header-span"></span>
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardCandidatesHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardCandidatesSidebar />
      {/* <!-- End Candidates    Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title={`Howdy, ${username}!!`} />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row d-flex mb-4">
            <div className="col-xl-4 col-lg-4 ">
              {/* <!-- Graph widget --> */}
              <div className="skill-widget ls-widget flex-grow-1">
                <div className="widget-title-skill">
                  <h4>Skills</h4>
                </div>
                <div className="widget-content "></div>
                <ProfileBlock />
              </div>
              {/* End profile chart */}
            </div>
            {/* End .col */}

            <div className="col-xl-8 col-lg-8">
              {/* <!-- Notification Widget --> */}
              <div className="assessment-widget ls-widget flex-grow-1">
                <div className="widget-title-skill">
                  <h4>Assessment</h4>
                </div>
                <div className="widget-content">
                  <AssessmentBlock />
                </div>
              </div>
            </div>
          </div>

          {/* End .row top card block */}

          <div className="row">
            <div className="col-xl-7 col-lg-12">
              {/* <!-- Graph widget --> */}
              <div className="graph-widget ls-widget">
                <ProfileChart />
              </div>
              {/* End profile chart */}
            </div>
            {/* End .col */}

            <div className="col-xl-5 col-lg-12">
              {/* <!-- Notification Widget --> */}
              <div className="notification-widget ls-widget">
                <div className="widget-title">
                  <h4>Notifications</h4>
                </div>
                <div className="widget-content">
                  <Notification />
                </div>
              </div>
            </div>
            {/* End .col */}

            <div className="col-lg-12">
              {/* <!-- applicants Widget --> */}
              <div className="applicants-widget ls-widget">
                <div className="widget-title">
                  <h4>Jobs Applied Recently</h4>
                </div>
                <div className="widget-content">
                  <div className="row">
                    {/* <!-- Candidate block three --> */}

                    <JobApplied />
                  </div>
                </div>
              </div>
            </div>

            {/* End .col */}
          </div>
          {/* End .row profile and notificatins */}
        </div>
        {/* End dashboard-outer */}
      </section>
      {/* <!-- End Dashboard --> */}

      {/* <!-- End Copyright --> */}
    </div>
    // End page-wrapper
  );
};

export default Index;
