const index = () => {
  return (
    <section className="browse-internships  " id="browse-internships">
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-lg-6 col-md-12 search-container">
            <h1 className="text-primary">Browse Job / Internship</h1>
            <h2 className="font-weight-bold">That's Right For You!</h2>
            <p className="mb-4">
              Find a role that fits your career aspirations.
            </p>
            <div className="search-box mt-2 p-3 shadow">
              <div className="searchbox-wrap my-4 shadow">
                <i class="fa fa-search glass"></i>
                <input type="text" />
                <button>
                  <span>Find Job</span>
                </button>
              </div>
              <div className="d-flex flex-row justify-content-around my-3 flex-wrap job-button-div">
                <button className="job-button">
                  <i className="la la-couch"></i>WFH
                </button>
                <button className="job-button">
                  <i className="la la-building"></i>On-Field
                </button>
                <button className="job-button">
                  <i className="la la-hourglass-half"></i>Full-Time
                </button>
                <button className="job-button">
                  <i className="la la-hourglass"></i>Part-Time
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 shadow top-jobs">
            <div className="d-flex flex-row justify-content-between image-container">
              <h4 className="heading">Jobs</h4>
              <img
                src="/images/resource/Group 22.png"
                width={70}
                height={50}
                alt="image"
              />
            </div>
            <div className="job-listing ">
              <ul className="list-group list-group-flush">
                <li className="job-pill my-1 mt-4">
                  <div className="mx-4 my-1">
                    <h5 className="category-text">Web Developer</h5>
                    <span className="job-title">Software Development</span>
                  </div>
                </li>
                <li className="job-pill my-1">
                  <div className="mx-4 my-1">
                    <h5 className="category-text">Data Science</h5>
                    <span className="job-title">Computer Science</span>
                  </div>
                </li>
                <li className="job-pill my-1">
                  <div className="mx-4 my-1">
                    <h5 className="category-text">Digital Marketing</h5>
                    <span className="job-title">Marketing</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default index;
