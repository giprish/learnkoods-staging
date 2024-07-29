"use client";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LoginWithSocial from "./LoginWithSocial";
import Form from "./FormContent";
import Link from "next/link";
import SigninWithSocial from "./SigninWithSocial";
import { useEffect, useState } from "react";

const Register = ({ hideModal }) => {
  return (
    <div className="form-inner">
      <h3>Create a Free LearnKoods Account</h3>

      <Tabs>
        {/* <div className="form-group register-dual">
          <TabList className="btn-box row">
            <Tab className="col-lg-6 col-md-12">
              <button
                className="theme-btn btn-style-four"
                onClick={() => setUserType("candidate")}
              >
                <i className="la la-user"></i> Candidate
              </button>
            </Tab>

            <Tab className="col-lg-6 col-md-12">
              <button
                className="theme-btn btn-style-four"
                onClick={() => setUserType("employer")}
              >
                <i className="la la-briefcase"></i> Employer
              </button>
            </Tab>
          </TabList>
        </div> */}

        <TabPanel>
          <Form hideModal={hideModal} />
        </TabPanel>
        {/* End cadidates Form */}

        <TabPanel>
          <Form hideModal={hideModal} />
        </TabPanel>
        {/* End Employer Form */}
      </Tabs>
      {/* End form-group */}

      <div className="bottom-box">
        <div className="text">
          Already have an account?{" "}
          <Link
            href="#"
            className="call-modal login"
            data-bs-toggle="modal"
            data-bs-dismiss="modal"
            data-bs-target="#loginPopupModal"
          >
            LogIn
          </Link>
        </div>
        <div className="divider">
          <span>or</span>
        </div>
        <SigninWithSocial />
      </div>
      {/* End bottom-box LoginWithSocial */}
    </div>
  );
};

export default Register;
