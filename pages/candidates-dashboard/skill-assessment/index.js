import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import SkillAssessment from "../../../components/dashboard-pages/candidates-dashboard/skill-assessment";

const index = () => {
  return (
    <>
      <Seo pageTitle="My Profile" />
      <SkillAssessment />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
