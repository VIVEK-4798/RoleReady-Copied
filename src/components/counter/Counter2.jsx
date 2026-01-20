const Counter2 = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-xl-7 col-lg-10">
            <h2 
              className="text-40 lg:text-30 md:text-26 fw-700 text-dark-1 mb-30"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              The Problem Students Face Today
            </h2>
            
            <p 
              className="text-18 lg:text-16 text-dark-2 mb-50"
              data-aos="fade-up"
              data-aos-delay="300"
              style={{
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: '1.7'
              }}
            >
              Traditional placement preparation leaves students guessing about their readiness, 
              leading to wasted applications and missed opportunities.
            </p>
          </div>
        </div>

        <div className="row y-gap-30">
          {/* Problem 1 */}
          <div 
            className="col-lg-3 col-sm-6"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div 
              className="d-flex flex-column items-center text-center px-25 py-35 rounded-8"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.4) 100%)',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                height: '100%',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(86, 147, 193, 0.08)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(86, 147, 193, 0.05) 0%, rgba(86, 147, 193, 0.02) 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.4) 100%)';
              }}
            >
              <div 
                className="d-flex justify-center items-center rounded-full mb-25"
                style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #5693C1 0%, #427aa1 100%)',
                  color: 'white'
                }}
              >
                <i className="icon-target text-24"></i>
              </div>
              
              <h3 className="text-20 fw-600 text-dark-1 mb-15">
                Blind Applications
              </h3>
              
              <p className="text-16 text-dark-2" style={{ lineHeight: '1.6' }}>
                Students apply without knowing if they're truly ready for the role or company requirements.
              </p>
            </div>
          </div>
          {/* End Problem 1 */}

          {/* Problem 2 */}
          <div 
            className="col-lg-3 col-sm-6"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div 
              className="d-flex flex-column items-center text-center px-25 py-35 rounded-8"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.4) 100%)',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                height: '100%',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(86, 147, 193, 0.08)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(86, 147, 193, 0.05) 0%, rgba(86, 147, 193, 0.02) 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.4) 100%)';
              }}
            >
              <div 
                className="d-flex justify-center items-center rounded-full mb-25"
                style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #5693C1 0%, #427aa1 100%)',
                  color: 'white'
                }}
              >
                <i className="icon-ban text-24"></i>
              </div>
              
              <h3 className="text-20 fw-600 text-dark-1 mb-15">
                Silent Rejections
              </h3>
              
              <p className="text-16 text-dark-2" style={{ lineHeight: '1.6' }}>
                Rejections come without meaningful feedback, leaving students clueless about what went wrong.
              </p>
            </div>
          </div>
          {/* End Problem 2 */}

          {/* Problem 3 */}
          <div 
            className="col-lg-3 col-sm-6"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div 
              className="d-flex flex-column items-center text-center px-25 py-35 rounded-8"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.4) 100%)',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                height: '100%',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(86, 147, 193, 0.08)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(86, 147, 193, 0.05) 0%, rgba(86, 147, 193, 0.02) 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.4) 100%)';
              }}
            >
              <div 
                className="d-flex justify-center items-center rounded-full mb-25"
                style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #5693C1 0%, #427aa1 100%)',
                  color: 'white'
                }}
              >
                <i className="icon-gap text-24"></i>
              </div>
              
              <h3 className="text-20 fw-600 text-dark-1 mb-15">
                Hidden Skill Gaps
              </h3>
              
              <p className="text-16 text-dark-2" style={{ lineHeight: '1.6' }}>
                Critical skill gaps remain invisible, making improvement feel like a guessing game.
              </p>
            </div>
          </div>
          {/* End Problem 3 */}

          {/* Problem 4 */}
          <div 
            className="col-lg-3 col-sm-6"
            data-aos="fade-up"
            data-aos-delay="700"
          >
            <div 
              className="d-flex flex-column items-center text-center px-25 py-35 rounded-8"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.4) 100%)',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                height: '100%',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(86, 147, 193, 0.08)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(86, 147, 193, 0.05) 0%, rgba(86, 147, 193, 0.02) 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.4) 100%)';
              }}
            >
              <div 
                className="d-flex justify-center items-center rounded-full mb-25"
                style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #5693C1 0%, #427aa1 100%)',
                  color: 'white'
                }}
              >
                <i className="icon-road text-24"></i>
              </div>
              
              <h3 className="text-20 fw-600 text-dark-1 mb-15">
                Unstructured Efforts
              </h3>
              
              <p className="text-16 text-dark-2" style={{ lineHeight: '1.6' }}>
                Preparation becomes random and inefficient without a clear, personalized roadmap.
              </p>
            </div>
          </div>
          {/* End Problem 4 */}
        </div>

        {/* Optional: Stats Section below */}
        <div 
          className="row y-gap-30 justify-center mt-60 pt-60"
          data-aos="fade-up"
          data-aos-delay="800"
          style={{
            borderTop: '1px solid rgba(226, 232, 240, 0.5)'
          }}
        >
          <div className="col-auto">
            <div className="text-center">
              <div className="text-40 lg:text-30 fw-700 text-dark-1 mb-5">85%</div>
              <div className="text-16 text-dark-2">Students apply blindly</div>
            </div>
          </div>
          
          <div className="col-auto">
            <div className="text-center">
              <div className="text-40 lg:text-30 fw-700 text-dark-1 mb-5">9/10</div>
              <div className="text-16 text-dark-2">Get no feedback on rejections</div>
            </div>
          </div>
          
          <div className="col-auto">
            <div className="text-center">
              <div className="text-40 lg:text-30 fw-700 text-dark-1 mb-5">70%</div>
              <div className="text-16 text-dark-2">Don't know their skill gaps</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Counter2;