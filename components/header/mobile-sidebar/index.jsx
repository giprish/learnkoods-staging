"use client";
import Link from "next/link";
import {
  ProSidebarProvider,
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";

import mobileMenuData from "../../../data/mobileMenuData";
import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";
import {
  isActiveLink,
  isActiveParentChaild,
} from "../../../utils/linkActiveChecker";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { menuToggle } from "@/features/toggle/toggleSlice";
import candidatesMenuData from "@/data/candidatesMenuData";
import employerMenuData from "@/data/employerMenuData";

const Index = () => {
  const router = useRouter();
  const { menu } = useSelector((state) => state.toggle);
  const accessToken = window.localStorage.getItem("access");
  const student = window.localStorage.getItem("student");
  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/usr_pro_id/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  const { data: user } = useQuery({
    queryKey: ["user", accessToken],
    queryFn: () => fetchData(),
  });
  const dispatch = useDispatch();

  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

  const unifiedLogout = async () => {
    if (accessToken) {
      window.localStorage.clear();
    }

    toast.success("User logged out successfully", {
      position: toast.POSITION.TOP_CENTER,
    });
    router.push("/");
  };

  return (
    <div
      className="offcanvas offcanvas-start mobile_menu-contnet"
      tabIndex="-1"
      id="offcanvasMenu"
      data-bs-scroll="true"
    >
      <SidebarHeader />
      {/* End pro-header */}

      {/* <ProSidebarProvider> */}
      <Sidebar>
        <Menu>
          {student === "true" &&
            candidatesMenuData.map((item) => (
              <MenuItem
                className={
                  isActiveLink(item.routePath, router.asPath)
                    ? "menu-active-link"
                    : ""
                }
                key={item.id}
              >
                {item.name === "Logout" ? (
                  <Link href={item.routePath} onClick={unifiedLogout}>
                    {item?.name}
                  </Link>
                ) : item.name === "My Resume" ? (
                  <Link
                    href={`${user?.data?.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item?.name}
                  </Link>
                ) : (
                  <Link href={item.routePath}>{item?.name}</Link>
                )}
              </MenuItem>
            ))}
          {student === "false" &&
            employerMenuData.map((item) => (
              <Link href={item.routePath}>
                <MenuItem
                  className={
                    isActiveLink(item.routePath, router.asPath)
                      ? "menu-active-link"
                      : ""
                  }
                  key={item.id}
                >
                  {item.name}
                </MenuItem>
              </Link>
            ))}
        </Menu>
      </Sidebar>
      {/* </ProSidebarProvider> */}

      <SidebarFooter />
    </div>
  );
};

export default Index;
