import Link from "next/link";
import blogContent from "../../data/blogs";
import Image from "next/image";

const Discover = () => {
  return (
    <>
      {/* <!-- Content Column --> */}

      <div className="content-column row col-lg-12 col-md-12 col-sm-12 order-2">
        <div className="image-column col-lg-6 col-md-12 col-sm-12">
          <figure className="image-box">
            <Image
              width={500}
              height={500}
              src="/images/resource/Freelancers-at-work.jpg"
              alt="resource"
              className="freelancers-img shadow-lg"
            />
          </figure>
        </div>
        <div className="inner-column col-lg-6 col-md-12 col-sm-12">
          <h2>
            Discover Your Perfect Fit, Talent
            <br /> Search Opportunities.
          </h2>
          <h5>
            Search and connect with the right candidates faster. This talent
            search
            <br /> gives you the opportunity to find candidates who may be a
            perfect fit
            <br /> for your role.
          </h5>
          <button className="theme-btn btn-style-one">Learn More</button>
        </div>
      </div>
    </>
  );
};

export default Discover;
