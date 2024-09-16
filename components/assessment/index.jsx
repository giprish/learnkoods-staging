import { useRouter } from "next/router";
import MobileMenu from "../header/MobileMenu";
import LoginPopup from "../common/form/login/LoginPopup";
import DefaulHeader2 from "../header/DefaulHeader2";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.GLOBAL_API}/asses-ques/`);
      console.log(response.data); // Add this for debugging
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
          <h2 className="my-4">Problems</h2>
          <div className="problem-list">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              que?.map((problem, index) => (
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
