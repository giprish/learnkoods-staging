"use client";

import Link from "next/link";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AIJobListingsTable = () => {
  const [postSkills, setPostSkills] = useState("");
  const [username, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [access, setAccess] = useState(null);
  const [skills, setSkills] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserName(localStorage.getItem("user"));
      setUserId(localStorage.getItem("id"));
      setAccess(localStorage.getItem("access"));
      setSkills(localStorage.getItem("skills"));
    }
  }, []);

  useEffect(() => {
    if (skills !== undefined && skills !== null) {
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
    const response = await axios.post(
      `${process.env.GLOBAL_API}/api-ai/`,
      skillToSend,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    return response.data;
  };

  const {
    data: aiJobs,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["aiJobs"],
    queryFn: fetchaiJobs,
    enabled: !!postSkills, // Only run the query if postSkills is not empty
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
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Job Title</th>
              </tr>
            </thead>
            <tbody>
              {aiJobs?.["Recommend Job"]?.map((item) => (
                <tr key={item.job_id}>
                  <td>
                    <Link href={`/job-single-v1/${item?.id}`}>
                      <h5>{item.job_title}</h5>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* End table widget content */}
    </div>
  );
};

export default AIJobListingsTable;
