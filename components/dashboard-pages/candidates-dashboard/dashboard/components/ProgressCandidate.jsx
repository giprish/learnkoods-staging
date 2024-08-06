import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProgressCandidate = ({ title }) => {
  const percentage = 70;
  return (
    <div className="row justify-content-center">
      <div className="text-center">
        <h4 className="text-nowrap mb-4 m-2">{title}</h4>
      </div>
      <div style={{ width: 150, height: 150, margin: "auto" }}>
        <CircularProgressbar
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
            strokeLinecap: "butt",
          })}
          text={`${percentage}%`}
        />
      </div>{" "}
    </div>
  );
};

export default ProgressCandidate;
