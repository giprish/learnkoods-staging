"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderNavContent from "./HeaderNavContent";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { UserAuth } from "@/context/AuthContext";
import candidatesMenuData from "@/data/candidatesMenuData";
import { isActiveLink } from "@/utils/linkActiveChecker";
import { set } from "react-hook-form";

const DefaulHeader2 = () => {
  const { user, logOut } = UserAuth();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setStudent(localStorage.getItem("student"));
    }
  }, []);

  const [navbar, setNavbar] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [profileImage, setprofileImage] = useState("/images/logo-2.svg");
  const { fetchedUser } = UserAuth();
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccessToken(localStorage.getItem("access"));
    }

    setprofileImage(fetchedUser?.data?.profile_image);

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
    // if (user) {
    //   try {
    //     await logOut();
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    if (accessToken) {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }

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
      } shadow `}
    >
      {/* <!-- Main box --> */}
      <div className="main-box">
        {/* <!--Nav Outer --> */}
        <div className="nav-outer ">
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
                  <strong>Learnkoods</strong>
                </h2>
              </Link>
            </div>
          </div>
          <HeaderNavContent accessToken={accessToken} />
          {/* <!-- Main Menu End--> */}
        </div>
      </div>
    </header>
  );
};

export default DefaulHeader2;
