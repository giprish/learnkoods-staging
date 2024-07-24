import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Select from "react-select";

const BreadCrumb = ({ title }) => {
  return (
    <div className="upper-title-box">
      <h3>{title}</h3>
      <div className="text">Ready to jump back in?</div>
    </div>
  );
};

export default BreadCrumb;
