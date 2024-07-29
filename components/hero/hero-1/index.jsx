import SearchForm from "../../common/job-search/SearchForm";
import ImageBox from "./ImageBox";
import PopularSearch from "../PopularSearch";
import Link from "next/link";

const index = () => {
  return (
    <section className="banner-section ">
      <div className="auto-container">
        <div className="row">
          <div className="content-column col-lg-7 col-md-12 col-sm-12">
            <div
              className="inner-column"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="title-box ">
                <h3 className="font-weight-bold">
                  {/* There Are <span className="colored">93,178</span> Postings
                  Here
                  <br /> For you! */}
                  Unlock the potential of <br />
                  your skills with AI
                </h3>
                <div className="text">
                  Each month, more than 3 million job seekers turn to website in
                  <br />
                  their search for work, making over 40,000 applications every{" "}
                  <br />
                  single day
                </div>
              </div>

              <div className="d-flex flex-row">
                <Link href={"/job-list/job-list-v1"}>
                  <button className="theme-btn btn-style-one">Get a Job</button>
                </Link>
                <button
                  className="theme-btn btn-style-one mx-4 call-modal signup"
                  data-bs-toggle="modal"
                  data-bs-target="#registerModal"
                >
                  Start
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

          <div className="image-column col-lg-5 col-md-12">
            <ImageBox />
          </div>
        </div>
      </div>
    </section>
  );
};

export default index;
