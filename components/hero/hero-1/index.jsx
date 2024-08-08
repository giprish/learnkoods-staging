import SearchForm from "../../common/job-search/SearchForm";
import ImageBox from "./ImageBox";
import PopularSearch from "../PopularSearch";
import Link from "next/link";
import Image from "next/image";

const index = () => {
  return (
    <section className="banner-section">
      <div className="auto-container">
        <div className="row">
          <div className="content-column col-lg-8 col-md-12 col-sm-12">
            <div
              className="inner-column"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <Image
                width={50}
                height={50}
                src="/images/resource/star.png"
                alt="hero image"
                className="star"
              />
              <div className="title-box ">
                <h3 className="font-weight-bold">
                  Supercharge Your <br />
                  <span className="red">Career</span> with <br />
                  AI-Powered Upskilling
                </h3>
                <p>
                  Architect client-centered total linkage for intuitive benefits
                  restore
                  <br />
                  convergence before real-time partnerships.
                </p>
              </div>

              <div className="d-flex flex-row">
                <Link href={"/job-list/job-list-v1"}>
                  <button className="theme-btn btn-style-new ">
                    Get a Job
                    <img
                      src="/images/resource/arrow.png"
                      alt=""
                      className="mx-2"
                    />
                  </button>
                </Link>
                <button
                  className="theme-btn btn-style-new-two mx-4 call-modal signup"
                  data-bs-toggle="modal"
                  data-bs-target="#registerModal"
                >
                  Start
                  <img
                    src="/images/resource/arrow.png"
                    alt=""
                    className="mx-2"
                  />
                </button>
              </div>

              {/* <!-- Job Search Form --> */}
              {/* <div className="job-search-form">
                <SearchForm />
              </div> */}
              {/* <!-- Job Search Form --> */}

              {/* <!-- Popular Search --> */}
              {/* <PopularSearch /> */}
              {/* <!-- End Popular Search --> */}
            </div>
          </div>
          {/* End .col */}

          <div className="image-column col-lg-4 col-md-12">
            <ImageBox />
          </div>
        </div>
      </div>
    </section>
  );
};

export default index;
