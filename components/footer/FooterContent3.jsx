"use client";

import footerContent from "../../data/footerContent";
import CheckLink from "../check-link/CheckLink";
import { useEffect, useState } from "react";

const checkUserPermissions = (route) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUser(window.localStorage.getItem("student"));
    }
  }, []);
  // Example user object, replace with actual user data
  if (route.startsWith("/employers-")) {
    return user === "false";
  } else if (route.startsWith("/candidates-")) {
    return user === "true";
  }
};

const FooterContent3 = () => {
  return (
    <>
      {footerContent.slice(0, 4)?.map((item) => (
        <div
          className="footer-column col-lg-3 col-md-6 col-sm-12"
          key={item.id}
        >
          <div className="footer-widget links-widget">
            <h4 className="widget-title">{item.title}</h4>
            <div className="widget-content">
              <ul className="list">
                {item?.menuList?.map((menu, i) => (
                  <li key={i}>
                    <CheckLink
                      href={menu.route}
                      checkUserPermissions={checkUserPermissions}
                    >
                      {menu.name}
                    </CheckLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FooterContent3;
