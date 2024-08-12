"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderNavContent from "./HeaderNavContent";
import Image from "next/image";
import { useRouter } from "next/router";
import { UserAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const DefaulHeader = () => {
  const { user, logOut } = UserAuth();

  const [navbar, setNavbar] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [profileImage, setprofileImage] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setStudent(window.localStorage.getItem("student"));
    }
  }, []);

  const router = useRouter();
  useEffect(() => {
    setAccessToken(window.localStorage.getItem("access"));
    setprofileImage(window.localStorage.getItem("profile_image"));

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
        await logOut();
      } catch (error) {
        console.log(error);
      }
    }

    if (accessToken) {
      window.localStorage.clear();

      setAccessToken(null);
    }

    toast.success("User logged out successfully", {
      position: toast.POSITION.TOP_CENTER,
    });
    router.push("/");
  };
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
  return (
    // <!-- Main Header-->
    <header
      className={`main-header  ${
        navbar ? "fixed-header animated slideInDown" : ""
      }`}
    >
      {/* <!-- Main box --> */}
      <div className="main-box">
        {/* <!--Nav Outer --> */}
        <div className="nav-outer">
          <div className="logo-box">
            <div className="logo">
              <Link href="/">
                {/* <Image
                  width={154}
                  height={50}
                  src="/images/logo.svg"
                  alt="brand"
                /> */}
                <h2>
                  <strong>SkillThrive</strong>
                </h2>
              </Link>
            </div>
          </div>
          {/* End .logo-box */}

          <HeaderNavContent />
          {/* <!-- Main Menu End--> */}
        </div>
        {/* End .nav-outer */}

        {/* <div className="outer-box"> */}
        {/* <!-- Login/Register --> */}
        {/* <div className="btn-box">
            {user || accessToken ? (
              <a
                href="#"
                className="theme-btn btn-style-three call-modal"
                onClick={unifiedLogout}
              >
                Logout
              </a>
            ) : (
              <a
                href="#"
                className="theme-btn btn-style-three call-modal"
                data-bs-toggle="modal"
                data-bs-target="#loginPopupModal"
              >
                Login / Register
              </a>
            )}
            <Link
              href="/employers-dashboard/post-jobs"
              className="theme-btn btn-style-one"
            >
              Job Post
            </Link>
          </div> */}
        {/* {accessToken && (
            <div className="dashboard-option"> */}
        {/* <Link href={href()} className="">
                {profileImage !== undefined && (
                  <Image
                    alt="avatar"
                    className="rounded-circle"
                    src={`${window.localStorage.getItem("profile_image")}`}
                    width={50}
                    height={50}
                  />
                )}
              </Link> */}
        {/* </div>
          )} */}
        {/* </div> */}
      </div>
    </header>
  );
};

export default DefaulHeader;
