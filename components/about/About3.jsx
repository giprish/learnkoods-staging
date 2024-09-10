import Link from "next/link";
import ApplicantsList from "./ApplicantsList";
import Image from "next/image";
import { useState } from "react";

const About3 = () => {
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleItem = (index) => {
    setExpandedItem((prevExpandedItem) => {
      if (prevExpandedItem === index) {
        // Keep the item expanded if it's the only one expanded
        return prevExpandedItem;
      } else {
        // Collapse all other items and expand the clicked item
        return index;
      }
    });
  };

  const items = [
    {
      title: "Uncover your skills gaps",
      content:
        "Get an AI-powered assessment of your business goals and employee skills to diagnose the challenge.",
      border: "border-bottom",
      image: "/images/resource/about-ai.webp",
    },
    {
      title: "Launch personalized learning pathways",
      content:
        "Teams receive learning pathways aligned to your business needs. Continuous workforce transformation, at scale.",
      border: "border-bottom",
      image: "/images/resource/about-business.webp",
    },
    {
      title: "On demand coaching",
      content:
        "Instant, 1:1 support, whenever your learners need it. Powered by our team of in-house coaches, and supported by AI.",
      image: "/images/resource/about-coaching.webp",
    },
  ];
  const currentImage =
    expandedItem !== null
      ? items[expandedItem].image
      : "/images/resource/about-ai.webp";

  return (
    <>
      <h2 className="about-heading">The AI-powered Multiverse platform.</h2>
      <span className="text mb-4">
        Learning that's led by people, powered by data and supercharged by AI.
      </span>
      <div className="content-column col-lg-12 col-md-12 col-sm-12 order-2 justify-content-around mt-4">
        <div className="inner-column col-lg-5 col-md-12 col-sm-12 border rounded-4 p-4">
          <ul>
            {items?.map((item, index) => (
              <li key={index} className={`${item.border}`}>
                <div className="d-flex flex-row px-3 py-3 justify-content-between">
                  <span className="service-title">{item.title}</span>
                  <button onClick={() => toggleItem(index)}>
                    <i
                      className={`las ${
                        expandedItem === index ? "la-angle-up" : "la-angle-down"
                      }`}
                    ></i>
                  </button>
                </div>
                {expandedItem === index && (
                  <p className="service-details">{item.content}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="image-column col-lg-5 col-md-12 col-sm-12">
          <figure className="image-box">
            <Image
              width={500}
              height={500}
              src={currentImage}
              alt="resource"
              className="about3-img shadow-lg"
            />
          </figure>
        </div>
      </div>
      {/* <h4 className="about-heading">
        The AI-powered Multiverse platform Lorem ipsum dolor sit amet
        consectetur adip dolor sit amet
      </h4>
      <span className="text mb-4">
        Learning that's led by people, powered by data and supercharged by AI.
      </span>
      <div className="content-column col-lg-12 col-md-12 col-sm-12 order-2">
        <div className="image-column col-lg-6 col-md-12 col-sm-12">
          <figure
            className="image-box"
            // data-aos="fade-right"
          >
            <Image
              width={500}
              height={500}
              src="/images/resource/discussion2.jpg"
              alt="resource"
              className="about3-img shadow-lg"
            />
          </figure>
        </div>
        <div
          className="inner-column col-lg-6 col-md-12 col-sm-12"
          
        >
          <ul className="">
            {items?.map((item, index) => (
              <li key={index} className="mb-3 border shadow rounded-3">
                <div className="d-flex flex-row px-3 py-3 justify-content-between">
                  <span className="service-title">{item}</span>
                  <button onClick={() => toggleItem(index)}>
                    <i
                      className={`las ${
                        expandedItems.includes(index)
                          ? "la-angle-up"
                          : "la-angle-down"
                      }`}
                    ></i>
                  </button>
                </div>
                {expandedItems.includes(index) && (
                  <p className="service-details">Details about {item}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div> */}
    </>
  );
};

export default About3;
