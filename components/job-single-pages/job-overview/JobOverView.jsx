const JobOverView = ({ jobDetails }) => {
  const originaldate = new Date(jobDetails?.created_at);

  return (
    <div className="widget-content">
      <ul className="job-overview">
        {/* <li>
          <i className="icon icon-calendar"></i>
          <h5>Date Posted:</h5>
          <span>{originaldate.toLocaleDateString()}</span>
        </li> */}
        {/* <li>
          <i className="icon icon-expiry"></i>
          <h5>Expiration date:</h5>
          <span>N/A</span>
        </li> */}
        <li>
          <i className="icon icon-location"></i>
          <h5>Location:</h5>
          <span>{jobDetails?.location1}, {jobDetails?.location}, {jobDetails?.city?.name}, {jobDetails?.state?.name}, {jobDetails?.country?.name}, {jobDetails?.pincode}</span>
        </li>
        <li>
          <i className="icon icon-user-2"></i>
          <h5>Job Title:</h5>
          <span>{jobDetails?.job_title}</span>
        </li>

        <li>
          <i className="icon icon-salary"></i>
          <h5>Salary:</h5>
          <span>
            $ {jobDetails?.min_salary || "null"} - ${" "}
            {jobDetails?.max_salary || "null"}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default JobOverView;
