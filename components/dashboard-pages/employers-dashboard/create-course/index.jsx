"use client";
import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import MenuToggler from "../../MenuToggler";
import { useSelector } from "react-redux";
import BreadCrumb from "../../BreadCrumb";

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
          <BreadCrumb title="" text="  " />
          <MenuToggler />

          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget w-100 h-100">
                <div class="content-area d-flex align-items-center justify-content-center w-100 h-100">
                  <div>
                    <h3 class="fade-in two">Coming Soon</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default index;
