import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Progress = () => {
  const percentage = 80;
  return (
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
