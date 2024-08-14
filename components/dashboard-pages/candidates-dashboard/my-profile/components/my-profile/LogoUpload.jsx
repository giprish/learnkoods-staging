import Image from "next/image";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const LogoUpload = ({ handelImage, handelResume, image, resume }) => {
  return (
    <>
      <div className="row justify-content-around">
        <div className="col-lg-6 col-sm-12 mb-4">
          {image ? (
            <div className="d-flex flex-column uploadButton justify-content-center align-items-center">
              {image?.url.length > 2 && !image.file && (
                <Image
                  src={`${image?.url}`}
                  width={150}
                  height={150}
                  alt="profile image"
                />
              )}
              {image.file && (
                <img
                  src={URL.createObjectURL(image.file)}
                  alt="preview"
                  width="150"
                  height="150"
                  className="uploadedImage"
                />
              )}
              <div className="uploadButton">
                <input
                  className="uploadButton-input"
                  type="file"
                  name="profile_image"
                  accept="image/*"
                  id="upload"
                  required
                  onChange={(e) => {
                    handelImage(e);
                  }}
                />

                <label
                  htmlFor="upload"
                  className="uploadButton-button-image ripple-effect p-2"
                >
                  <i className="la la-camera"></i>
                </label>
              </div>
            </div>
          ) : (
            <div className="uploadButton">
              <input
                className="uploadButton-input"
                type="file"
                name="profile_image"
                accept="image/*"
                id="upload"
                required
                onChange={(e) => {
                  handelImage(e);
                }}
              />

              <label
                className="uploadButton-button ripple-effect"
                htmlFor="upload"
              >
                {image.url ? (
                  <i className="la la-camera"></i>
                ) : (
                  image.file.name || "Browse profile image"
                )}
              </label>
              <span className="uploadButton-file-name">
                {/* <img src={logImg} width={200} height={200} /> */}
              </span>
            </div>
          )}

          <div className="text text-center">
            Max file size is 1MB, Suitable files are .jpg & .png
          </div>
        </div>
        <div className="col-lg-6 col-sm-12">
          {resume ? (
            <>
              <div className="uploadButton d-flex flex-column align-items-center">
                <input
                  className="uploadButton-input"
                  type="file"
                  name="resume"
                  accept=".docx,.pdf"
                  id="uploadResume"
                  required
                  onChange={(e) => {
                    handelResume(e);
                  }}
                />

                <label
                  className="uploadButton-button ripple-effect"
                  htmlFor="uploadResume"
                >
                  {resume.file ? `${resume.file.name}` : "Browse resume"}
                </label>
                <span className="uploadButton-file-name">
                  {/* <img src={logImg} width={200} height={200} /> */}
                </span>
                <button
                  data-text="Resume"
                  data-bs-toggle="modal"
                  data-bs-target="#resumeModal"
                  className=" border rounded-4 p-2 theme-btn btn-style-one"
                >
                  <span className="la la-paperclip">
                    Preview current resume
                  </span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="uploadButton">
                <input
                  className="uploadButton-input"
                  type="file"
                  name="resume"
                  accept=".docx,.pdf"
                  id="uploadResume"
                  required
                  onChange={(e) => {
                    handelResume(e);
                  }}
                />

                <label
                  className="uploadButton-button ripple-effect"
                  htmlFor="uploadResume"
                >
                  {"Upload your resume"}
                </label>
                <span className="uploadButton-file-name">
                  {/* <img src={logImg} width={200} height={200} /> */}
                </span>
              </div>
            </>
          )}

          <div className="text text-center">
            Max file size is 3MB, Suitable files are .docx & .pdf
          </div>
        </div>
      </div>
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
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                      `${resume.url}`
                    )}&embedded=true`}
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
    </>
  );
};

export default LogoUpload;
