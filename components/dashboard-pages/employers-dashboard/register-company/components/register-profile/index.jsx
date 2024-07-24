import RegisterFormInfoBox from "./RegisterFormInfobox";
import RegisterLogoCoverUploader from "./RegisterLogoCoverUploader";

const index = ({ onSubmit, handelLogo, handleCover, cover, logo }) => {
  return (
    <div className="widget-content">
      <RegisterLogoCoverUploader
        onSubmit={onSubmit}
        handelLogo={handelLogo}
        handleCover={handleCover}
        cover={cover}
        logo={logo}
      />
      {/* End logo and cover photo components */}

      <RegisterFormInfoBox onSubmit={onSubmit} />
      {/* compnay info box */}
    </div>
  );
};

export default index;
