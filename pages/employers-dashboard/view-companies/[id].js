import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import ViewCompany from "../../../components/dashboard-pages/employers-dashboard/view-company/index";
import FooterDefault from "../../../components/footer/common-footer";

const index = () => {
  return (
    <>
      <Seo pageTitle="View Companies" />
      <ViewCompany />
      <FooterDefault footerStyle="alternate5" />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
