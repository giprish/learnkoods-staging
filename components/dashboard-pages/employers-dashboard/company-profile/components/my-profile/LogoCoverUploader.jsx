import Image from "next/image";
import { useState } from "react";

const LogoCoverUploader = ({ handleImage, handleCover, image, cover }) => {
  console.log(image, "image in company logo uploader");
  // console.log(cover, "cover in company logo uploader");
  return (
    <>
      {/* <div className="uploading-outer">
        <div className="uploadButton">
          <input
            className="uploadButton-input"
            type="file"
            name="attachments[]"
            accept="image/*"
            id="upload"
            required
            // onChange={(e) => logoHandler(e.target.files[0])}
            onChange={handleImage}
          />
          <label className="uploadButton-button ripple-effect" htmlFor="upload">
            {logoImg !== "" ? logoImg?.name : " Browse Logo"}
          </label>
          <span className="uploadButton-file-name"></span>
        </div>
        <div className="text">
          Max file size is 1MB, Minimum dimension: 330x300 And Suitable files
          are .jpg & .png
        </div>
      </div>

      <div className="uploading-outer">
        <div className="uploadButton">
          <input
            className="uploadButton-input"
            type="file"
            name="attachments[]"
            accept="image/*, application/pdf"
            id="upload_cover"
            onChange={(e) => coverHandler(e.target.files[0])}
          />
          <label
            className="uploadButton-button ripple-effect"
            htmlFor="upload_cover"
          >
            {converImg !== "" ? converImg?.name : "Browse Cover"}
          </label>
          <span className="uploadButton-file-name"></span>
        </div>
        <div className="text">
          Max file size is 1MB, Minimum dimension: 330x300 And Suitable files
          are .jpg & .png
        </div>
      </div> */}
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
                {/* <img src={logImg} width={200} height={200} /> */}
              </span>
            </div>
          )}

          <div className="text text-center">
            Max file size is 1MB, Suitable files are .jpg & .png
          </div>
        </div>
        {/* <div className="col-lg-6 col-sm-12 mb-4">
          {cover ? (
            <div className="d-flex flex-column uploadButton justify-content-center align-items-center">
              {cover.url.length > 2 && !cover.file && (
                <Image
                  src={`${cover?.url}`}
                  width={150}
                  height={150}
                  alt="cover image"
                />
              )}
              {cover.file && (
                <img
                  src={URL.createObjectURL(cover.file)}
                  alt="cover_preview"
                  width="150"
                  height="150"
                  className="uploadedImage"
                />
              )}
              <div className="uploadButton">
                <input
                  className="uploadButton-input"
                  type="file"
                  name="cover_image"
                  accept="image/*"
                  id="upload_cover"
                  onChange={(e) => {
                    handleCover(e);
                  }}
                />

                <label
                  htmlFor="upload_cover"
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
                name="cover_image"
                accept="image/*"
                id="upload_cover"
                onChange={(e) => {
                  handleCover(e);
                }}
              />

              <label
                className="uploadButton-button ripple-effect"
                htmlFor="upload_cover"
              >
                {cover.url ? (
                  <i className="la la-camera"></i>
                ) : (
                  cover.file.name || "Browse profile cover"
                )}
              </label>
              <span className="uploadButton-file-name">
                
              </span>
            </div>
          )}

          <div className="text text-center">
            Max file size is 1MB, Suitable files are .jpg & .png
          </div>
        </div> */}
      </div>
    </>
  );
};

export default LogoCoverUploader;
