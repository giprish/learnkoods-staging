import Link from "next/link";
import ApplicantsList from "./ApplicantsList";
import Image from "next/image";
import { useState } from "react";

const About3 = () => {
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleItem = (index) => {
    setExpandedItems((prevExpandedItems) => {
      if (prevExpandedItems.includes(index)) {
        // If the item is already expanded, collapse it by removing the index
        return [];
      } else {
        // Collapse all other items and expand the clicked item
        return [index];
      }
    });
  };

  const items = [
    "Maximize Productivity",
    "Uncover your skills gaps",
    "Launch personalized learning pathways",
    "On demand coaching",
  ];
  return (
    <>
      {/* <!-- Content Column --> */}
      <h4 className="about-heading">
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
          // data-aos="fade-left"
        >
          <ul className="">
            {items.map((item, index) => (
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
      </div>
      {/* <div className="row">
        <div className="card col-lg-3 col-md-3 col-sm-12">card 1</div>
        <div className="card col-lg-3 col-md-3 col-sm-12">CARD 2</div>
        <div className="card col-lg-3 col-md-3 col-sm-12">card 3</div>
      </div> */}
    </>
  );
};

export default About3;
