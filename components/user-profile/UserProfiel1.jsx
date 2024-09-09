"use client";

import LoginPopup from "../common/form/login/LoginPopup";
import FooterDefault from "../footer/common-footer";
import DefaulHeader2 from "../header/DefaulHeader2";
import MobileMenu from "../header/MobileMenu";
import { useEffect, useState } from "react";
import Image from "next/image";
import ProfilePopup from "../profile/ProfilePopup";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const index = () => {
  const [access, setAccessToken] = useState(null);
  const [id, setId] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccessToken(window.localStorage.getItem("access"));
      setId(window.localStorage.getItem("id"));
      setStudent(localStorage.getItem("student"));
    }
  }, []);

  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/usr_pro_id/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { data: user } = useQuery({
    queryKey: ["data", access],
    queryFn: () => fetchData(),
    enabled: !!access && student === "true",
  });

  return (
    <>
      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader2 />
      {/* End Header with upload cv btn */}

      <MobileMenu />
      {/* End MobileMenu */}

      <ProfilePopup user={user?.user} />
      <section
        className="job-categories ui-job-categories border"
        id="job-categories"
      >
        <div className="row ">
          <section className="col-2 side-menu">
            <div className="d-flex flex-column">
              <a href="#" className="theme-btn btn-style-three call-modal">
                Profile
              </a>

              <a href="#" className="theme-btn btn-style-three call-modal">
                Registration
              </a>
              <a href="#" className="theme-btn btn-style-three call-modal">
                Settings
              </a>
              <a href="#" className="theme-btn btn-style-three call-modal">
                Job-Course
              </a>
              <Link
                href={`/update-profile/${id}`}
                className="theme-btn btn-style-three call-modal"
              >
                Edit Profile
              </Link>
              {/* <a
                href="#"
                className="theme-btn btn-style-three call-modal"
                data-bs-toggle="modal"
                data-bs-target="#profilePopupModal"
              >
                Edit Profile
              </a> */}
            </div>
          </section>
          <section className="col-10 detail-section border bg-green">
            <div class="row">
              <div class="col-6 ">
                <div className="d-flex flex-column border m-2 my-4 justify-content-start">
                  <Image
                    width={140}
                    height={140}
                    src={user?.profile_image}
                    className="ps-4 mt-3"
                    alt="hero image"
                  />
                  <span className="ms-5 my-3">{user?.user?.username}</span>
                  <div className="mx-4 border-top border-bottom d-flex justify-content-between">
                    <span className="mx-2 py-3">View Resume</span>
                  </div>
                  <div className="mx-4 border-top border-bottom d-flex justify-content-between">
                    <span className="mx-2 py-3">Full Name</span>
                    <span className="mx-2 py-3">{user?.user?.full_name}</span>
                  </div>
                  <div className="mx-4 border-top border-bottom d-flex justify-content-between">
                    <span className="mx-2 py-3">Email</span>
                    <span className="mx-2 py-3">{user?.user?.email}</span>
                  </div>
                  <div className="mx-4 border-top border-bottom d-flex justify-content-between">
                    <span className="mx-2 py-3">Phone</span>
                    <span className="mx-2 py-3">{user?.phone}</span>
                  </div>
                  <div className="mx-4 border-top border-bottom d-flex justify-content-between">
                    <span className="mx-2 py-3">Gender</span>
                    <span className="mx-2 py-3">{user?.gender}</span>
                  </div>
                  <div className="mx-4 border-top border-bottom d-flex justify-content-between">
                    <span className="mx-2 py-3">Institution/Organization</span>
                    <span className="mx-2 py-3">{user?.institution}</span>
                  </div>
                  <div className="mx-4 border-top border-bottom d-flex justify-content-between">
                    <span className="mx-2 py-3">Resume Data</span>
                    <input
                      type="text"
                      className="border rounded my-2"
                      value={user?.resume_data}
                    />
                  </div>
                </div>
                <div className="d-flex flex-column border m-2 my-4 ">
                  <span className="mx-4 p-1">Skills</span>
                  <div className="p-2 ">
                    {user?.skills?.map((skill, index) => {
                      return (
                        <span className="border rounded p-1 mx-4 px-2">
                          {skill?.data}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="d-flex flex-column border m-2 my-4 ">
                  <span className="mx-4">About</span>
                  <span className="mx-4">About</span>
                </div>
                <div className="d-flex flex-column border m-2 my-4 ">
                  <span className="mx-4">Work At</span>
                  <span className="mx-4">{user?.work_at}</span>
                </div>
                <div className="d-flex flex-column border m-2 my-4 ">
                  <span className="mx-4">Position</span>
                  <span className="mx-4">{user?.position?.name}</span>
                </div>
              </div>
              <div class="col-6">
                This div takes the remaining half of the parent element's width
                Add your content here
              </div>
            </div>
          </section>
        </div>
      </section>
      {/* End Job Categorie Section */}

      {/* <!-- End Call To Action --> */}

      <FooterDefault />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default index;
