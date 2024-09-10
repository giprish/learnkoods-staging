const CompanyInfo = ({ jobDetails }) => {
  return (
    <ul className="company-info">
      <li>
        <h5 className="my-2">{jobDetails?.company?.name || "null"}</h5>
      </li>
      <li>
        Primary industry: <span>{jobDetails?.company?.comp_industry}</span>
      </li>
      <li>
        Company size: <span>{jobDetails?.company?.team_size}</span>
      </li>
      <li>
        Established On: <span>{jobDetails?.company?.since}</span>
      </li>
      {/* <li>
        Phone: <span>123 456 7890</span>
      </li> */}
      <li>
        Email: <span>{jobDetails?.company?.email}</span>
      </li>
      <li>
        Location: <span>{jobDetails?.company?.country}</span>
      </li>
    </ul>
  );
};

export default CompanyInfo;
