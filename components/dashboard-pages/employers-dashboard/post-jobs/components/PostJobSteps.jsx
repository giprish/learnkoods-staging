const PostJobSteps = ({ setTab, currentTab }) => {
  return (
    <div className="post-job-steps">
      <div>
        <button
          className={`${
            currentTab === "step1" ? "active" : ""
          } tab text-center step`}
          onClick={() => setTab("step1")}
          aria-label="Job Detail"
        >
          {/* <span className="icon flaticon-briefcase"></span> */}
          <h5>Job Details</h5>
        </button>
      </div>

      <div>
        <button
          className={`${
            currentTab === "step2" ? "active" : ""
          } tab text-center step`}
          onClick={() => setTab("step2")}
          aria-label="Package & Payments"
        >
          {/* <span className="icon flaticon-money"></span> */}
          <h5>Package & Payments</h5>
        </button>
      </div>
      <div>
        <button
          className={`${
            currentTab === "step3" ? "active" : ""
          } tab text-center step`}
          onClick={() => setTab("step3")}
          aria-label="Screening Questions"
        >
          {/* <span class="icon flaticon-chat"></span> */}
          <h5>Screening Questions</h5>
        </button>
      </div>

      {/* <div>
        <button
          onClick={() => setTab("step4")}
          aria-label="Confirmation"
          className="step"
        >
          <span className="icon flaticon-checked"></span>
          <h5>Confirmation</h5>
        </button>
      </div> */}
    </div>
  );
};

export default PostJobSteps;
