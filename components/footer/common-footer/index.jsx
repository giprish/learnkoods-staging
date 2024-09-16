import FooterContent3 from "../FooterContent3";
import Social from "./Social";

const index = ({ footerStyle = "" }) => {
  return (
    <footer className={`main-footer ${footerStyle}`}>
      <div className="auto-container">
        {/* <!--Widgets Section--> */}
        <div
          className="widgets-section"
          //  data-aos="fade-up"
        >
          <div className="row">
            <div className="big-column col-xl-4 col-lg-3 col-md-12">
              <div className="footer-column about-widget">
                <div className="logo">
                  <a href="/">
                    <h2>
                      <b>SkillThrive</b>
                    </h2>
                  </a>
                </div>
                {/* <p className="phone-num">
                  <span>Call us </span>
                  <a href="thebeehost@support.com">123 456 7890</a>
                </p> */}
                <p className="address">
                  167-169 Great Portland Street,
                  <br />
                  5th Floor, London, W1W 5PF
                  <br />
                </p>
                <p className="address" style={{ marginTop: "10px" }}>
                  <a href="mailto:support@SkillThrive.com" className="email">
                    ✉ support@SkillThrive.com
                  </a>
                </p>
                {/* <p className="address" style={{marginTop:'10px'}}>
                  <a href="tel:+1 234-567-8910" className="phone">
                    ✆ +1 234-567-8910
                  </a>
                </p> */}
                <div className="social-links">
                  <Social />
                </div>
              </div>
            </div>
            {/* End footer left widget */}

            <div className="big-column col-xl-8 col-lg-9 col-md-12">
              <div className="row">
                <FooterContent3 />
              </div>
            </div>
            {/* End col-xl-8 */}
          </div>
          <div className="text-center text-white">
            <hr style={{ margin: "0 0 1rem 0" }} />© Copyright 2024 SkillThrive
            | All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
    //   {/* <!-- End Main Footer --> */}
  );
};

export default index;
