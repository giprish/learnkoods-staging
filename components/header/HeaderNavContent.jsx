"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { store } from "@/app/store";

const HeaderNavContent = () => {
  const [student, setStudent] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [profileImage, setProfileImage] = useState("/images/logo.svg");

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

      // setAccessToken(null);
    }

    toast.success("User logged out successfully", {
      position: toast.POSITION.TOP_CENTER,
    });
    router.push("/");
  };

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
            <li>
              {accessToken ? (
                <a href="#" className="" onClick={unifiedLogout}>
                  Logout
                </a>
              ) : (
                <a
                  href="#"
                  className=""
                  data-bs-toggle="modal"
                  data-bs-target="#loginPopupModal"
                >
                  Login / Register
                </a>
              )}
            </li>
            <li>
              <a href="/employers-list/employers-list-v1">
                <span>Employers</span>
              </a>
            </li>
            <li>
              {accessToken && (
                <div className="dashboard-option">
                  <Link href={href()} className="">
                    <Image
                      alt="avatar"
                      className="rounded-circle"
                      src={profileImage}
                      width={50}
                      height={50}
                    />
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default HeaderNavContent;
