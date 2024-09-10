"use client";

import Link from "next/link.js";
import jobs from "../../../../../data/job-featured.js";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const AICoursesTable = () => {
  const [userId, setUserId] = useState(null);
  const [access, setAccess] = useState(null);
  const [skills, setSkills] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = window.localStorage.getItem("id");
      const access = window.localStorage.getItem("access");
      const skills = window.localStorage.getItem("skills");
      setUserId(userId);
      setAccess(access);
      setSkills(skills);
    }
  }, []);

  const [postSkills, setPostSkills] = useState("");

  useEffect(() => {
    if (skills !== undefined) {
      setPostSkills(
        JSON.parse(skills)
          ?.map((skill) => skill.data)
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

  const { data: aiJobs } = useQuery({
    queryKey: ["aiJobs"],
    queryFn: () => fetchaiJobs(),
  });

  // console.log(aiJobs, "ai recommended jobs");
  return (
    <div className="tabs-box">
      <div className="widget-title">
        {/* <h4>My Applied Jobs</h4>

        <div className="chosen-outer">
          <select className="chosen-single form-select">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Last 16 Months</option>
            <option>Last 24 Months</option>
            <option>Last 5 year</option>
          </select>
        </div> */}
      </div>
      {/* End filter top bar */}

      {/* Start table widget content */}
      <div className="widget-content">
        <div className="table-outer">
          <div className="table-outer">
            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                </tr>
              </thead>

              <tbody>
                {aiJobs?.["Recommend Course"]?.map((item) => {
                  return (
                    <tr key={item.job_id}>
                      <td>
                        {/* <Link href={`/job-single-v1/${item?.id}`}> */}
                        <h5>{item.course_title}</h5>
                        {/* </Link> */}
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

export default AICoursesTable;
