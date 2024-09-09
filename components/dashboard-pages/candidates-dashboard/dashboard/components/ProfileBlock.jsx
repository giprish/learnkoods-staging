import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const ProfileBlock = () => {
  const [userId, setUserId] = useState("");
  const [access, setAccess] = useState(null);
  const [student, setStudent] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("id"));
      setAccess(localStorage.getItem("access"));
      setStudent(localStorage.getItem("student"));
    }
  }, []);

  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/usr_pro_id/${userId}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { data: user } = useQuery({
    queryKey: ["user", access, userId],
    queryFn: () => fetchData(),
    enabled: !!access && student === "true",
  });
  return (
    <>
      <div className="skill-div mx-2">
        {user?.data?.skills.slice(0, 6).map((item, index) => (
          <div className="theme-btn btn-style-new-skill mt-2 mx-2" key={index}>
            {item.data}
          </div>
        ))}
      </div>
      {user?.data?.skills?.length > 6 ? (
        // Render this if there are more than 3 items
        <button className="theme-btn btn-style-blue mx-3 my-1">
          <a data-bs-toggle="modal" data-bs-target="#skillModal">
            Show more ...
          </a>
        </button>
      ) : (
        <></>
      )}

      <div
        className="modal fade"
        id="skillModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered ">
          <div className="apply-modal-content modal-content">
            <div className="text-center">
              <h3 className="title">Your Skills</h3>
              <button
                type="button"
                className="closed-modal"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {/* End modal-header */}

            <div className="modal-body">
              <ul>
                {user?.data?.skills?.map((val, i) => (
                  <li key={i} className="border rounded-2 my-2">
                    <span className="p-3">{val?.data}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* End .send-private-message-wrapper */}
        </div>
      </div>
    </>
  );
};

export default ProfileBlock;
