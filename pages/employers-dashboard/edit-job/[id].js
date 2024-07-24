import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import EditJob from "../../../components/dashboard-pages/employers-dashboard/edit-job/index";

const index = () => {
  return (
    <>
      <Seo pageTitle="Post Jobs" />
      <EditJob />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
