import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import RegisterCompany from "../../../components/dashboard-pages/employers-dashboard/register-company";

const index = () => {
  return (
    <>
      <Seo pageTitle="Register New Company" />
      <RegisterCompany />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
