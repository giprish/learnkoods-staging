"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderNavContent from "./HeaderNavContent";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { UserAuth } from "@/context/AuthContext";

const DefaulHeader2 = () => {
  const [navbar, setNavbar] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
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
