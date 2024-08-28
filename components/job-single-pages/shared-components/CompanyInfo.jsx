import axios from "axios";
import Social from "../social/Social";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const CompanyInfo = ({ jobDetails }) => {
  const access =
    typeof window !== "undefined"
      ? window.localStorage.getItem("access")
      : null;
  const fetchCompany = async (url) => {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return response.data;
  };
  const { data: Company } = useQuery({
    queryKey: ["company", jobDetails?.company?.id],
    queryFn: () =>
      fetchCompany(
        `${process.env.GLOBAL_API}/comp/${jobDetails?.company?.id}/`
      ),
  });

  console.log(Company);

  return (
    <ul className="company-info">
      <li>
        <h5 className="my-2">{Company?.data?.name || "null"}</h5>
      </li>
      <li>
        Primary industry: <span>{Company?.data?.industry?.name}</span>
      </li>
      <li>
        Company size: <span>{Company?.data?.team_size}</span>
      </li>
      <li>
        Established On: <span>{Company?.data?.since}</span>
      </li>
      {/* <li>
        Phone: <span>123 456 7890</span>
      </li> */}
      <li>
        Email: <span>{Company?.data?.email}</span>
      </li>
      <li>
        Location:{" "}
        <span>
          {Company?.data?.city?.name}, {Company?.data?.country?.name}
        </span>
      </li>
      {/* <li>
        Social media:
        <Social />
      </li> */}
    </ul>
  );
};

export default CompanyInfo;
