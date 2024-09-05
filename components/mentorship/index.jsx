import MobileMenu from "../header/MobileMenu";
import LoginPopup from "../common/form/login/LoginPopup";
import DefaulHeader2 from "../header/DefaulHeader2";
import CodeEditor from "../codeEditor/CodeEditor";

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
            <a href="/assessment/code-editor">
              <button
                className="btn btn-primary py-2 px-4 mt-3"
                style={{ fontSize: "20px" }}
              >
                Click Here
              </button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default index;
