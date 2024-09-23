"use client";

import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";
import MenuToggler from "../../MenuToggler";
import CompanyListingsTable from "./components/CompanyListingsTable";
import { useSelector } from "react-redux";

const index = () => {
  const { shortSidebar: isSidebarCollapsed } = useSelector(
    (state) => state.toggle
  );
  return (
    <div
      className={`page-wrapper dashboard ${
        isSidebarCollapsed ? "dashboard-collapsed" : ""
      }`}
    >
      <span className="header-span"></span>

      <LoginPopup />

      <DashboardHeader />

      <MobileMenu />

      <DashboardEmployerSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Manage Your Companies!" text="  " />

          <MenuToggler />

          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <CompanyListingsTable />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default index;
