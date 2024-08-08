import { useState } from "react";

const RegisterLogoCoverUploader = ({
  handelCover,
  handelLogo,
  cover,
  logo,
}) => {
  return (
    <>
      <div className="uploading-outer-profile">
        <div>
          {logo ? (
            <div className="d-flex flex-column uploadButton justify-content-center align-items-center">
              {logo.url.length > 2 && !logo.file && (
                <Image
                  src={`${process.env.GLOBAL_API}${logo?.url}`}
                  width={150}
                  height={150}
                  alt="profile image"
                />
              )}
              {logo.file && (
                <img
                  src={URL.createObjectURL(logo.file)}
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
                    handelLogo(e);
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
                  handelLogo(e);
                }}
              />

              <label
                className="uploadButton-button ripple-effect"
                htmlFor="upload"
              >
                {logo.url ? (
                  <i className="la la-camera"></i>
                ) : (
                  logo.file.name || "Browse profile image"
                )}
              </label>
              <span className="uploadButton-file-name">
                {/* <img src={logImg} width={200} height={200} /> */}
              </span>
            </div>
          )}
          <div className="text">
            Max file size is 1MB, Suitable files are .jpg & .png
          </div>
        </div>
        {/* <div>
          Upload Cover
          {cover ? (
            <div className="d-flex flex-column uploadButton justify-content-center align-items-center">
              {cover.url.length > 2 && !cover.file && (
                <Image
                  src={`${process.env.GLOBAL_API}${cover?.url}`}
                  width={150}
                  height={150}
                  alt="profile image"
                />
              )}
              {cover.file && (
                <img
                  src={URL.createObjectURL(cover.file)}
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
                    handelCover(e);
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
                  handelCover(e);
                }}
              />

              <label
                className="uploadButton-button ripple-effect"
                htmlFor="upload"
              >
                {cover.url ? (
                  <i className="la la-camera"></i>
                ) : (
                  cover.file.name || "Browse profile image"
                )}
              </label>
              <span className="uploadButton-file-name">
               
              </span>
            </div>
          )}
          <div className="text">
            Max file size is 1MB, Suitable files are .jpg & .png
          </div>
        </div> */}
      </div>
    </>
  );
};

export default RegisterLogoCoverUploader;
