import Link from "next/link";
import blogContent from "../../data/blogs";
import Image from "next/image";

const Discover = () => {
  return (
    <>
      {/* <!-- Content Column --> */}

      <div className="row justify-content-between">
        <div className="image-column col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <figure className="image-box">
            <Image
              width={150}
              height={150}
              src="/images/resource/shape.png"
              alt="resource"
              className="shape-discover"
            />
            <Image
              width={500}
              height={700}
              src="/images/resource/discover.jpg"
              alt="resource"
              className="freelancers-img shadow-lg"
            />
            <div
              className="info_block_discover"
              data-aos="fade-in"
              data-aos-delay="1000"
            >
              <div className="left">
                <img src="/images/resource/about-3.png" alt="image" />
              </div>
              <div className="right">
                <h2 className="title">Success Story</h2>
                <p>
                  Student Success
                  <br /> History
                </p>
              </div>
            </div>
          </figure>
        </div>
        <div className="inner-column col-xl-5 col-lg-5 col-md-12 col-sm-12">
          <h3 className="sec-subtitle">
            <img src="/images/resource/dot.png" />
            Welcome to Education
          </h3>
          <h4 className="sec-title">
            New Experience Learn
            <br /> to the
            <span className="color-pink"> Next Level</span>
            <br /> Your Career
          </h4>
          <div className="py-3">
            <p>
              Architect client-centered total linkage for intuitive benefits.
              Dynamically restore convergence before real-time partnerships
              total linkage for intuitive benefits restore convergence before
              real-time.
            </p>
          </div>
          <ul className="py-4">
            <li>The foundation for a lifetime of success</li>
            <li>Find the right instructor for you</li>
            <li>Popular topics to learn now</li>
          </ul>
          <div className="btm">
            <div className="project-story">
              <div className="left">
                <img src="/images/resource/about-2.png" alt="Image" />
              </div>
              <div className="right">
                <h2 className="title">Mark Anderson</h2>
                <p>Project Manager</p>
              </div>
            </div>
            <button className="theme-btn btn-style-new">
              <span className="">Explore More</span>
              <img src="/images/resource/arrow.png" className="" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Discover;
