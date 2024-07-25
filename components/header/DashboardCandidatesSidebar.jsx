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

const DashboardCandidatesSidebar = () => {
  const { user, logOut, fetchedUser } = UserAuth();
  const { menu } = useSelector((state) => state.toggle);
  const percentage = 30;
  const router = useRouter();
  const accessToken = window.localStorage.getItem("access");
  const [username, setUserName] = useState(null);
  const imageUrl = window.localStorage.getItem("profile_image");
  const [profileImage, setProfileImage] = useState(
    "/images/default-avatar.png"
  );

  useEffect(() => {
    if (imageUrl !== "undefined") {
      const user = localStorage.getItem("user");
      setProfileImage(imageUrl);
      setUserName(user);
    }
  }, [imageUrl]);

  // console.log(fetchedUser, "resume link");

  const dispatch = useDispatch();
  // menu togggle handler
  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

  const unifiedLogout = async () => {
    if (user && user !== undefined) {
      try {
        await logOut();
      } catch (error) {
        console.log(error);
      }
    }

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
    <div className={`user-sidebar ${menu ? "sidebar_open" : ""}`}>
      {/* Start sidebar close icon */}
      <div className="pro-header text-end pb-0 mb-0 show-1023">
        <div className="fix-icon" onClick={menuToggleHandler}>
          <span className="flaticon-close"></span>
        </div>
      </div>
      {/* End sidebar close icon */}

      <div className="sidebar-inner">
        <ul className="navigation">
          {accessToken && profileImage !== "undefined" && (
            <div className="sidebar-image">
              <Link href="" className="">
                <Image
                  alt="avatar"
                  className=""
                  src={profileImage}
                  width={50}
                  height={50}
                />
              </Link>
              <span className="p-2">{username}</span>
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
                    <Link href={item.routePath} onClick={unifiedLogout}>
                      <i className={`la ${item.icon}`}></i>
                      {item?.name}
                    </Link>
                  ) : item.name === "My Resume" ? (
                    <Link
                      href={`${process.env.GLOBAL_API}${fetchedUser?.data?.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className={`la ${item.icon}`}></i> {item?.name}
                    </Link>
                  ) : (
                    <Link href={item.routePath}>
                      <i className={`la ${item.icon}`}></i>
                      {item?.name}
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
