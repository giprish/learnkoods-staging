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
  const [profileImage, setProfileImage] = useState("");
  const dispatch = useDispatch();

  const handleUserType = (type) => {
    dispatch(setUserType(type));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileImage = localStorage.getItem("profile_image");
      setStudent(localStorage.getItem("student"));
      setAccessToken(localStorage.getItem("access"));
      if (
        storedProfileImage &&
        storedProfileImage !== "undefined" &&
        storedProfileImage !== null
      ) {
        setProfileImage(storedProfileImage);
      }
    }
  }, []);

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
  const fetchData = async () => {
    const response = await axios.get(`${GLOBAL_API}/usr_pro_id/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  const { data: user, isSuccess } = useQuery({
    queryKey: ["user", accessToken],
    queryFn: () => fetchData(),
  });

  return (
    <>
      <div>
        <nav className="nav main-menu">
          <ul className="navigation" id="navbar">
            {/* current dropdown */}
            <li>
              <a href="/">
                <span>Upskill</span>
              </a>
            </li>
            {/* End homepage menu items */}

            <li>
              <a href="/job-list/job-list-v1">
                <span>Find Jobs</span>
              </a>
            </li>

            <li>
              <a href="">
                <span>Mentorship</span>
              </a>
            </li>

            {student === "false" && (
              <li>
                <a href="/employers-dashboard/dashboard">
                  <span>Employers</span>
                </a>
              </li>
            )}

            {!accessToken && (
              <li className="nav-item dropdown">
                <a
                  href="#"
                  className="theme-btn btn-style-new dropdown-toggle"
                  id="loginDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Login
                </a>
                <ul className="dropdown-menu" aria-labelledby="loginDropdown">
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#loginPopupModal"
                    >
                      Student
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
                </ul>
              </li>
            )}

            {!accessToken && (
              <li className="nav-item dropdown">
                <a
                  href="#"
                  className="theme-btn btn-style-new dropdown-toggle"
                  id="registerDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Register
                </a>
                <ul
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
                      Student
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
                </ul>
              </li>
            )}

            {accessToken && (
              <li>
                <a
                  href="#"
                  className="theme-btn btn-style-new"
                  onClick={unifiedLogout}
                >
                  Logout
                </a>
              </li>
            )}

            {accessToken && (
              <>
                <li>
                  <a href="/candidates-dashboard/messages">
                    <button className="menu-btn">
                      <span className="count">1</span>
                      <span className="icon la la-comment"></span>
                    </button>
                  </a>
                </li>
                <li>
                  <a href="/candidates-dashboard">
                    <button className="menu-btn">
                      <span className="icon la la-bell"></span>
                    </button>
                  </a>
                </li>
                <li>
                  <div className="dashboard-option">
                    <Link href={href()} className="">
                      <Image
                        alt="avatar"
                        className="rounded-circle"
                        src={
                          user?.data?.profile_image ||
                          "/images/about-img-1.webp"
                        }
                        width={50}
                        height={50}
                      />
                    </Link>
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
