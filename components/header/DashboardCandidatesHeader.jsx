"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import candidatesMenuData from "../../data/candidatesMenuData";
import HeaderNavContent from "./HeaderNavContent";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { useRouter } from "next/router";
import { UserAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const DashboardCandidatesHeader = () => {
  const { user, logOut } = UserAuth();
  const student = window.localStorage.getItem("student");
  const imageUrl = window.localStorage.getItem("profile_image");
  const [profileImage, setProfileImage] = useState(
    "/images/default-avatar.png"
  );

  useEffect(() => {
    if (imageUrl !== "undefined") {
      setProfileImage(imageUrl);
    }
  }, [imageUrl]);

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

  const unifiedLogout = async () => {
    if (accessToken) {
      window.localStorage.clear();
      setAccessToken(null);
    }
    if (user && user !== undefined) {
      try {
        await logOut();
      } catch (error) {
        console.log(error);
      }
    }

    toast.success("User logged out successfully", {
      position: toast.POSITION.TOP_CENTER,
    });
    router.push("/");
  };
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
                  <h2>
                    <strong>Learnkoods</strong>
                  </h2>
                </Link>
              </div>
            </div>
            {/* End .logo-box */}

            <HeaderNavContent />
            {/* <!-- Main Menu End--> */}
          </div>
          {/* End .nav-outer */}

          {/* <div className="outer-box">
            
           
            <div className="dropdown dashboard-option">
              <a
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {profileImage && (
                  <Image
                    alt="avatar"
                    className="thumb"
                    src={profileImage}
                    width={50}
                    height={50}
                  />
                )}

                <span className="name">My Account</span>
              </a>

              <ul className="dropdown-menu">
                {candidatesMenuData.map((item) => (
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

export default DashboardCandidatesHeader;
