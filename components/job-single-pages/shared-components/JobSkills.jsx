const JobSkills = ({ jobDetails }) => {
  const skills = jobDetails?.skills_req;
  return (
    <ul className="job-skills">
      {skills?.map((skill, i) => (
        <li key={i}>
          <a href="#">{skill?.data || skill?.label}</a>
        </li>
      ))}
    </ul>
  );
};

export default JobSkills;
