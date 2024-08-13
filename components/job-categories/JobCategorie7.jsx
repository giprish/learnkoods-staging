import Link from "next/link";
import jobCatContent from "../../data/job-catergories";

const JobCategorie7 = () => {
  return (
    <>
      <section
        className="job-categories ui-job-categories shadow justify-content-center "
        id="job-categories"
      >
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Find out by popular Categories</h2>
            <p className="mt-4">
              We offer a brand new approach to the most basic learning
              paradigms. Choose from a wide range of
              <br /> learning options and gain new skills! Our school is know.
            </p>
          </div>

          {/* <div className="row custom-row row-1">
              {jobCatContent.slice(0, 4).map((item) => (
                <div
                  className="col-sm-12 col-md-12 col-lg-3 col-xl-3"
                  key={item.id}
                >
                  <Link
                    href="/job-list/job-list-v8"
                    className="icon-item -type-3 "
                  >
                    <div
                      className="icon-wrap"
                      style={{ backgroundColor: `${item?.bgColor}` }}
                    >
                      <div className={`icon ${item.icon}`}></div>
                    </div>
                    <div className="content">
                      <h4>{item.catTitle}</h4>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className="row custom-row row-2">
              {jobCatContent.slice(4, 7).map((item) => (
                <div
                  className="col-sm-12 col-md-12 col-lg-4 col-xl-4"
                  key={item.id}
                >
                  <Link
                    href="/job-list/job-list-v8"
                    className="icon-item -type-3"
                  >
                    <div
                      className="icon-wrap"
                      style={{ backgroundColor: `${item?.bgColor}` }}
                    >
                      <div className={`icon ${item.icon}`}></div>
                    </div>
                    <div className="content">
                      <h4>{item.catTitle}</h4>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className="row custom-row row-3">
              {jobCatContent.slice(7, 9).map((item) => (
                <div
                  className="col-sm-12 col-md-12 col-lg-4 col-xl-6"
                  key={item.id}
                >
                  <Link
                    href="/job-list/job-list-v8"
                    className="icon-item -type-3 "
                  >
                    <div
                      className="icon-wrap"
                      style={{ backgroundColor: `${item?.bgColor}` }}
                    >
                      <div className={`icon ${item.icon}`}></div>
                    </div>
                    <div className="content">
                      <h4>{item.catTitle}</h4>
                    </div>
                  </Link>
                </div>
              ))}
            </div> */}

          <div className="grid-container container-1">
            {jobCatContent.map((item) => (
              <div key={item.id}>
                <Link
                  href="/job-list/job-list-v8"
                  className="icon-item -type-3 "
                >
                  <div
                    className="icon-wrap"
                    style={{ backgroundColor: `${item?.bgColor}` }}
                  >
                    <div className={`icon ${item.icon}`}></div>
                  </div>
                  <div className="content">
                    <h4>{item.catTitle}</h4>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="explore-pill">
          <Link href="/job-list/job-list-v8" className="icon-item -type-3 ">
            <div className="icon-wrap" style={{ backgroundColor: `wheat` }}>
              <div className={`icon flaticon-car`}></div>
            </div>
            <div className="content">
              <h4>Explore All </h4>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default JobCategorie7;
