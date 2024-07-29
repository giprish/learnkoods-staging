"use client";

import Link from "next/link";
import employerMenuData from "../../data/employerMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { menuToggle } from "../../features/toggle/toggleSlice";
import { UserAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Popover from "react-bootstrap/Popover";

const DashboardEmployerSidebar = () => {
  const { user, logOut } = UserAuth();
  const router = useRouter();
  const { menu } = useSelector((state) => state.toggle);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccessToken(window.localStorage.getItem("access"));
    }
  }, []);

  const dispatch = useDispatch();
  // menu togggle handler
  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

  const unifiedLogout = async () => {
    // if (user) {
    //   try {
    //     await logOut();
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    if (accessToken) {
      window.localStorage.clear();
    }

    toast.success("User logged out successfully", {
      position: toast.POSITION.TOP_CENTER,
    });
    router.push("/");
  };
  const renderPopOver = (props) => (
    <Popover id="popover-basic">
      <Popover.Body
        style={{
          color: "#1967d2",
          margin: "1px",
          padding: "4px",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        <strong>{props}</strong>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className={`user-sidebar-employer ${menu ? "sidebar_open" : ""}`}>
      {/* Start sidebar close icon */}
      <div className="pro-header text-end pb-0 mb-0 show-1023">
        <div className="fix-icon" onClick={menuToggleHandler}>
          <span className="flaticon-close"></span>
        </div>
      </div>
      {/* End sidebar close icon */}
      <div className="sidebar-inner">
        <ul className="navigation">
          {employerMenuData.map((item) => (
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 200 }}
              overlay={renderPopOver(item.name)}
            >
              <li
                className={`${
                  isActiveLink(item.routePath, router.asPath) ? "active" : ""
                } mb-1`}
                key={item.id}
                onClick={menuToggleHandler}
              >
                {item.name === "Logout" ? (
                  <Link href={item.routePath} onClick={unifiedLogout}>
                    <i className={`la ${item.icon}`}></i>
                  </Link>
                ) : (
                  <Link href={item.routePath}>
                    <i className={`la ${item.icon}`}></i>
                  </Link>
                )}
              </li>
            </OverlayTrigger>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardEmployerSidebar;
