import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import AICourses from "../../../components/dashboard-pages/candidates-dashboard/ai-courses";

const index = () => {
  return (
    <>
      <Seo pageTitle="My Profile" />
      <AICourses />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
