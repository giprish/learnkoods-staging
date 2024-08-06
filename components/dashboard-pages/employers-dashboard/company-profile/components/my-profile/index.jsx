import FormInfoBox from "./FormInfoBox";
import LogoCoverUploader from "./LogoCoverUploader";

const index = ({
  onSubmit,
  handleCover,
  handleImage,
  image,
  cover,
  company,
}) => {
  return (
    <div className="widget-content">
      <LogoCoverUploader
        onSubmit={onSubmit}
        handleImage={handleImage}
        handleCover={handleCover}
        image={image}
        cover={cover}
      />
      {/* End logo and cover photo components */}

      <FormInfoBox onSubmit={onSubmit} company={company} />
      {/* compnay info box */}
    </div>
  );
};

export default index;
