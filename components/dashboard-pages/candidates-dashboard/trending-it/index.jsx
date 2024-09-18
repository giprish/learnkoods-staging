import MobileMenu from "../../../header/MobileMenu";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import MenuToggler from "../../MenuToggler";
import TrendingITJobs from "./components/TrendingITjobs";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadingSpinner from "@/components/loader";
import { useQuery } from "@tanstack/react-query";

const fetchRSSFeed = async () => {
  const { data } = await axios.get("https://techcrunch.com/feed/", {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
  return data;
};

const parseXML = (data) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, "application/xml");
  const items = xml.querySelectorAll("item");
  const feedItems = [];

  items.forEach((item) => {
    const title = item.querySelector("title").textContent;
    const link = item.querySelector("link").textContent;
    const description = item.querySelector("description").textContent;

    feedItems.push({ title, link, description });
  });

  return feedItems;
};

const index = () => {
  const { shortSidebar: isSidebarCollapsed } = useSelector(
    (state) => state.toggle
  );

  const { data, error, isLoading } = useQuery({
    queryKey: ["rssFeed"],
    queryFn: () => fetchRSSFeed(),
    select: parseXML,
  });

  return (
    <div
      className={`page-wrapper dashboard ${
        isSidebarCollapsed ? "dashboard-collapsed" : ""
      }`}
    >
      <span className="header-span"></span>

      <LoginPopup />

      <DashboardCandidatesHeader />

      <MobileMenu />

      <DashboardCandidatesSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Trending jobs in IT!" />

          <MenuToggler />

          {isLoading && <LoadingSpinner />}
          {error && <p>Error fetching RSS feed: {error.message}</p>}
          <div>
            {data &&
              data.map((item, index) => (
                <div key={index}>
                  <h2>
                    <a href={item.link}>{item.title}</a>
                  </h2>
                  <p dangerouslySetInnerHTML={{ __html: item.description }} />
                </div>
              ))}
          </div>
          {/* <div className="row">
            <div className="col-lg-12">
           
              <div className="ls-widget">
                <TrendingITJobs />
              </div>
            </div>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default index;
