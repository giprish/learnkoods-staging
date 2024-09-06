import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";
import TopCardBlock from "./components/TopCardBlock";
import ProfileChart from "./components/ProfileChart";
import CompletionChart from "./components/CompletionChart";
import Notification from "./components/Notification";
import Progress from "./components/Progress";
import Applicants from "./components/Applicants";

import MenuToggler from "../../MenuToggler";
import ManageProject from "./components/ManageProject";
import { useSelector } from "react-redux";

const Index = () => {
  const { shortSidebar: isSidebarCollapsed } = useSelector(
    (state) => state.toggle
  );
  console.log(isSidebarCollapsed);
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

      <DashboardHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardEmployerSidebar />
      {/* <!-- End User Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Your Dashboard!" text="  " />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row mb-4">
            <div className="col-xl-6 col-sm-12 manage-widget">
              <ManageProject />
            </div>
            <div className="col-xl-6 col-sm-12 pt-4">
              <div className="row">
                <TopCardBlock />
              </div>
            </div>
          </div>
          {/* End .row top card block */}

          <div className="row">
            <div className="col-xl-6 col-lg-12">
              {/* <!-- Graph widget --> */}
              <div className="graph-widget ls-widget">
                <CompletionChart />
              </div>
              {/* End profile chart */}
              {/* <!-- Graph widget --> */}
              <div className="graph-widget ls-widget">
                <ProfileChart />
              </div>
              {/* End profile chart */}
            </div>

            {/* End .col */}

            <div className="col-xl-6 col-lg-12">
              <div className="notification-widget ls-widget">
                <div className="widget-title">
                  <h4>Progress</h4>
                </div>
                <div className="widget-content">
                  <Progress />
                </div>
              </div>
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
                  <h4>Recent Applicants</h4>
                </div>
                <div className="widget-content">
                  <div className=" flex-cloumn">
                    {/* <!-- Candidate block three --> */}

                    <Applicants />
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
