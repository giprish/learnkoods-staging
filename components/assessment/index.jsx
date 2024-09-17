import { useRouter } from "next/router";
import MobileMenu from "../header/MobileMenu";
import LoginPopup from "../common/form/login/LoginPopup";
import DefaulHeader2 from "../header/DefaulHeader2";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const Index = () => {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState("");
  const [filterQues, setfilterQues] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.GLOBAL_API}/asses-ques/`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const { data: que, isLoading } = useQuery({
    queryKey: ["queData"],
    queryFn: () => fetchData(),
    retry: 1,
  });

  useEffect(() => {
    // Reset filtered jobs when companyId changes
    setfilterQues([]);

    if (que) {
      if (difficulty === "Basic") {
        // Filter jobs where is_published is true (active jobs)
        setfilterQues(que?.filter((q) => q.difficulty === "Basic"));
      } else if (difficulty === "Easy") {
        // Filter jobs where is_published is false (inactive jobs)
        setfilterQues(que?.filter((q) => q.difficulty === "Easy"));
      } else if (difficulty === "Medium") {
        // Filter jobs where is_published is false (inactive jobs)
        setfilterQues(que?.filter((q) => q.difficulty === "Medium"));
      } else if (difficulty === "Hard") {
        // Filter jobs where is_published is false (inactive jobs)
        setfilterQues(que?.filter((q) => q.difficulty === "Hard"));
      } else {
        // If no status is selected, show all jobs
        setfilterQues(que);
      }
    }
  }, [que, difficulty]);

  const renderDifficultyTooltip = (props) => (
    <Tooltip id="difficulty-tooltip" {...props}>
      Difficulty
    </Tooltip>
  );

  const renderSubmissionsTooltip = (props) => (
    <Tooltip id="submissions-tooltip" {...props}>
      Submissions
    </Tooltip>
  );

  const renderSuccessRateTooltip = (props) => (
    <Tooltip id="successRate-tooltip" {...props}>
      Success Rate
    </Tooltip>
  );

  const handleSolveClick = (id) => {
    router.push(`/assessment/problems/${id}`);
  };

  return (
    <>
      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader2 />
      {/* End Header with upload cv btn */}

      <MobileMenu />
      {/* End MobileMenu */}

      <section className="problems-section">
        <div className="auto-container">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="my-4">Problems</h2>
            <select
              className="chosen-single form-select"
              onChange={(event) => setDifficulty(event.target.value)}
              style={{ width: "12%" }}
            >
              <option disabled>Select Difficulty</option>
              <option value="">All Questions</option>
              <option value="Basic">Basic</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="problem-list">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              filterQues?.map((problem, index) => (
                <div
                  className="problem-item d-flex justify-content-between align-items-center"
                  key={index}
                >
                  <div className="problem-details">
                    <h5>{problem.name}</h5>
                  </div>
                  <div className="problem-stats d-flex align-items-center">
                    <OverlayTrigger
                      placement="top"
                      overlay={renderDifficultyTooltip}
                    >
                      <span className="difficulty me-4">
                        {problem.difficulty}
                      </span>
                    </OverlayTrigger>

                    {/* <OverlayTrigger
                      placement="top"
                      overlay={renderSubmissionsTooltip}
                    >
                      <span className="submissions me-4">N/A</span>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={renderSuccessRateTooltip}
                    >
                      <span className="success-rate">N/A</span>
                    </OverlayTrigger> */}

                    <button
                      className="btn btn-outline-primary ms-3"
                      onClick={() => {
                        handleSolveClick(problem.id);
                      }}
                    >
                      Solve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
