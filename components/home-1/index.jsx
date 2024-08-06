import Link from "next/link";
import About from "../about/About";
import AppSection from "../app-section/AppSection";
import Blog from "../blog/Blog";
import CallToAction from "../call-to-action/CallToAction";
import LoginPopup from "../common/form/login/LoginPopup";
import FooterDefault from "../footer/common-footer";
import Funfact from "../fun-fact-counter/Funfact";
import DefaulHeader2 from "../header/DefaulHeader2";
import MobileMenu from "../header/MobileMenu";
import Hero1 from "../hero/hero-1";

import Image from "next/image";
import BrowseInternship from "../BrowseInternship/BrowseInternship";

import JobCategorie7 from "../job-categories/JobCategorie7";
import About3 from "../about/About3";

import Blog4 from "../blog/Blog4";
import Discover from "../Discover/Discover";
import Discover2 from "../Discover/Discover2";
import LeverageAi from "../ai/LeverageAi";
import Info from "../info/Info";

const index = () => {
  return (
    <>
      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader2 />
      {/* End Header with upload cv btn */}

      <MobileMenu />
      {/* End MobileMenu */}

      <Hero1 />
      {/* End Hero Section */}
      <section className="about-section">
        <div className="auto-container">
          <div className="row">
            <span className="btn-sol">Our Solution</span>
            <About3 />
          </div>
        </div>
      </section>
      {/* <BrowseInternship /> */}

      <JobCategorie7 />

      {/* <section className="about-section">
        <div className="auto-container">
          <div className="row">
            <About3 />
          </div>
        </div>
      </section> */}

      {/* <!-- End About Section --> */}

      <section className="news-section">
        <div className="auto-container">
          <div
            className="row justify-content-around"
            // data-aos="fade-up"
          >
            <Blog4 />
          </div>
        </div>
      </section>
      <section className="info-section">
        <div className="auto-container">
          <div className="row">
            <Info />
          </div>
        </div>
      </section>
      <section className="discover-section my-4">
        <div className="auto-container">
          <div
            className="row "
            // data-aos="fade-up"
          >
            <Discover />
          </div>
        </div>
      </section>

      <section className="discover-two-section">
        <div className="auto-container">
          <div
            className="row "
            // data-aos="fade-up"
          >
            <Discover2 />
          </div>
        </div>
      </section>

      <section className="leverage-section">
        <div className="auto-container">
          <div
            className="row "
            // data-aos="fade-up"
          >
            <LeverageAi />
          </div>
        </div>
      </section>
      {/* <!-- End News Section --> */}

      {/* <section className="app-section">
        <div className="auto-container">
          <AppSection />
        </div>
      </section> */}
      {/* <!-- End App Section --> */}

      {/* <CallToAction /> */}
      {/* <!-- End Call To Action --> */}

      <FooterDefault />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default index;
