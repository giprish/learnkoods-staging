import RegisterFormInfoBox from "./RegisterFormInfobox";
import RegisterLogoCoverUploader from "./RegisterLogoCoverUploader";

const index = ({
  onSubmit,
  logo,
  handleLogo,
  company,
  countryId,
  setCountryId,
  stateId,
  setStateId,
}) => {
  return (
    <div className="widget-content">
      <RegisterLogoCoverUploader
        onSubmit={onSubmit}
        handelLogo={handleLogo}
        logo={logo}
      />
      {/* End logo and cover photo components */}

      <RegisterFormInfoBox
        onSubmit={onSubmit}
        company={company}
        handleLogo={handleLogo}
        logo={logo}
        countryId={countryId}
        setCountryId={setCountryId}
        stateId={stateId}
        setStateId={setStateId}
      />
      {/* compnay info box */}
    </div>
  );
};

export default index;
