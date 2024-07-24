import Link from "next/link";
import blogContent from "../../data/blogs";
import Image from "next/image";

const LeverageAi = () => {
  return (
    <>
      {/* <!-- Content Column --> */}
      <div className="content-column row  py-4">
        <div
          className="leverage-inner-column col-lg-6 col-md-12 col-sm-12"
          // data-aos="fade-left"
        >
          <h2>
            Leverage AI to Find the Perfect
            <br /> Job Match Based on Your Skills
          </h2>
          <h5>
            Leverage AI to Find the Perfect Job Match Based on Your Skills
          </h5>
          <div className="d-flex lg-flex-row justify-content-center justify-content-lg-start">
            <span>1000+ jobs</span>
            <span>Certificate</span>
            <span>Projects & Assignments</span>
          </div>
          <button className="theme-btn btn-style-new ">Get Job</button>
        </div>
        <div className="image-column col-lg-6 col-md-12 col-sm-12">
          <figure
            className="image-box"
            // data-aos="fade-right"
          >
            <Image
              width={384}
              height={468}
              src="/images/resource/jobinternship.png"
              alt="resource"
              className="business-plan-img"
            />
          </figure>
        </div>
      </div>
    </>
  );
};

export default LeverageAi;
