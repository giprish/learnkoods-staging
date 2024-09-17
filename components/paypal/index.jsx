import MobileMenu from "../header/MobileMenu";
import LoginPopup from "../common/form/login/LoginPopup";
import DefaulHeader2 from "../header/DefaulHeader2";
import Script from "next/script";

const IndexPage = () => {
  return (
    <>
      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader2 />
      {/* End Header with upload cv btn */}

      <MobileMenu />
      {/* End MobileMenu */}

      <section className="payment-section">
        <div className="container">
          {/* PayPal Script for Subscription */}
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
          <div id="paypal-button-container"></div>
        </div>
      </section>
    </>
  );
};

export default IndexPage;
