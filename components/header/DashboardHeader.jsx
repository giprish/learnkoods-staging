"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import employerMenuData from "../../data/employerMenuData";
import HeaderNavContent from "./HeaderNavContent";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { useRouter } from "next/router";
import { UserAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const DashboardHeader = () => {
  const [navbar, setNavbar] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setAccessToken(window.localStorage.getItem("access"));

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

  return (
    // <!-- Main Header-->
    <header
      className={`main-header header-shaddow  ${navbar ? "fixed-header " : ""}`}
    >
      <div className="container-fluid">
        {/* <!-- Main box --> */}
        <div className="main-box">
          {/* <!--Nav Outer --> */}
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link href="/">
                  <Image
                    width={200}
                    height={100}
                    src="/images/skillthrive_logo.png"
                    alt="brand"
                  />
                  <h2>{/* <strong>SkillThrive</strong> */}</h2>
                </Link>
              </div>
            </div>
            {/* End .logo-box */}

            <HeaderNavContent />
            {/* <!-- Main Menu End--> */}
          </div>
          {/* End .nav-outer */}

          {/* <div className="outer-box">
            <button className="menu-btn">
              <span className="count">1</span>
              <span className="icon la la-heart-o"></span>
            </button>
           

            <button className="menu-btn">
              <span className="icon la la-bell"></span>
            </button>
           

         
            <div className="dropdown dashboard-option ">
              <a
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Image
                  alt="avatar"
                  className="thumb"
                  src={`${process.env.GLOBAL_API}${window.localStorage.getItem(
                    "profile_image"
                  )}`}
                  width={50}
                  height={50}
                />
                <span className="name">My Account</span>
              </a>

              <ul className="dropdown-menu ">
                {employerMenuData.map((item) => (
                  <li
                    className={`${
                      isActiveLink(item.routePath, router.asPath)
                        ? "active"
                        : ""
                    } mb-1`}
                    key={item.id}
                  >
                    {item.name === "Logout" ? (
                      <Link href={item.routePath} onClick={unifiedLogout}>
                        <i className={`la ${item.icon}`}></i> {item.name}
                      </Link>
                    ) : (
                      <Link href={item.routePath}>
                        <i className={`la ${item.icon}`}></i> {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
          </div> */}
          {/* End outer-box */}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
