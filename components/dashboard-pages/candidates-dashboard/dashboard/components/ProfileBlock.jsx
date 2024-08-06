import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const ProfileBlock = () => {
  const [userId, setUserId] = useState("");
  const [access, setAccess] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
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
      <div className="skill-div">
        {user?.data?.skills.map((item, index) => (
          <div className="theme-btn btn-style-new mt-2 mx-2" key={index}>
            {item.data}
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileBlock;
