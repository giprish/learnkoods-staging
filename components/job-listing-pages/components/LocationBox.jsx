import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLocation } from "../../../features/filter/filterSlice";

const LocationBox = () => {
  const { jobList } = useSelector((state) => state.filter);
  const [getLocation, setLocation] = useState(jobList.location);
  const dispath = useDispatch();
  const [typingTimeout, setTypingTimeout] = useState(null);

  // location handler
  //   const locationHandler = (e) => {

  //     dispath(addLocation(e.target.value));
  //   };

  const locationHandler = (e) => {
    const newValue = e.target.value;
    setLocation(newValue);
    clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        dispath(addLocation(newValue));
      }, 2000)
    ); // Dispatch action after 2 seconds of no typing
  };

  useEffect(() => {
    setLocation(jobList.location);
  }, [setLocation, jobList]);

  return (
    <>
      <input
        type="text"
        name="listing-search"
        placeholder="City or postcode"
        value={getLocation}
        onChange={locationHandler}
      />
      <span className="icon flaticon-map-locator"></span>
    </>
  );
};

export default LocationBox;
