import Progress from "@/components/dashboard-pages/employers-dashboard/dashboard/components/Progress";
import ProgressCandidate from "./ProgressCandidate";

const AssessmentBlock = () => {
  const cardContent = [
    {
      id: 1,
      icon: "flaticon-briefcase",
      countNumber: "22",
      metaName: "Applied Jobs",
      uiClass: "ui-blue",
    },
    {
      id: 2,
      icon: "la-file-invoice",
      countNumber: "9382",
      metaName: "Job Alerts",
      uiClass: "ui-red",
    },
  ];

  return (
    <>
      <div className="row">
        <div className="ui-block col-lg-6 ">
          <ProgressCandidate title="Courses Completed" />
        </div>
        <div className="ui-block col-lg-6 ">
          <ProgressCandidate title="Assessments Completed" />
        </div>
      </div>
    </>
  );
};

export default AssessmentBlock;
