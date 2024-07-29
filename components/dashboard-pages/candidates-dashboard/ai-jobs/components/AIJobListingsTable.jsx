"use client";

import Link from "next/link.js";
import jobs from "../../../../../data/job-featured.js";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AIJobListingsTable = () => {
  const userId = window.localStorage.getItem("id");
  const access = window.localStorage.getItem("access");
  const skills = window.localStorage.getItem("skills");
  const [postSkills, setPostSkills] = useState("");

  useEffect(() => {
    if (skills !== undefined) {
      setPostSkills(
        JSON.parse(skills)
          .map((skill) => skill.data)
          .join(", ")
      );
    }
  }, [skills]);
  const skillToSend = {
    input: postSkills,
  };
  const fetchaiJobs = async () => {
    const resposne = await axios.post(
      `${process.env.GLOBAL_API}/api-ai/`,
      skillToSend,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    return resposne.data;
  };

  const {
    data: aiJobs,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["aiJobs"],
    queryFn: () => fetchaiJobs(),
  });

  const handleRefetch = async () => {
    try {
      await refetch({ throwOnError: true });
      toast.success("AI Jobs successfully refreshed!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error("Refetch failed:", error);
    }
  };
  // console.log(aiJobs, "ai recommended jobs");
  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>AI Jobs List</h4>

        <div className="chosen-outer">
          <button className="theme-btn btn-style-one" onClick={handleRefetch}>
            Refresh
          </button>
        </div>
      </div>
      {/* End filter top bar */}

      {/* Start table widget content */}
      <div className="widget-content">
        <div className="table-outer">
          <div className="table-outer">
            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                </tr>
              </thead>

              <tbody>
                {aiJobs?.["Recommend Job"]?.map((item) => {
                  return (
                    <tr key={item.job_id}>
                      <td>
                        <Link href={`/job-single-v1/${item?.id}`}>
                          <h5>{item.job_title}</h5>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* End table widget content */}
    </div>
  );
};

export default AIJobListingsTable;
