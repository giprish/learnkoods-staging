import React from "react";
import Seo from "../../components/common/Seo";
import CodeEditor from "@/components/codeEditor/CodeEditor";
import LoginPopup from "@/components/common/form/login/LoginPopup";
import DefaulHeader2 from "@/components/header/DefaulHeader2";
import MobileMenu from "@/components/header/MobileMenu";

const index = () => {
  return (
    <>
      <Seo pageTitle="Code Editor" />

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader2 />
      {/* End Header with upload cv btn */}

      <MobileMenu />
      {/* End MobileMenu */}
      <section className="editor-section bg-light mt-5">
        <div className="auto-container">
          <div className="row">
            <CodeEditor />
          </div>
        </div>
      </section>
    </>
  );
};

export default index;
