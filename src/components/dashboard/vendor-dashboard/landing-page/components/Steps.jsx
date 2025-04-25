import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Steps = () => {
  const [completedSteps, setCompletedSteps] = useState(1);

  const handleStepClick = (index) => {
    if (index <= completedSteps) {
      setCompletedSteps(index + 1);
    }
  };

  const renderIcon = (index) => {
    if (index < completedSteps) {
      return <i className="bi bi-check-circle-fill text-30 text-primary"></i>;
    }
    return <i className={`bi bi-${index + 1}-circle text-30`}></i>;
  };

  const renderLine = (index) => {
    const lineStyle = {
      width: "2px",
      height: index === 0 ? "50px" : "120px", // Adjust height as needed
      backgroundColor: completedSteps > index ? "blue" : "gray",
      // margin: "10px 0",
    };

    return <div style={lineStyle}></div>;
  };

  const navigate = useNavigate();

  const generateRandomString = () => {
    const randomChars = Math.random().toString(36).substring(2, 10);
    const randomNumbers = parseInt(Math.random().toString().slice(2, 10))
      .toString()
      .padStart(8, "0");

    return `${randomChars}${randomNumbers}`;
  };

  function handleVisit(e) {
    e.preventDefault();
    // project name is dynamic
    const store = sessionStorage.getItem("store");
    if (!store) {
      const randomStoreName = generateRandomString();
      sessionStorage.setItem("store", randomStoreName);
      navigate(`/store/${randomStoreName}`);
    } else {
      navigate(`/store/${store}`);
    }
  }

  return (
    <div className="d-flex flex-column overflow-scroll scroll-bar-1">
      {/* Step 1 */}
      <div className="d-flex align-items-start mb-3">
        <div className="me-3 d-flex flex-column align-items-center">
          {renderIcon(0)}
          {renderLine(0)}
        </div>
        <div className="col pt-10">
          <h4 className="text-20 lh-14 fw-normal">Your website is ready</h4>
          <div className="text-15 text-light-1">
            Congratulations! Your website is ready.
          </div>
          <a
            href="#"
            className="text-14 text-primary text-decoration-underline"
            onClick={(e) => {
              // handleStepClick(0);
              handleVisit(e);
            }}
          >
            Visit Website
          </a>
        </div>
      </div>

      {/* Step 2 */}
      <div
        className={`d-flex align-items-start mb-3 ${
          completedSteps < 1 ? "disabled" : ""
        }`}
      >
        <div className="me-3 d-flex flex-column align-items-center">
          {renderIcon(1)}
          {renderLine(1)}
        </div>
        <div className="col pt-10">
          <h4 className="text-20 lh-14 fw-normal">Add your first product</h4>
          <div className="text-15 text-light-1 pb-20">
            Start adding products to your online store now!
          </div>
          <button
            type="button"
            className="btn btn-primary fw-bold"
            onClick={() => completedSteps >= 1 && handleStepClick(1)}
          >
            Add product
          </button>
          <div className="text-15 text-light-1 pt-20">or import from</div>
        </div>
      </div>

      {/* Step 3 */}
      <div
        className={`d-flex align-items-start mb-3 ${
          completedSteps < 2 ? "disabled" : ""
        }`}
        onClick={() => completedSteps >= 2 && handleStepClick(2)}
      >
        <div className="me-3 d-flex flex-column align-items-center">
          {renderIcon(2)}
        </div>
        <div className="col pt-10">
          <h4 className="text-20 text-light-1 lh-14 fw-normal">
            Set up payments
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Steps;
