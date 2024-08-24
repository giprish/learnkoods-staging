import Image from "next/image";
import { useState } from "react";

const LogoCoverUploader = ({ handleImage, handleCover, image, cover }) => {
  console.log(image, "image in company logo uploader");
  //
  return (
    <>
      <div className="row justify-content-around">
        {/* <div className="col-lg-6 col-sm-12 mb-4">
          {image ? (
            <div className="d-flex flex-column uploadButton justify-content-center align-items-center">
              {image.url !== null && image?.url.length > 2 && !image.file && (
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
                  onChange={(e) => {
                    handleImage(e);
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
                onChange={(e) => {
                  handleImage(e);
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
               
              </span>
            </div>
          )}

          <div className="text text-center">Max file size is 1MB</div>
        </div> */}
      </div>
    </>
  );
};

export default LogoCoverUploader;
