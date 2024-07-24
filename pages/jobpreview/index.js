import dynamic from "next/dynamic";
import Seo from "../../components/common/Seo";
import Jobpreview from "@/components/jobpreview";

const index = () => {
  return (
    <>
      <Seo pageTitle="Job preview V1" />
      <Jobpreview />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
