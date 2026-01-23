import { FiArrowUp, FiArrowDown, FiTrendingUp } from "react-icons/fi";
import { MdShowChart } from "react-icons/md";

const TrendsTab = ({ history, loading, formatDate }) => {
  // Get score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  // Calculate statistics
  const calculateStats = () => {
    if (history.length === 0) return null;
    
    const scores = history.map(h => h.total_score);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const best = Math.max(...scores);
    const worst = Math.min(...scores);
    
    return { average, best, worst };
  };

  if (loading) {
    return (
      <div className="row y-gap-30 mt-30">
        <div className="col-12">
          <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-30">
            <div className="text-center py-40">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-gray-600 mt-3">Loading trends data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="row y-gap-30 mt-30">
      <div className="col-12">
        <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-30">
          <div className="d-flex justify-content-between align-items-center mb-30">
            <div>
              <h2 className="text-20 fw-600 text-gray-900 mb-2">Score Trends</h2>
              <p className="text-gray-600">Visual representation of your readiness progress</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary">
                <MdShowChart className="me-2" />
                Export Data
              </button>
            </div>
          </div>

          {history.length < 2 ? (
            <div className="text-center py-40">
              <div className="text-gray-400 mb-3">
                <MdShowChart size={48} />
              </div>
              <h3 className="text-18 fw-600 text-gray-700 mb-2">Insufficient Data</h3>
              <p className="text-gray-500">Complete at least 2 assessments to see trends.</p>
            </div>
          ) : (
            <>
              {/* Improved Trend Chart */}
              <div className="mb-40">
                <div style={{ height: '300px', position: 'relative', padding: '20px 40px' }}>
                  {/* Y-axis labels */}
                  <div style={{ position: 'absolute', left: '0', top: '0', bottom: '0', width: '40px' }}>
                    {[100, 75, 50, 25, 0].map((value) => (
                      <div 
                        key={value} 
                        style={{ 
                          position: 'absolute', 
                          left: '0', 
                          top: `${100 - value}%`,
                          transform: 'translateY(-50%)',
                          fontSize: '12px',
                          color: '#64748b'
                        }}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                  
                  {/* Chart area */}
                  <div style={{ 
                    position: 'absolute', 
                    left: '40px', 
                    right: '0', 
                    top: '0', 
                    bottom: '0',
                    borderLeft: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    {/* Trend line */}
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                      <path
                        d={history.map((record, index) => {
                          const x = (index / (history.length - 1)) * 100;
                          const y = 100 - record.total_score;
                          return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                        }).join(' ')}
                        fill="none"
                        stroke="#5693C1"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    
                    {/* Data points */}
                    {history.map((record, index) => {
                      const x = (index / (history.length - 1)) * 100;
                      const y = 100 - record.total_score;
                      
                      return (
                        <div 
                          key={record.readiness_id}
                          style={{
                            position: 'absolute',
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: getScoreColor(record.total_score),
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                          }}
                          title={`${formatDate(record.calculated_at)}: ${record.total_score}`}
                        >
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* X-axis labels (dates) */}
                  <div style={{ 
                    marginTop: '10px', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    paddingLeft: '40px'
                  }}>
                    {history.map((record, index) => {
                      if (index === 0 || index === history.length - 1 || history.length <= 5 || index % Math.ceil(history.length / 5) === 0) {
                        return (
                          <div 
                            key={record.readiness_id}
                            style={{ 
                              fontSize: '11px', 
                              color: '#64748b',
                              textAlign: 'center'
                            }}
                          >
                            {new Date(record.calculated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>

              {/* Trend Analysis */}
              <div className="row">
                <div className="col-md-4">
                  <div className="bg-light-blue-50 p-24 rounded-3 h-100">
                    <div className="text-primary mb-3">
                      <FiTrendingUp size={28} />
                    </div>
                    <h3 className="text-18 fw-600 text-gray-900 mb-2">Average Score</h3>
                    <div className="text-32 fw-700 text-primary mb-2">
                      {Math.round(stats.average)}
                    </div>
                    <p className="text-13 text-gray-600">
                      Average score across all {history.length} assessments
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-light-green-50 p-24 rounded-3 h-100">
                    <div className="text-success mb-3">
                      <FiArrowUp size={28} />
                    </div>
                    <h3 className="text-18 fw-600 text-gray-900 mb-2">Best Score</h3>
                    <div className="text-32 fw-700 text-success mb-2">
                      {stats.best}
                    </div>
                    <p className="text-13 text-gray-600">
                      Highest readiness score achieved
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-light-red-50 p-24 rounded-3 h-100">
                    <div className="text-danger mb-3">
                      <FiArrowDown size={28} />
                    </div>
                    <h3 className="text-18 fw-600 text-gray-900 mb-2">Worst Score</h3>
                    <div className="text-32 fw-700 text-danger mb-2">
                      {stats.worst}
                    </div>
                    <p className="text-13 text-gray-600">
                      Lowest readiness score recorded
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendsTab;