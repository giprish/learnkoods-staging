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
                <Link href="https://skillthrive.io/">
                  <img
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
            {!accessToken && (
              <li className="nav-item signin-menu">
                <Link href={"/login"}>
                  <div className="theme-btn btn-style-blue">
                    <i className="las la-sign-in-alt "></i>
                  </div>
                </Link>
              </li>
            )}

            {!accessToken && (
              <li className="nav-item">
                <Link href={"/register"}>
                  <div className="theme-btn btn-style-blue">
                    <i className="las la-user-plus"></i>
                  </div>
                </Link>
              </li>
            )}

            {accessToken && (
              <li>
                <div
                  className="theme-btn btn-style-blue"
                  onClick={unifiedLogout}
                >
                  Logout
                </div>
              </li>
            )}

            <a
              href="#"
              className="mobile-nav-toggler"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasMenu"
            >
              <span className="flaticon-menu-1"></span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileMenu;
