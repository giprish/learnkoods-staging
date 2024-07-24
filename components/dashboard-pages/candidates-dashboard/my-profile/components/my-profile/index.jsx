import FormInfoBox from "./FormInfoBox";
import LogoUpload from "./LogoUpload";

const index = ({
  onSubmit,
  handelImage,
  user,
  handelResume,
  image,
  resume,
  onError,
}) => {
  // const { formData, onChangeEventHandler, handleSubmit } = props;
  return (
    <div className="widget-content">
      <LogoUpload
        // formData={formData}
        // onChangeEventHandler={onChangeEventHandler}
        onSubmit={onSubmit}
        handelImage={handelImage}
        handelResume={handelResume}
        image={image}
        resume={resume}
      />
      {/* End logo and cover photo components */}

      <FormInfoBox onError={onError} onSubmit={onSubmit} user={user} />
      {/* compnay info box */}
    </div>
  );
};

export default index;
