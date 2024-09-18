import { useEffect } from "react";

const ProfileTabs = ({ setTab, currentTab }) => {
  useEffect(() => {
    // console.log("Current tab is:", currentTab);
  }, [currentTab]); // This will run every time currentTab changes
  return (
    <div className="post-job-steps">
      <div
      // className={`${currentTab === "step1" ? "active" : ""} tab text-center`}
      >
        <button
          className={`${
            currentTab === "step1" ? "active" : ""
          } tab text-center step`}
          onClick={() => setTab("step1")}
          aria-label="Job Detail"
        >
          <h5>Personal Details</h5>
        </button>
      </div>

      <div>
        <button
          onClick={() => setTab("step2")}
          aria-label="Package & Payments"
          className={`${
            currentTab === "step2" ? "active" : ""
          } tab text-center step`}
        >
          <h5>Contact Details</h5>
        </button>
      </div>
      <div>
        <button
          onClick={() => setTab("step3")}
          aria-label="Screening Questions"
          className={`${
            currentTab === "step3" ? "active" : ""
          } tab text-center step`}
        >
          <h5>Education Details </h5>
        </button>
      </div>
      <div>
        <button
          onClick={() => setTab("step4")}
          aria-label="Screening Questions"
          className={`${
            currentTab === "step4" ? "active" : ""
          } tab text-center step`}
        >
          <h5>Experience Details </h5>
        </button>
      </div>
      <div>
        <button
          onClick={() => setTab("step5")}
          aria-label="Screening Questions"
          className={`${
            currentTab === "step5" ? "active" : ""
          } tab text-center step`}
        >
          <h5>Certificate Details </h5>
        </button>
      </div>
    </div>
  );
};

export default ProfileTabs;
