const PostJobSteps = ({ setTab, currentTab, error }) => {
  // Check if errors are present for tab1 and tab2
  const hasTab1Error =
    error === "tab1" || (Array.isArray(error) && error.includes("tab1"));
  const hasTab2Error =
    error === "tab2" || (Array.isArray(error) && error.includes("tab2"));

  // Determine if text should be red for each tab
  const isTab1Error = hasTab1Error && (hasTab1Error || hasTab2Error);
  const isTab2Error = hasTab2Error && (hasTab1Error || hasTab2Error);
  console.log(error);

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
          <h5 className={`${isTab1Error ? "text-danger" : ""}`}>Job Details</h5>
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
          <h5 className={`${isTab2Error ? "text-danger" : ""}`}>
            Package & Payments
          </h5>
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
          <h5 className={`${error === "tab3" ? "text-danger" : ""}`}>
            Screening Questions
          </h5>
        </button>
      </div>
    </div>
  );
};

export default PostJobSteps;
