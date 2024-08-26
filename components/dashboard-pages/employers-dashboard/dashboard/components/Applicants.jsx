import Link from "next/link";
import candidatesData from "../../../../../data/candidates";
import Image from "next/image";
import { useState } from "react";

const Applicants = () => {
  const [activeApplicant, setActiveApplicant] = useState(null);

  const handleApplicantClick = (id) => {
    setActiveApplicant(activeApplicant === id ? null : id);
  };
  return (
    <>
      {candidatesData.slice(17, 23).map((candidate) => (
        <div className="row">
          <div
            className="candidate-block-three col-lg-6 col-md-12 col-sm-12"
            key={candidate.id}
          >
            <div className="inner-box">
              <div
                className="content"
                onClick={() => handleApplicantClick(candidate.id)}
              >
                <figure className="image">
                  <Image
                    width={90}
                    height={90}
                    src={candidate.avatar}
                    alt="candidates"
                  />
                </figure>
                <h4 className="name">
                  <Link href={`/candidates-single-v1/${candidate.id}`}>
                    {candidate.name}
                  </Link>
                </h4>

                <ul className="candidate-info">
                  <li className="designation">{candidate.designation}</li>
                  <li>
                    <span className="icon flaticon-map-locator"></span>{" "}
                    {candidate.location}
                  </li>
                  <li>
                    <span className="icon flaticon-money"></span> $
                    {candidate.hourlyRate} / hour
                  </li>
                </ul>
                {/* End candidate-info */}

                <ul className="post-tags">
                  {candidate.tags.map((val, i) => (
                    <li key={i}>
                      <a href="#">{val}</a>
                    </li>
                  ))}
                </ul>
              </div>
              {/* End content */}

              <div className="option-box">
                <ul className="option-list">
                  <li>
                    <button data-text="View">
                      <span className="la la-eye"></span>
                    </button>
                  </li>
                  <li>
                    <button data-text="Approve">
                      <span className="la la-check"></span>
                    </button>
                  </li>
                  <li>
                    <button data-text="Reject">
                      <span className="la la-times-circle"></span>
                    </button>
                  </li>
                  <li>
                    <button data-text="Delete">
                      <span className="la la-trash"></span>
                    </button>
                  </li>
                  <li>
                    <button
                      data-text="Resume"
                      data-bs-toggle="modal"
                      data-bs-target="#resumeModal"
                    >
                      <span className="la la-paperclip"></span>
                    </button>
                  </li>
                </ul>
              </div>
              {/* End admin options box */}
            </div>
          </div>
          <div className="candidate-block-three col-lg-6 col-md-12 col-sm-12">
            {activeApplicant === candidate.id && (
              <div className="additional-info">
                {/* Add content here that should be displayed when an applicant is clicked */}
                <p>Additional details about {candidate.name}</p>
              </div>
            )}
            <div className="modal fade" id="resumeModal">
              <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
                <div className="modal-content">
                  <button
                    type="button"
                    className="closed-modal"
                    data-bs-dismiss="modal"
                  ></button>
                  {/* End close modal btn */}

                  <div className="modal-body">
                    {/* <!-- Login modal --> */}
                    <div id="login-modal">
                      {/* <!-- Login Form --> */}
                      <div className="login-form default-form">
                        <iframe
                          src={`https://docs.google.com/viewer?url=${`${process.env.GLOBAL_API}/media/resume/ResumeIvanStefanov.pdf`}&embedded=true`}
                          type="application/pdf"
                          width="100%"
                          height="600px"
                        ></iframe>
                      </div>
                      {/* <!--End Login Form --> */}
                    </div>
                    {/* <!-- End Login Module --> */}
                  </div>
                  {/* En modal-body */}
                </div>
                {/* End modal-content */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Applicants;
