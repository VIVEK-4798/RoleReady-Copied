import { useState } from "react";
import OverviewTab from "./OverviewTab";
import HistoryTab from "./HistoryTab";
import TrendsTab from "./TrendsTab";

const DashboardContent = ({
  categoryId,
  categoryName,
  categories,
  latest,
  history,
  progress,
  loading,
  activeTab,
  formatDate,
  onCategorySelect,
  onRetakeAssessment,
  onTabChange,
  userId
}) => {
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  // Check if this is first assessment
  const isFirstAssessment = !latest;
  // Check if user has history for this category
  const hasHistory = history && history.length > 0;

  return (
    <div className="dashboard__content bg-light-2" style={{ background: '#f8fafc' }}>
      {/* Page Header */}
      <div className="row y-gap-30 pt-30">
        <div className="col-12">
          <div className="py-30 px-30 rounded-4 bg-white shadow-sm border border-gray-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h1 className="text-28 fw-700 mb-2" style={{ color: '#0f172a' }}>
                  Readiness Dashboard
                </h1>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-14 text-gray-600">Target Role:</span>
                  <span 
                    className="text-14 fw-600 text-primary cursor-pointer d-flex align-items-center gap-1"
                    onClick={() => setShowCategorySelector(!showCategorySelector)}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: 'rgba(86, 147, 193, 0.1)',
                      borderRadius: '20px'
                    }}
                  >
                    {categoryName}
                    <span className="text-12">▼</span>
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="text-14 text-gray-500">Updated:</span>
                <span className="text-14 fw-500 text-gray-700">
                  {latest ? formatDate(latest.calculated_at) : '--'}
                </span>
              </div>
            </div>

            {/* Category Selector Dropdown */}
            {showCategorySelector && categories.length > 0 && (
              <div className="mb-3 p-3 bg-white border rounded-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-14 fw-600 text-gray-700">Change Target Role</span>
                  <button 
                    className="btn btn-sm btn-link text-gray-500"
                    onClick={() => setShowCategorySelector(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category.category_id}
                      onClick={() => {
                        onCategorySelect(category.category_id);
                        setShowCategorySelector(false);
                      }}
                      className={`btn ${categoryId == category.category_id ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                    >
                      {category.category_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="d-flex gap-3 mt-30 border-bottom pb-2">
              <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => onTabChange('overview')}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  background: 'none',
                  color: activeTab === 'overview' ? '#5693C1' : '#64748b',
                  fontWeight: '600',
                  fontSize: '14px',
                  borderBottom: activeTab === 'overview' ? '2px solid #5693C1' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Overview
              </button>
              <button
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => onTabChange('history')}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  background: 'none',
                  color: activeTab === 'history' ? '#5693C1' : '#64748b',
                  fontWeight: '600',
                  fontSize: '14px',
                  borderBottom: activeTab === 'history' ? '2px solid #5693C1' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                History
              </button>
              <button
                className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
                onClick={() => onTabChange('trends')}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  background: 'none',
                  color: activeTab === 'trends' ? '#5693C1' : '#64748b',
                  fontWeight: '600',
                  fontSize: '14px',
                  borderBottom: activeTab === 'trends' ? '2px solid #5693C1' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  ...(!hasHistory ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                }}
                disabled={!hasHistory}
              >
                Trends
                {!hasHistory && <span className="ms-1 text-10">(Needs history)</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Render Active Tab */}
      {activeTab === 'overview' && (
        <OverviewTab 
          latest={latest}
          history={history}
          progress={progress}
          loading={loading}
          formatDate={formatDate}
          categoryName={categoryName}
          userId={userId}
          categoryId={categoryId}
        />
      )}

      {activeTab === 'history' && (
        <HistoryTab 
          history={history}
          loading={loading}
          formatDate={formatDate}
        />
      )}

      {activeTab === 'trends' && (
        <TrendsTab 
          history={history}
          loading={loading}
          formatDate={formatDate}
        />
      )}

      {/* Conditional CTA Section - UPDATED FOR PHASE 5 */}
      <div className="row y-gap-30 mt-30">
        <div className="col-12">
          <div className={`rounded-4 ${isFirstAssessment ? 'bg-gradient-warning' : 'bg-gradient-primary'} p-30 text-white`}>
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h2 className="text-24 fw-700 mb-2">
                  {isFirstAssessment ? 'Ready to start?' : 'Ready to improve your score?'}
                </h2>
                <p className="text-white opacity-90 mb-0">
                  {isFirstAssessment 
                    ? `Take your first readiness assessment for ${categoryName} to get your baseline score.`
                    : `Update your skills or retake assessment to refresh your readiness score for ${categoryName}.`
                  }
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <button 
                  onClick={onRetakeAssessment}
                  className={`btn fw-600 px-30 py-12 ${isFirstAssessment ? 'btn-light text-dark' : 'btn-light text-primary'}`}
                  disabled={loading}
                >
                  {loading ? "Processing..." : (isFirstAssessment ? "Take First Assessment" : "Retake Assessment")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;