import FormInfoBox from "./FormInfoBox";
import LogoCoverUploader from "./LogoCoverUploader";

const index = ({ onSubmit, logo, handleLogo, company }) => {
  return (
    <div className="widget-content">
      <LogoCoverUploader />
      {/* End logo and cover photo components */}

      <FormInfoBox
        onSubmit={onSubmit}
        company={company}
        handleLogo={handleLogo}
        logo={logo}
      />
      {/* compnay info box */}
    </div>
  );
};

export default index;
