import { MdHistory } from "react-icons/md";
import { FiArrowUp, FiArrowDown, FiRefreshCw, FiCalendar, FiStar } from "react-icons/fi";

const StatsCards = ({ latest, history, progress, formatDate }) => {
  const previousScore = history.length > 1 ? history[1]?.total_score : null; // history[0] is latest, history[1] is previous
  const scoreDelta = previousScore !== null ? (latest?.total_score || 0) - previousScore : null;
  
  // Helper function to get change description
  const getChangeDescription = () => {
    if (previousScore === null) {
      return 'First assessment - no previous score to compare';
    }
    if (scoreDelta === 0) {
      return 'No change since last check';
    }
    return scoreDelta > 0 ? 'Improvement since last check' : 'Decline since last check';
  };

  // Helper function to get change icon and styling
  const getChangeInfo = () => {
    if (previousScore === null) {
      return {
        icon: <FiStar size={24} className="text-info" />,
        bgClass: 'bg-light-info',
        displayValue: '--',
        textClass: 'text-gray-900'
      };
    }
    if (scoreDelta === 0) {
      return {
        icon: <FiRefreshCw size={24} className="text-gray-600" />,
        bgClass: 'bg-light-gray',
        displayValue: '0',
        textClass: 'text-gray-900'
      };
    }
    if (scoreDelta > 0) {
      return {
        icon: <FiArrowUp size={24} className="text-success" />,
        bgClass: 'bg-light-green',
        displayValue: `+${scoreDelta}`,
        textClass: 'text-success'
      };
    }
    return {
      icon: <FiArrowDown size={24} className="text-danger" />,
      bgClass: 'bg-light-red',
      displayValue: scoreDelta,
      textClass: 'text-danger'
    };
  };

  const changeInfo = getChangeInfo();

  return (
    <div className="row y-gap-20">
      {/* Previous Score Card */}
      <div className="col-12">
        <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-24">
          <div className="d-flex align-items-center justify-content-between mb-16">
            <div>
              <div className="text-14 text-gray-600 mb-2">Previous Score</div>
              <div className="text-32 fw-700 text-gray-900">
                {previousScore !== null ? previousScore : '--'}
              </div>
            </div>
            <div className="bg-light-blue p-12 rounded-circle">
              <MdHistory size={24} className="text-primary" />
            </div>
          </div>
          <div className="text-13 text-gray-500">
            {previousScore !== null ? 'Last calculated readiness score' : 'No previous score available'}
          </div>
        </div>
      </div>

      {/* Score Change Card - UPDATED */}
      <div className="col-12">
        <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-24">
          <div className="d-flex align-items-center justify-content-between mb-16">
            <div>
              <div className="text-14 text-gray-600 mb-2">Score Change</div>
              <div className={`text-32 fw-700 ${changeInfo.textClass}`}>
                {changeInfo.displayValue}
              </div>
            </div>
            <div className={`p-12 rounded-circle ${changeInfo.bgClass}`}>
              {changeInfo.icon}
            </div>
          </div>
          <div className="text-13 text-gray-500">
            {getChangeDescription()}
          </div>
        </div>
      </div>

      {/* Last Updated Card */}
      <div className="col-12">
        <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-24">
          <div className="d-flex align-items-center justify-content-between mb-16">
            <div>
              <div className="text-14 text-gray-600 mb-2">Last Updated</div>
              <div className="text-20 fw-600 text-gray-900">
                {latest ? formatDate(latest.calculated_at) : '--'}
              </div>
            </div>
            <div className="bg-light-purple p-12 rounded-circle">
              <FiCalendar size={24} className="text-purple" />
            </div>
          </div>
          <div className="text-13 text-gray-500">
            {latest ? 'Date of latest assessment' : 'No assessments completed'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;