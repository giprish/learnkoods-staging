const PostJobSteps = ({ setTab, currentTab }) => {
  return (
    <div className="post-job-steps">
      <div>
        <button
          className="step"
          onClick={() => setTab("step1")}
          aria-label="Job Detail"
        >
          <span className="icon flaticon-briefcase"></span>
          <h5>Job Detail</h5>
        </button>
      </div>

      <div>
        <button
          onClick={() => setTab("step2")}
          aria-label="Package & Payments"
          className="step"
        >
          <span className="icon flaticon-money"></span>
          <h5>Package & Payments</h5>
        </button>
      </div>
      <div>
        <button
          onClick={() => setTab("step3")}
          aria-label="Screening Questions"
          className="step"
        >
          <span class="icon flaticon-chat"></span>
          <h5>Screening Questions</h5>
        </button>
      </div>

      <div>
        <button
          onClick={() => setTab("step4")}
          aria-label="Confirmation"
          className="step"
        >
          <span className="icon flaticon-checked"></span>
          <h5>Confirmation</h5>
        </button>
      </div>
    </div>
  );
};

export default PostJobSteps;
