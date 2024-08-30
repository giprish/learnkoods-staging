import MobileMenu from "../header/MobileMenu";
import LoginPopup from "../common/form/login/LoginPopup";
import DefaulHeader2 from "../header/DefaulHeader2";

const index = () => {
  return (
    <>
      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader2 />
      {/* End Header with upload cv btn */}

      <MobileMenu />
      {/* End MobileMenu */}

      <section className="coming-section">
        <div className="auto-container">
          <div className="row">
            <h1>Go to the following link for a quick assessment!</h1>
          </div>

          <div>
            <a href="https://docs.google.com/document/d/1G9HpGklwiNQGB20JxVpGSdX0CqIeg_Gdnef5n7zvuVU/edit">
              https://docs.google.com/document/d/1G9HpGklwiNQGB20JxVpGSdX0CqIeg_Gdnef5n7zvuVU/edit
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default index;
