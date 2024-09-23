import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const TopCardBlock = () => {

  const access = window.localStorage.getItem("access");

  const fetchJobs = async () => {
    const response = await axios.get(`${process.env.GLOBAL_API}/dash-data-count/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return response.data;
  };

  const { data: Jobs } = useQuery({
    queryKey: ["AllJobs"],
    queryFn: () => fetchJobs(),

    enabled: !!access,
  });

  console.log(Jobs);
  
  
  const cardContent = [
    {
      id: 1,
      icon: "flaticon-briefcase",
      countNumber: `${Jobs?.job_count}`,
      metaName: "Posted Jobs",
      uiClass: "ui-blue",
    },
    {
      id: 2,
      icon: "la-file-invoice",
      countNumber: `${Jobs?.application_count}`,
      metaName: "Application",
      uiClass: "ui-red",
    },
    {
      id: 3,
      icon: "la-comment-o",
      countNumber: "74",
      metaName: "Messages",
      uiClass: "ui-yellow",
    },
    {
      id: 4,
      icon: "la-bookmark-o",
      countNumber: `${Jobs?.shortlist_count}`,
      metaName: "Shortlist",
      uiClass: "ui-green",
    },
  ];

  return (
    <>
      {cardContent?.map((item) => (
        <div
          className="ui-block col-xl-6 col-lg-6 col-md-6 col-sm-12"
          key={item.id}
        >
          <div className={`ui-item ${item.uiClass}`}>
            <div className="left">
              <i className={`icon la ${item.icon}`}></i>
            </div>
            <div className="right">
              <h4>{item.countNumber}</h4>
              <p>{item.metaName}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TopCardBlock;
