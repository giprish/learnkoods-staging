import Link from "next/link";
// import jobs from "../../../data/job-featured";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  addDatePosted,
  addDestination,
  addKeyword,
  addLocation,
  addPerPage,
  addSalary,
  addSort,
  addTag,
  clearExperience,
  clearJobType,
} from "../../../features/filter/filterSlice";
import {
  clearDatePostToggle,
  clearExperienceToggle,
  clearJobTypeToggle,
} from "../../../features/job/jobSlice";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";

const FilterJobsBox = () => {
  const dispatch = useDispatch();
  const [jobs, setJobs] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState("");
  const [prevPageUrl, setPrevPageUrl] = useState("");
  const { jobList, jobSort } = useSelector((state) => state.filter);
  const {
    keyword,
    location,
    destination,
    category,
    jobType,
    datePosted,
    experience,
    salary,
    tag,
  } = jobList || {};

  const { sort, perPage } = jobSort;

  const originalUrl = `${process.env.GLOBAL_API}/jobs_api/`;

  const generateUrl = () => {
    let url = originalUrl;
    const params = [];

    // Check if sortBy exists
    if (sort && sort !== "default") {
      params.push(`date=${sort}`);
    }

    // Check if keywords exist
    if (keyword) {
      params.push(`name=${keyword}`);
    }

    // Check if location exists
    if (location) {
      params.push(`location=${location}`);
    }

    // Check if destination exists
    // if (destination) {
    //   params.push(`destination=${destination}`);
    // }

    // Check if category exists
    /* if (category) {
      params.push(`category=${category}`);
    } */

    // Check if jobType exists
    /* if (jobType) {
      params.push(`jobType=${jobType}`);
    } */

    // Check if datePosted exists
    /* if (datePosted) {
      params.push(`datePosted=${datePosted}`);
    } */

    // Check if experience exists
    /* if (experience) {
      params.push(`experience=${experience}`);
    } */

    // Check if salary exists
    /* if (salary) {
      params.push(`salary=${salary}`);
    } */

    // Check if tag exists
    /* if (tag) {
      params.push(`tag=${tag}`);
    } */

    // Append all parameters to the URL
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    return url;
  };

  const url = generateUrl();

  const fetchData = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  const {
    data: job,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "data",
      keyword,
      location,
      sort,
      // destination,
      // category,
      // jobType,
      // datePosted,
      // experience,
      // salary,
      // tag,
    ],
    queryFn: () => fetchData(url),
  });

  useEffect(() => {
    if (job) {
      setJobs(job?.results);
      setNextPageUrl(job?.next);
      setPrevPageUrl(job?.previous);
    }
    console.log(job);
  }, [job]);

  console.log(nextPageUrl, "nextpage");

  const fetchNextPage = () => {
    if (nextPageUrl) {
      fetchData(nextPageUrl)
        .then((res) => {
          console.log("Next page fetched:", res);
          toast.success("Next page fetched", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
          });
          setJobs(res?.results);
          setNextPageUrl(res?.next); // Update next page URL
          setPrevPageUrl(res?.previous); // Update previous page URL
        })
        .catch((error) => {
          console.error("Error fetching next page:", error);
        });
    }
  };

  const fetchPrevPage = () => {
    if (prevPageUrl) {
      fetchData(prevPageUrl)
        .then((res) => {
          console.log("Prev page fetched:", res);
          toast.success("Prev page fetched", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
          });
          setJobs(res?.results);
          setNextPageUrl(res?.next); // Update next page URL
          setPrevPageUrl(res?.previous); // Update previous page URL
        })
        .catch((error) => {
          console.error("Error fetching previous page:", error);
        });
    }
  };

  let content = jobs?.map((item) => {
    const dates = new Date(item.created_at);
    const localDateString = dates.toLocaleDateString();
    return (
      <div className="job-block" key={item.id}>
        <div className="inner-box">
          <div className="content">
            <span className="company-logo">
              <Image
                width={50}
                height={49}
                src={item?.company?.logo}
                alt="item brand"
              />
            </span>
            <h4>
              <Link href={`/job-single-v1/${item.job_id}`}>
                {item.job_title}
              </Link>
            </h4>

            <ul className="job-info">
              <li>
                <span className="icon flaticon-briefcase"></span>
                {item?.company?.name}
              </li>
              {/* compnay info */}
              <li>
                <span className="icon flaticon-map-locator"></span>
                {item?.city?.name}
              </li>
              {/* location info */}
              <li>
                <span className="icon flaticon-clock-3"></span>{" "}
                {localDateString}
              </li>
              {/* time info */}
              <li>
                <span className="icon flaticon-money"></span> {item?.min_salary}{" "}
                $-{item?.max_salary} $
              </li>
              {/* salary info */}
            </ul>
            {/* End .job-info */}
            <ul className="job-other-info">
              <li>{item?.job_type}</li>
            </ul>

            {/* <ul className="job-other-info">
            {item?.jobType?.map((val, i) => (
              <li key={i} className={`${val.styleClass}`}>
                {val.type}
              </li>
            ))}
          </ul> */}
            {/* End .job-other-info */}

            <button className="bookmark-btn">
              <span className="flaticon-bookmark"></span>
            </button>
          </div>
        </div>
      </div>
    );

    // End all jobs
  });

  // console.log(content, "content");

  // sort handler
  const sortHandler = (e) => {
    dispatch(addSort(e.target.value));
  };

  // per page handler
  const perPageHandler = (e) => {
    const pageData = JSON.parse(e.target.value);
    dispatch(addPerPage(pageData));
  };

  // clear all filters
  const clearAll = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addDestination({ min: 0, max: 100 }));
    dispatch(addCategory(""));
    dispatch(clearJobType());
    dispatch(clearJobTypeToggle());
    dispatch(addDatePosted(""));
    dispatch(clearDatePostToggle());
    dispatch(clearExperience());
    dispatch(clearExperienceToggle());
    dispatch(addSalary({ min: 0, max: 20000 }));
    dispatch(addTag(""));
    dispatch(addSort(""));
    dispatch(addPerPage({ start: 0, end: 0 }));
  };

  return (
    <>
      <div className="ls-switcher">
        <div className="show-result">
          <div className="show-1023">
            <button
              type="button"
              className="theme-btn toggle-filters "
              data-bs-toggle="offcanvas"
              data-bs-target="#filter-sidebar"
            >
              <span className="icon icon-filter"></span> Filter
            </button>
          </div>
          {/* Collapsible sidebar button */}

          <div className="text">
            Show <strong>{content?.length}</strong> jobs
          </div>
        </div>
        {/* End show-result */}

        <div className="sort-by">
          {keyword !== "" ||
          location !== "" ||
          destination?.min !== 0 ||
          destination?.max !== 100 ||
          category !== "" ||
          jobType?.length !== 0 ||
          datePosted !== "" ||
          experience?.length !== 0 ||
          salary?.min !== 0 ||
          salary?.max !== 20000 ||
          tag !== "" ||
          sort !== "" ||
          perPage.start !== 0 ||
          perPage.end !== 0 ? (
            <button
              onClick={clearAll}
              className="btn btn-danger text-nowrap me-2"
              style={{ minHeight: "45px", marginBottom: "15px" }}
            >
              Clear All
            </button>
          ) : undefined}

          <select
            value={sort}
            className="chosen-single form-select"
            onChange={sortHandler}
          >
            <option value="default">Sort by (default)</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          {/* End select */}

          <select
            onChange={perPageHandler}
            className="chosen-single form-select ms-3 "
            value={JSON.stringify(perPage)}
          >
            <option
              value={JSON.stringify({
                start: 0,
                end: 0,
              })}
            >
              All
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 10,
              })}
            >
              10 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 20,
              })}
            >
              20 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 30,
              })}
            >
              30 per page
            </option>
          </select>
          {/* End select */}
        </div>
      </div>
      {/* End top filter bar box */}
      {content}
      {/* <!-- List Show More --> */}
      <div class="d-flex justify-content-between">
        {prevPageUrl && (
          <button
            class="btn border border-danger rounded p-2 px-4 text-danger bg-danger bg-opacity-10"
            onClick={fetchPrevPage}
          >
            Previous
          </button>
        )}

        {nextPageUrl && (
          <button
            class="btn border border-success rounded p-2 px-4 text-success bg-success bg-opacity-10"
            onClick={fetchNextPage}
          >
            Next
          </button>
        )}
      </div>

      <div className="ls-show-more">
        <p>Show 36 of 497 Jobs</p>
        <div className="bar">
          <span className="bar-inner" style={{ width: "40%" }}></span>
        </div>
        <button className="show-more">Show More</button>
      </div>
    </>
  );
};

export default FilterJobsBox;
