import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const ProfileBlock = () => {
  const [username, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [access, setAccess] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserName(localStorage.getItem("user"));
      setUserId(localStorage.getItem("id"));
      setAccess(localStorage.getItem("access"));
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
  });
  console.log(user?.data?.skills);
  return (
    <>
      <div className="ui-block col-xl-6 col-lg-6 col-md-6 col-sm-12 border rounded-4 mb-4 ml-2 shadow">
        <div className="m-3 ">
          <h4 className="font-weight-bold">Skills</h4>
        </div>
        {user?.data?.skills.map((item, index) => {
          return (
            <div className="theme-btn btn-style-new mt-2 mx-2" key={index}>
              {item.data}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProfileBlock;
