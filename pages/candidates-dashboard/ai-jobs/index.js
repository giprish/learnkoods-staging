import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import AiJobs from "../../../components/dashboard-pages/candidates-dashboard/ai-jobs";

const index = () => {
  return (
    <>
      <Seo pageTitle="Applied Jobs" />
      <AiJobs />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
