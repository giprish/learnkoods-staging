import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import DashboadHome from "../../../components/dashboard-pages/employers-dashboard/dashboard";
import CreateCourse from "../../../components/dashboard-pages/employers-dashboard/create-course";
const index = () => {
  return (
    <>
      <Seo pageTitle="Create new course" />
      <CreateCourse />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
