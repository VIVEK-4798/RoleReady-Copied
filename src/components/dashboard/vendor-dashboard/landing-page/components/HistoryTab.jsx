import { FiRefreshCw } from "react-icons/fi";
import { MdHistory } from "react-icons/md";

const HistoryTab = ({ history, loading, formatDate }) => {
  // Get score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  // Helper function to calculate change
  const calculateChange = (currentIndex) => {
    // First row has no previous to compare with
    if (currentIndex === 0) return null;
    
    const currentScore = history[currentIndex].total_score;
    const previousScore = history[currentIndex - 1].total_score;
    
    return currentScore - previousScore;
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
              <p className="text-gray-600 mt-3">Loading history data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row y-gap-30 mt-30">
      <div className="col-12">
        <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-30">
          <div className="d-flex justify-content-between align-items-center mb-30">
            <div>
              <h2 className="text-20 fw-600 text-gray-900 mb-2">Readiness History</h2>
              <p className="text-gray-600">Track your readiness score over time - Most recent first</p>
            </div>
            <button className="btn btn-primary">
              <FiRefreshCw className="me-2" />
              Refresh Data
            </button>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-40">
              <div className="text-gray-400 mb-3">
                <MdHistory size={48} />
              </div>
              <h3 className="text-18 fw-600 text-gray-700 mb-2">No History Available</h3>
              <p className="text-gray-500">Complete more assessments to see your progress history.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr className="border-bottom">
                    <th className="text-gray-600 fw-600 py-3">Date</th>
                    <th className="text-gray-600 fw-600 py-3">Score</th>
                    <th className="text-gray-600 fw-600 py-3">Change</th>
                    <th className="text-gray-600 fw-600 py-3">Status</th>
                    <th className="text-gray-600 fw-600 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record, index) => {
                    const delta = calculateChange(index);
                    
                    return (
                      <tr key={record.readiness_id} className="border-bottom">
                        <td className="py-3">
                          <div className="text-14 fw-500 text-gray-900">
                            {formatDate(record.calculated_at)}
                          </div>
                          <div className="text-12 text-gray-500">
                            {new Date(record.calculated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-2">
                            <div style={{ color: getScoreColor(record.total_score) }} className="text-16 fw-600">
                              {record.total_score}
                            </div>
                            <div className="text-12 text-gray-500">/100</div>
                          </div>
                        </td>
                        <td className="py-3">
                          {delta === null ? (
                            <div className="text-14 text-gray-400">--</div>
                          ) : delta === 0 ? (
                            <div className="text-14 fw-500 text-gray-600">No Change</div>
                          ) : (
                            <div className={`text-14 fw-500 ${delta > 0 ? 'text-success' : 'text-danger'}`}>
                              {delta > 0 ? '+' : ''}{delta}
                            </div>
                          )}
                        </td>
                        <td className="py-3">
                          <span className={`badge ${record.total_score >= 70 ? 'bg-success' : record.total_score >= 50 ? 'bg-warning' : 'bg-danger'} py-1 px-3 rounded-pill`}>
                            {record.total_score >= 70 ? 'Ready' : record.total_score >= 50 ? 'Progressing' : 'Needs Work'}
                          </span>
                        </td>
                        <td className="py-3">
                          <button className="btn btn-sm btn-outline-primary">
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;