import MobileMenu from "../header/MobileMenu";
import LoginPopup from "../common/form/login/LoginPopup";
import DefaulHeader2 from "../header/DefaulHeader2";
import Script from "next/script";

const IndexPage = () => {
  const selectedPlan = {
    name:
      localStorage.getItem("student") === "true"
        ? "Student Plan"
        : "Employer Plan",
    price:
      localStorage.getItem("student") === "true" ? "$10/month" : "$30/month",
    benefits:
      localStorage.getItem("student") === "true"
        ? [
            "Access to student jobs",
            "Resume building tools",
            "Monthly webinars",
          ]
        : ["Job postings", "Resume search", "Company branding"],
  };

  return (
    <>
      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader2 />
      {/* End Header with upload cv btn */}

      <MobileMenu />
      {/* End MobileMenu */}

      <section className="payment-section ">
        <div className="container">
          <div className="payment-form d-flex flex-column align-items-center">
            <div className="col-lg-6 border rounded-4 p-4">
              <h2>Selected Plan: {selectedPlan.name}</h2>
              <p>Price: {selectedPlan.price}</p>
            </div>

            <div className="col-lg-6 mt-5">
              <h2>If you already have a PayPal account:</h2>
              <p className="my-2">Click the button below to pay with PayPal.</p>

              {/* <Script
                src="https://www.paypal.com/sdk/js?client-id=AdsXcCsob5S29OyshWfQviL8Fz7bmDqG7cFxk2G88nt_-NR31IBcdxXmXOtTPfJfgbeL5aUqrdCRRsL0&vault=true&intent=subscription"
                strategy="lazyOnload"
                onLoad={() => {
                  if (window.paypal) {
                    window.paypal
                      .Buttons({
                        style: {
                          shape: "rect",
                          color: "gold",
                          layout: "vertical",
                          label: "subscribe",
                        },
                        createSubscription: function (data, actions) {
                          return actions.subscription.create({
                            plan_id:
                              localStorage.getItem("student") === "true"
                                ? "P-7UG8450201529235HM3M24OY" // student plan id
                                : "P-92X34000FH3458811M3V4NQI", // employer plan id
                          });
                        },
                        onApprove: function (data, actions) {
                          alert(
                            "You have successfully subscribed to " +
                              data.subscriptionID
                          );
                        },
                      })
                      .render("#paypal-button-container");
                  }
                }}
              /> */}

              <div id="paypal-button-container"></div>

              <div id="paypal-button-container" className="mt-4"></div>

              <Script
                src="https://www.paypal.com/sdk/js?client-id=AdsXcCsob5S29OyshWfQviL8Fz7bmDqG7cFxk2G88nt_-NR31IBcdxXmXOtTPfJfgbeL5aUqrdCRRsL0&vault=true&intent=subscription"
                strategy="lazyOnload"
                onLoad={() => {
                  if (window.paypal) {
                    window.paypal
                      .Buttons({
                        createSubscription: function (data, actions) {
                          return actions.subscription.create({
                            plan_id:
                              localStorage.getItem("student") === "true"
                                ? "P-7UG8450201529235HM3M24OY" // student plan id
                                : "P-1AJ82536CF083471TM3MYKIQ", // employer plan id
                          });
                        },
                        onApprove: function (data, actions) {
                          alert(
                            "You have successfully subscribed to " +
                              data.subscriptionID
                          );
                        },
                      })
                      .render("#paypal-button-container");
                  }
                }}
              />
              <Script />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default IndexPage;
