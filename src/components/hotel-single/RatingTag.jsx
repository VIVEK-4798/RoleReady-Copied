const RatingTag = () => {
  return (
    <div className="demand-banner">
      <div className="demand-content">
        <div className="demand-badge">
          <div className="pulse-effect"></div>
          <i className="bi bi-lightning-charge-fill"></i>
        </div>
        
        <div className="demand-text">
          <h3 className="demand-title">This opportunity is in high demand!</h3>
          <p className="demand-stats">
            <span className="highlight-count">133</span> applicants have applied today
          </p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '85%' }}></div>
          </div>
          <p className="demand-notice">Apply soon to secure your spot</p>
        </div>
      </div>
    </div>
  );
};

export default RatingTag;