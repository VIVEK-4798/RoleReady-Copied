import Header from "../../../../header/dashboard-header";
import Sidebar from "../../common/Sidebar";
import Footer from "../../common/Footer";

const CategorySelector = ({ categories, onCategorySelect }) => {
  return (
    <>
      <div className="header-margin"></div>
      <Header />

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>

        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2" style={{ background: '#f8fafc' }}>
            <div className="row y-gap-30 pt-30">
              <div className="col-12">
                <div className="py-40 px-30 rounded-4 bg-white shadow-sm border border-gray-100 text-center">
                  <div className="mb-20">
                    <div className="text-gray-400 mb-4" style={{ fontSize: '48px' }}>
                      🎯
                    </div>
                    <h1 className="text-28 fw-700 mb-3" style={{ color: '#0f172a' }}>
                      Select Your Target Role
                    </h1>
                    <p className="text-16 text-gray-600 mb-0">
                      Choose a role category to view your readiness dashboard and track your preparation progress
                    </p>
                  </div>

                  {categories.length === 0 ? (
                    <div className="py-20">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-gray-600 mt-3">Loading available roles...</p>
                    </div>
                  ) : (
                    <>
                      <div className="row justify-content-center g-4 mb-30">
                        {categories.map(category => (
                          <div key={category.category_id} className="col-md-4 col-sm-6">
                            <div 
                              className="category-card p-24 rounded-4 bg-white border border-gray-200 hover-shadow cursor-pointer transition-all"
                              onClick={() => onCategorySelect(category.category_id)}
                              style={{
                                border: '2px solid #e2e8f0',
                                transition: 'all 0.3s ease',
                                height: '100%'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#5693C1';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(86, 147, 193, 0.15)';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <div className="text-center mb-16">
                                <div 
                                  className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                                  style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'linear-gradient(135deg, rgba(86, 147, 193, 0.1) 0%, rgba(86, 147, 193, 0.05) 100%)',
                                    color: '#5693C1'
                                  }}
                                >
                                  <span style={{ fontSize: '24px' }}>💼</span>
                                </div>
                                <h3 className="text-18 fw-600 text-gray-900 mb-2">{category.category_name}</h3>
                              </div>
                              <div className="text-center">
                                <button 
                                  className="btn btn-primary btn-sm"
                                  onClick={() => onCategorySelect(category.category_id)}
                                >
                                  Select This Role
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-top pt-20">
                        <p className="text-14 text-gray-500 mb-0">
                          You can change your target role anytime from your profile settings
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorySelector;