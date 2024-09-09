import React from "react";
import Seo from "../../components/common/Seo";
import Paypal from "../../components/paypal/index";

const index = () => {
  return (
    <>
      <Seo pageTitle="Payment" />
      <Paypal />
    </>
  );
};

export default index;
