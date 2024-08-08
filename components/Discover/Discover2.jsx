import Link from "next/link";
import blogContent from "../../data/blogs";
import Image from "next/image";

const Discover2 = () => {
  return (
    <>
      {/* <!-- Content Column --> */}
      <div className="content-column row col-lg-12 col-md-12 col-sm-12 order-2 d-flex flex-wrap">
        <div className="inner-column col-lg-6 col-md-12 col-sm-12 ">
          <h2>
            Why Choose Us For Your Online <br /> Education Courses
          </h2>
          <p>
            Unlock Your Potential: Talent Search and You offers a streamlined
            approach to discovering your perfect fit in various industries.
          </p>
          <p>
            We offer a brand new approach to the most basic learning paradigms.
            Choose from a wide range of learning options and gain new skills!
            Our school is know.
          </p>
          <ul>
            <li>
              <span className="ti-check">&#10003;</span>
              Get access to <b>12,000+</b>
              of our top courses
            </li>
            <li>
              <span className="ti-check">&#10003;</span>
              Popular topic to learn now in our online courses for student
            </li>
            <li>
              <span className="ti-check">&#10003;</span>
              Find the right instructor for you
            </li>
          </ul>
          <button className="theme-btn btn-style-new d-inline-block mt-4">
            View All courses <i className="ti-arrow-top-right"></i>
          </button>
        </div>
        <div className="image-column d-flex justify-content-center col-lg-6 col-md-12 col-sm-12">
          <figure className="image-box">
            <Image
              width={500}
              height={500}
              src="/images/resource/discover-2.png"
              alt="resource"
              // style={{ width: "500px", height: "500px" }}
              className="business-plan-img shadow"
            />

            <div
              className="info_block_discover-two"
              data-aos="fade-in"
              data-aos-delay="1000"
            >
              <div className="left">
                <span className="icon flaticon-notebook"></span>
              </div>
              <div className="right">
                <h2 className="title">3300 +</h2>
                <p>Online Course</p>
              </div>
            </div>
          </figure>
        </div>
      </div>
    </>
  );
};

export default Discover2;
