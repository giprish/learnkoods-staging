import Link from "next/link";
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const JobFavouriteTable = () => {
  const router = useRouter();
  const access = window.localStorage.getItem("access");
  const id = window.localStorage.getItem("id");

  const fetchShortlisted = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/user-shortlist/${id}/`,
      {
        headers: { Authorization: `Bearer ${access}` },
      }
    );
    return response.data.data;
  };

  const { data: shortjobs } = useQuery({
    queryKey: ["shortlistedjobs", access],
    queryFn: fetchShortlisted,
    enabled: !!access,
  });

  console.log(shortjobs);

  return (
    <div className="tabs-box">
      <div className="widget-title">
        {/* <h4>My Favorite Jobs</h4> */}
        {/* Optional filter or title */}
      </div>

      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Date Applied</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {shortjobs?.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="job-block">
                      <div className="inner-box">
                        <div className="content">
                          <span className="company-logo">
                            <img src={item.company.logo} alt="logo" />
                          </span>
                          <h4>
                            <Link href={`/job-single/${item.job.id}`}>
                              {item.job.job_title}
                            </Link>
                          </h4>
                          <ul className="job-info">
                            <li>
                              <span className="icon flaticon-briefcase"></span>
                              {item.company?.name || "Unknown Company"}
                            </li>
                            <li>
                              <span className="icon flaticon-map-locator"></span>
                              {item.company?.city}, {item.company?.country}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{new Date(item.applied_date).toLocaleDateString()}</td>
                  <td className={`status ${!item.is_shortlist || item.is_rejected ? "text-danger" : ""}`}>
                    {item.is_rejected
                      ? "Rejected"
                      : item.is_shortlist
                        ? "Shortlisted"
                        : "Not Shortlisted"}
                  </td>
                  <td>
                    <div className="option-box">
                      <ul className="option-list">
                        <li>
                          <button data-text="View" onClick={() => { router.push(`/job-single/${item.job.id}`); }}>
                            <span className="la la-eye"></span>
                          </button>
                        </li>
                        <li>
                          <button data-text="Delete">
                            <span className="la la-trash"></span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobFavouriteTable;
