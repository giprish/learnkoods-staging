"use client";

import Link from "next/link";
import MobileSidebar from "./mobile-sidebar";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { UserAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const MobileMenu = () => {
  // const [access, setAccess] = useState(null);
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setAccess(window.localStorage.getItem("access"));
  //   }
  // }, []);
  const { user, logOut } = UserAuth();
  const [accessToken, setAccessToken] = useState(null);
  const [navbar, setNavbar] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccessToken(window.localStorage.getItem("access"));
    }

    const changeBackground = () => {
      if (window.scrollY >= 10) {
        setNavbar(true);
      } else {
        setNavbar(false);
      }
    };

    window.addEventListener("scroll", changeBackground);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, [router]);

  const unifiedLogout = async () => {
    if (user) {
      try {
        logOut();
      } catch (error) {
        console.log(error);
      }
    }

    if (accessToken) {
      if (typeof window !== "undefined") {
        window.localStorage.clear();
      }
      setAccessToken(null);
    }

    toast.success("User logged out successfully", {
      position: toast.POSITION.TOP_CENTER,
    });
    router.push("/");
  };
  return (
    // <!-- Main Header-->
    <header className="main-header main-header-mobile">
      <div className="auto-container">
        {/* <!-- Main box --> */}
        <div className="inner-box">
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link href="/">
                  <Image
                    width={150}
                    height={80}
                    src="/images/skillthrive_logo.png"
                    alt="brand"
                  />
                  {/* <h2 className="mx-4">
                    <strong>SkillThrive</strong>
                  </h2> */}
                </Link>
              </div>
            </div>
            {/* End .logo-box */}

            <MobileSidebar />
            {/* <!-- Main Menu End--> */}
          </div>
          {/* End .nav-outer */}

          <div className="outer-box">
            {/* {!accessToken && (
              <div className="login-box">
                <a
                  href="#"
                  className="call-modal"
                  data-bs-toggle="modal"
                  data-bs-target="#loginPopupModal"
                >
                  <span className="icon icon-user"></span>
                </a>
              </div>
            )}
            {accessToken && (
              <div>
                <a
                  href="#"
                  className="theme-btn btn-style-three-mobile call-modal"
                  onClick={unifiedLogout}
                >
                  <span className="las la-sign-out-alt"></span>
                </a>
              </div>
            )} */}

            {!accessToken && (
              <li className="nav-item dropdown signin-menu">
                <div
                  className="theme-btn btn-style-blue dropdown-toggle"
                  id="loginDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="las la-sign-in-alt "></i>
                </div>
                <ul className="dropdown-menu" aria-labelledby="loginDropdown">
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
                </ul>
              </li>
            )}

            {!accessToken && (
              <li className="nav-item dropdown">
                <div
                  className="theme-btn btn-style-blue dropdown-toggle"
                  id="registerDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="las la-user-plus"></i>
                </div>
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
                </ul>
              </li>
            )}

            {accessToken && (
              <li>
                <a
                  href="#"
                  className="theme-btn btn-style-blue"
                  onClick={unifiedLogout}
                >
                  Logout
                </a>
              </li>
            )}

            {/* login popup end */}

            <a
              href="#"
              className="mobile-nav-toggler"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasMenu"
            >
              <span className="flaticon-menu-1"></span>
            </a>
            {/* right humberger menu */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileMenu;
