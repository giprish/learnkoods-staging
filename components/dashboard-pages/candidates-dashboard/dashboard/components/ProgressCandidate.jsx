import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProgressCandidate = ({ title }) => {
  const percentage = 70;
  return (
    <div className="row">
      <div className="col-sm-12 col-md-6">
        <h4 className="text-nowrap mb-4 m-2">{title}</h4>
        {/* <p>
          `Put value for <strong>Cover Image</strong> field to increase your
          skill up to <strong>85%</strong>`
        </p> */}
      </div>
      <div style={{ width: 150, height: 150, margin: "auto" }}>
        <CircularProgressbar
          // background
          // backgroundPadding={6}
          // styles={buildStyles({
          //   backgroundColor: "#0a428f",
          //   textColor: "#fff",
          //   pathColor: "#fff",
          //   trailColor: "transparent",
          // })}
          // value={percentage}
          // text={`${percentage}%`}
          value={percentage}
          circleRatio={0.71}
          background
          backgroundPadding={6}
          strokeWidth={10}
          styles={buildStyles({
            rotation: 0.64, // Rotate the whole progress bar to cut from the bottom
            backgroundColor: "#fff",
            textColor: "#0a428f",
            pathColor: "#0a428f",
            // trailColor: "transparent",
            strokeLinecap: "butt",
          })}
          text={`${percentage}%`}
        />
      </div>{" "}
    </div>
  );
};

export default ProgressCandidate;
