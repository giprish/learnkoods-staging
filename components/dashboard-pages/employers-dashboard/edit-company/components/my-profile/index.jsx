import FormInfoBox from "./FormInfoBox";
import LogoCoverUploader from "./LogoCoverUploader";

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
      <LogoCoverUploader />
      {/* End logo and cover photo components */}

      <FormInfoBox
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
