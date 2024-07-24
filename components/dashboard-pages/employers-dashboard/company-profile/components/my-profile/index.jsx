import FormInfoBox from "./FormInfoBox";
import LogoCoverUploader from "./LogoCoverUploader";

const index = ({ onSubmit, handelImage, company }) => {
  return (
    <div className="widget-content">
      <LogoCoverUploader onSubmit={onSubmit} handelImage={handelImage} />
      {/* End logo and cover photo components */}

      <FormInfoBox onSubmit={onSubmit} company={company} />
      {/* compnay info box */}
    </div>
  );
};

export default index;
