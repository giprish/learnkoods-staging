import MobileMenu from "../../../header/MobileMenu";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import MenuToggler from "../../MenuToggler";
import Image from "next/image";
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
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardCandidatesHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardCandidatesSidebar />
      {/* <!-- End Candidates Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="AI based Skill Assessment!" />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row">
            <div className="col-lg-12">
              {/* <!-- Ls widget --> */}
              <div className="ls-widget w-100 h-100">
                <div class="content-area d-flex align-items-center justify-content-center w-100 h-100">
                  <div>
                    <h3 class="fade-in two">Coming Soon</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End dashboard-outer */}
      </section>
      {/* <!-- End Dashboard --> */}
      {/* <!-- End Copyright --> */}
    </div>
    // End page-wrapper
  );
};

export default index;
