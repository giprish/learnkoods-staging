"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserType } from "../../features/user/userslice";

const HeaderNavContent = () => {
  const [student, setStudent] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [profileImage, setProfileImage] = useState(
    "/images/resource/ads-bg-4.png"
  );
  const [Id, setID] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setStudent(localStorage.getItem("student"));
      setAccessToken(localStorage.getItem("access"));
      setID(localStorage.getItem("id"));
    }
  }, []);

  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/usr_pro_id/${Id}/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  const { data: user } = useQuery({
    queryKey: ["user", accessToken],
    queryFn: () => fetchData(),
    enabled: !!accessToken,
    retry: 1,
  });

  // console.log(user);

  useEffect(() => {
    if (user && user?.data?.profile_image !== null) {
      setProfileImage(user?.data?.profile_image);
    }
  }, [user]);

  // console.log(Id, "user id local");
  const dispatch = useDispatch();

  const handleUserType = (type) => {
    dispatch(setUserType(type));
  };

  const router = useRouter();
  const href = () => {
    if (accessToken) {
      if (student === "false") {
        return "/employers-dashboard/dashboard";
      } else if (student === "true") {
        return "/candidates-dashboard/my-profile";
      }
    } else {
      return;
    }
  };

  const unifiedLogout = async () => {
    if (accessToken) {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      // setAccessToken(null);
    }

    toast.success("User logged out successfully", {
      position: toast.POSITION.TOP_CENTER,
    });
    router.push("/");
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <>
      <div>
        <nav className="nav main-menu">
          <ul className="navigation" id="navbar">
            {/* current dropdown */}
            {(student === "true" || student == null) && (
              <>
                <li>
                  <a href="/upskill">
                    <span>Upskill</span>
                  </a>
                </li>

                <li>
                  <a href="/job-list/job-list-v1">
                    <span>Find Jobs</span>
                  </a>
                </li>

                <li>
                  <a href="/assessment">
                    <span>Assessment</span>
                  </a>
                </li>
                {student == null && (
                  <>
                    {/* <li>
                     <a href="/employers-dashboard/dashboard">
                       <span>Employers</span>
                     </a>
                   </li> */}
                  </>
                )}
              </>
            )}

            {student === "false" && (
              <>
                {/* <li>
                  <a href="/upskill">
                    <span>Upskill</span>
                  </a>
                </li>*/}
                {router.pathname === "/" && (
                  <li>
                    <a href="/pricing">
                      <span>Pricing</span>
                    </a>
                  </li>
                )}

                <li>
                  <a href="/assessment">
                    <span>Assessment</span>
                  </a>
                </li>
                {/* <li>
                  <a href="/employers-dashboard/dashboard">
                    <span>Employers</span>
                  </a>
                </li> */}
              </>
            )}

            {!accessToken && (
              <li className="nav-item dropdown">
                <a
                  href="/login"
                  className="theme-btn btn-style-blue "
                  // id="loginDropdown"
                  // role="button"
                  // data-bs-toggle="dropdown"
                  // aria-expanded="false"
                >
                  Login
                </a>
                {/* <ul className="dropdown-menu" aria-labelledby="loginDropdown">
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#loginPopupModal"
                    >
                      User
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#loginPopupModal"
                    >
                      Employer
                    </a>
                  </li>
                </ul> */}
              </li>
            )}

            {!accessToken && (
              <li className="nav-item dropdown">
                <a
                  href="/register"
                  className="theme-btn btn-style-blue "
                  // id="registerDropdown"
                  // role="button"
                  // data-bs-toggle="dropdown"
                  // aria-expanded="false"
                >
                  Register
                </a>
                {/* <ul
                  className="dropdown-menu"
                  aria-labelledby="registerDropdown"
                >
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#registerModal"
                      onClick={() => handleUserType("candidate")}
                    >
                      User
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#registerModal"
                      onClick={() => handleUserType("employer")}
                    >
                      Employer
                    </a>
                  </li>
                </ul> */}
              </li>
            )}

            {accessToken && (
              <>
                <li>
                  <a
                    href={
                      student === "true"
                        ? "/candidates-dashboard/messages"
                        : "/employers-dashboard/messages"
                    }
                  >
                    <button className="menu-btn">
                      <span className="count">1</span>
                      <span className="icon la la-comment"></span>
                    </button>
                  </a>
                </li>
                <li className="nav-item dropdown text-center">
                  <div className="dashboard-option">
                    <Link
                      href="#"
                      className=""
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <Image
                        alt="avatar"
                        className="rounded-circle"
                        src={profileImage}
                        width={50}
                        height={50}
                      />
                    </Link>
                    <ul
                      className="dropdown-menu text-center"
                      aria-labelledby="dashboardDropdown"
                    >
                      {/* Dropdown items */}

                      <li>
                        <a
                          className="dropdown-item"
                          href={
                            student === "true"
                              ? "/candidates-dashboard/my-profile"
                              : "/employers-dashboard/my-profile"
                          }
                        >
                          My Profile
                        </a>
                      </li>
                      {accessToken && student === "true" && (
                        <>
                          <li>
                            <a
                              className="dropdown-item"
                              href={`${user?.data?.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              My Resume
                            </a>
                          </li>
                        </>
                      )}
                      <li>
                        <a className="dropdown-item" href={href()}>
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Settings
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" onClick={unifiedLogout}>
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default HeaderNavContent;
