import Link from "next/link";
import { useEffect, useState } from "react";

const Header = () => {
  const [navbar, setNavbar] = useState(false);
  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  return (
    <header
      className={`main-header ${
        navbar ? "fixed-header animated slideInDown" : ""
      }`}
    >
      <div className="container-fluid">
        {/* <!-- Main box --> */}
        <div className="main-box">
          {/* <!--Nav Outer --> */}
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link href="/" className="noSticky">
                  {/* <img src="/images/logo-2.svg" alt="logo" title="brand" /> */}
                  <Image
                    width={200}
                    height={100}
                    src="/images/skillthrive_logo.png"
                    alt="brand"
                  />
                </Link>
                <Link href="/" className="isSticky">
                  {/* <img src="/images/logo.svg" alt="logo" title="brand" /> */}
                  <h2>
                    <strong>SkillThrive</strong>
                  </h2>
                </Link>
              </div>
            </div>
          </div>
          {/* End nav-outer */}

          <div className="outer-box">
            {/* <!-- Login/Register --> */}
            <div className="btn-box">
              <Link
                href="/employers-dashboard/post-jobs"
                className="theme-btn btn-style-one"
              >
                <span className="btn-title">Job Post</span>
              </Link>
            </div>
          </div>
          {/* End outer-box */}
        </div>
      </div>
    </header>
  );
};

export default Header;
