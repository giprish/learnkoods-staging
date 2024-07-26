import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import TrendingIt from "../../../components/dashboard-pages/candidates-dashboard/trending-it";

const index = () => {
  return (
    <>
      <Seo pageTitle="Applied Jobs" />
      <TrendingIt />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
