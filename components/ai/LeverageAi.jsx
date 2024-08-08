import Link from "next/link";
import blogContent from "../../data/blogs";
import Image from "next/image";

const LeverageAi = () => {
  const testimonials = [
    {
      id: 1,
      content: `“Sam is somebody you need as a steward of your brand. He’s able to craft compelling brand narratives that bring a company’s vision to life We care about safety big time — and so do your site's visitors. With a Shared Hosting account-LMS site..”`,
      name: "Ronal Richards",
      Department: "Development",
      image: "/images/resource/richard.png",
    },
    {
      id: 2,
      content: `“Sam is somebody you need as a steward of your brand. He’s able to craft compelling brand narratives that bring a company’s vision to life We care about safety big time — and so do your site's visitors. With a Shared Hosting account-LMS site..”`,
      name: "Ronal Richards",
      Department: "Development",
      image: "/images/resource/richard-2.png",
    },
  ];
  return (
    <>
      {/* <!-- Content Column --> */}
      <div className="col-lg-12">
        <div className="title-wrapper text-center my-4">
          <h2 className="sec-subtitle ">
            <img src="/images/resource/dot.png" className="mb-1 mx-2" />
            Student feedback
          </h2>
          <h3 className="sec-title">
            Student are says <br />
            EduQuest <span className="b-btm">About Courses</span>
          </h3>
        </div>
        <div className="testimonial_content">
          <div className="swiper testimonial_slider">
            <div className="testimonial_slide">
              <p className="text">
                “Sam is somebody you need as a steward of your brand. He’s able
                to craft compelling brand narratives that bring a company’s
                vision to life We care about safety big time — and so do your
                site's visitors. With a Shared Hosting account-LMS site..”
              </p>
            </div>
            <div className="testimonial_info">
              <img src="/images/resource/richard-2.png" />
              <div className="right">
                <h4 className="name">Ronald Richards</h4>
                <p>Development</p>
              </div>
            </div>
          </div>
          {/* <div className="testimonial_btn">
            <button className="testimonial_btn-rev">
              <i className="la-arrow-right"></i>
            </button>
            <button className="testimonial_btn-next">
              <i className="la-arrow-left"></i>
            </button>
          </div> */}
        </div>
      </div>
      {/* <div className="content-column row  py-4">
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
      </div> */}
    </>
  );
};

export default LeverageAi;
