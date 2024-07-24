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
            Find Your Perfect Match, Explore <br /> Opportunities for Talent
            Discovery Search Opportunities.
          </h2>
          <h5>
            Unlock Your Potential: Talent Search and You offers a streamlined
            approach to discovering your perfect fit in various industries.
          </h5>
          <button className="theme-btn btn-style-one d-inline-block">
            Learn More
          </button>
        </div>
        <div className="image-column d-flex justify-content-center col-lg-6 col-md-12 col-sm-12">
          <figure className="image-box">
            <Image
              width={500}
              height={500}
              src="/images/resource/business_plan.webp"
              alt="resource"
              // style={{ width: "500px", height: "500px" }}
              className="business-plan-img shadow"
            />
          </figure>
        </div>
      </div>
    </>
  );
};

export default Discover2;
