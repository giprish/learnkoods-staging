import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import ApplyJobs from "@/components/applyJob/ApplyJobs";

const index = () => {
  return (
    <>
      <Seo pageTitle="Job List V1" />
      <ApplyJobs />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
