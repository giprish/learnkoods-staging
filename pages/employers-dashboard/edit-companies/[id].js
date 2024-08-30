import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import EditCompany from "../../../components/dashboard-pages/employers-dashboard/edit-company/index";

const index = () => {
  return (
    <>
      <Seo pageTitle="Post Companies" />
      <EditCompany />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
