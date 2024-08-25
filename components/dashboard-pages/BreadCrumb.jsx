import { useRouter } from "next/router";

const BreadCrumb = ({ title, text }) => {
  const router = useRouter();
  return (
    <div className="row">
      <div className="upper-title-box col-sm-6 col-md-9 col-lg-10">
        <h3>{title}</h3>
        <div className="text">{text || " "}</div>

        {(router.pathname === "/employers-dashboard/messages" ||
          router.pathname === "/candidates-dashboard/messages") && (
          <div className="text-center">
            <h4>Coming Soon!</h4>
          </div>
        )}
      </div>
      {router.pathname === "/employers-dashboard/company-profile" && (
        <div className="col-sm-6 col-md-3 col-lg-2 mb-2">
          <button
            className="theme-btn btn-style-blue p-3"
            onClick={() => {
              router.push("/employers-dashboard/register-company"); // Replace '/new-company' with your target route
            }}
          >
            Add New Company
          </button>
        </div>
      )}
    </div>
  );
};

export default BreadCrumb;
