const ProfileTabs = ({ setTab, currentTab }) => {
  return (
    <div className="post-job-steps border">
      <div className={`${currentTab === "step1" ? " " : ""} text-center`}>
        <button
          className="step"
          onClick={() => setTab("step1")}
          aria-label="Job Detail"
        >
          <h5>Personal Details</h5>
        </button>
      </div>

      <div className={currentTab === "step2" ? " " : ""}>
        <button
          onClick={() => setTab("step2")}
          aria-label="Package & Payments"
          className="step"
        >
          <h5>Contact Details</h5>
        </button>
      </div>
      <div className={currentTab === "step3" ? " " : ""}>
        <button
          onClick={() => setTab("step3")}
          aria-label="Screening Questions"
          className="step"
        >
          <h5>Education Details </h5>
        </button>
      </div>
      <div className={currentTab === "step4" ? " " : ""}>
        <button
          onClick={() => setTab("step4")}
          aria-label="Screening Questions"
          className="step"
        >
          <h5>Experience Details </h5>
        </button>
      </div>
      <div className={currentTab === "step5" ? " " : ""}>
        <button
          onClick={() => setTab("step5")}
          aria-label="Screening Questions"
          className="step"
        >
          <h5>Certificate Details </h5>
        </button>
      </div>
    </div>
  );
};

export default ProfileTabs;
