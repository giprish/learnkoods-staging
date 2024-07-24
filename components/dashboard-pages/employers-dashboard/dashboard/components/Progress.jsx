import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Progress = () => {
  const percentage = 80;
  return (
    // <ul className="notification-list">
    //   <li>
    //     <span className="icon flaticon-briefcase"></span>
    //     <strong>Henry Wilson</strong> applied for a job
    //     <span className="colored"> Product Designer</span>
    //   </li>

    //   <li className="success">
    //     <span className="icon flaticon-briefcase"></span>
    //     <strong>Raul Costa</strong> applied for a job
    //     <span className="colored"> Product Manager, Risk</span>
    //   </li>

    //   <li>
    //     <span className="icon flaticon-briefcase"></span>
    //     <strong>Jack Milk</strong> applied for a job
    //     <span className="colored"> Technical Architect</span>
    //   </li>

    //   <li className="success">
    //     <span className="icon flaticon-briefcase"></span>
    //     <strong>Michel Arian</strong>
    //     applied for a job
    //     <span className="colored"> Software Engineer</span>
    //   </li>

    //   <li>
    //     <span className="icon flaticon-briefcase"></span>
    //     <strong>Wade Warren</strong> applied for a job
    //     <span className="colored"> Web Developer</span>
    //   </li>

    // </ul>
    <div className="row">
      <div className="col-sm-12 col-md-6">
        <h4>Skills Percentage</h4>
        <p>
          `Put value for <strong>Cover Image</strong> field to increase your
          skill up to <strong>85%</strong>`
        </p>
      </div>
      <div style={{ width: 200, height: 200, margin: "auto" }}>
        <CircularProgressbar
          background
          backgroundPadding={6}
          styles={buildStyles({
            backgroundColor: "#0a428f",
            textColor: "#fff",
            pathColor: "#fff",
            trailColor: "transparent",
          })}
          value={percentage}
          text={`${percentage}%`}
        />
      </div>{" "}
    </div>
  );
};

export default Progress;
