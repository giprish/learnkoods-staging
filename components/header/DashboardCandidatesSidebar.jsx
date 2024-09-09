"use client";

import Link from "next/link";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import candidatesuData from "../../data/candidatesMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { menuToggle } from "../../features/toggle/toggleSlice";
import { UserAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Popover from "react-bootstrap/Popover";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const DashboardCandidatesSidebar = () => {
  const { shortSidebar: isSidebarCollapsed } = useSelector(
    (state) => state.toggle
  );
  const [access, setAccessToken] = useState(null);
  const [id, setId] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccessToken(window.localStorage.getItem("access"));
      setId(window.localStorage.getItem("id"));
      setStudent(localStorage.getItem("student"));
    }
  }, []);

  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/usr_pro_id/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { data: user } = useQuery({
    queryKey: ["user", access],
    queryFn: () => fetchData(),
    enabled: !!access && student === "true",
  });

  // console.log(user, "candidate sidebar");

  const { menu } = useSelector((state) => state.toggle);
  const router = useRouter();

  // console.log(fetchedUser, "resume link");

  const dispatch = useDispatch();
  // menu togggle handler
  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

  const unifiedLogout = async () => {
    if (access) {
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
    <div
      className={`user-sidebar ${
        isSidebarCollapsed ? "user-sidebar-collapsed" : ""
      } ${menu ? "sidebar_open" : ""}`}
    >
      {/* Start sidebar close icon */}
      <div className="pro-header text-end pb-0 mb-0 show-1023">
        <div className="fix-icon" onClick={menuToggleHandler}>
          <span className="flaticon-close"></span>
        </div>
      </div>
      {/* End sidebar close icon */}

      <div className="sidebar-inner">
        <ul className="navigation">
          {!isSidebarCollapsed && access && (
            <div className="sidebar-image">
              <Link href="" className="">
                <Image
                  alt="avatar"
                  className=""
                  src={
                    user?.data?.profile_image || "/images/resource/ads-bg-4.png"
                  }
                  width={100}
                  height={100}
                />
              </Link>
            </div>
          )}
          {!isSidebarCollapsed && (
            <div className="text-center mb-3">
              <span>{user?.user?.username}</span>
            </div>
          )}

          {candidatesuData.map((item) => {
            return (
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
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
                    <Link
                      href={item.routePath}
                      onClick={unifiedLogout}
                      className={`${isSidebarCollapsed ? "a-collapsed" : ""}`}
                    >
                      <i className={`la ${item.icon}`}></i>
                      {!isSidebarCollapsed && item.name}
                    </Link>
                  ) : item.name === "My Resume" ? (
                    <Link
                      href={`${user?.data?.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${isSidebarCollapsed ? "a-collapsed" : ""}`}
                    >
                      <i className={`la ${item.icon}`}></i>{" "}
                      {!isSidebarCollapsed && item.name}
                    </Link>
                  ) : (
                    <Link
                      href={item.routePath}
                      className={`${isSidebarCollapsed ? "a-collapsed" : ""}`}
                    >
                      <i className={`la ${item.icon}`}></i>
                      {!isSidebarCollapsed && item.name}
                    </Link>
                  )}
                </li>
              </OverlayTrigger>
            );
          })}
          {/* {candidatesuData.map((item) => (
            <li
              className={`${
                isActiveLink(item.routePath, router.asPath) ? "active" : ""
              } mb-1`}
              key={item.id}
              onClick={menuToggleHandler}
            >
              <Link href={item.routePath}>
                <i className={`la ${item.icon}`}></i> {item.name}
              </Link>
            </li>
          ))} */}
        </ul>
        {/* End navigation */}

        {/* <div className="skills-percentage">
          <h4>Skills Percentage</h4>
          <p>
            `Put value for <strong>Cover Image</strong> field to increase your
            skill up to <strong>85%</strong>`
          </p>
          <div style={{ width: 200, height: 200, margin: "auto" }}>
            <CircularProgressbar
              background
              backgroundPadding={6}
              styles={buildStyles({
                backgroundColor: "#7367F0",
                textColor: "#fff",
                pathColor: "#fff",
                trailColor: "transparent",
              })}
              value={percentage}
              text={`${percentage}%`}
            />
          </div>{" "}
          
        </div> */}
      </div>
    </div>
  );
};

export default DashboardCandidatesSidebar;
