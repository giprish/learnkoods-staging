import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";

import JobListingsTable from "./components/JobListingsTable";
import MenuToggler from "../../MenuToggler";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const index = () => {
  return (
    <div className="page-wrapper page-wrapper dashboard ">
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
          <BreadCrumb title="Manage jobs!" text="  " />

          <MenuToggler />

          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <JobListingsTable />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    // End page-wrapper
  );
};

export default index;
