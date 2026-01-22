import { useNavigate } from "react-router-dom";

const Index = ({ onCheckReadiness, onLearnMore }) => {
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token")); 
  // adjust if you use context instead

  const handlePrimaryCTA = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // OPTION A: route-based demo
    navigate("/readiness/demo");

    // OPTION B: modal-based demo
    // setShowDemoModal(true);
  };

  return (
    <section className="masthead -type-5" style={{ 
      paddingTop: "200px", 
      paddingBottom: "50px",
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
    }}>
      <div className="container">
        <div className="row" style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          alignItems: "center",
          justifyContent: "space-between"
        }}>

          {/* LEFT SIDE */}
          <div className="masthead__content" style={{ 
            flex: "1", 
            minWidth: "300px",
            maxWidth: "600px",
            marginBottom: "40px"
          }}>
            <h1 className="masthead__title" data-aos="fade-up" data-aos-delay="400" style={{
              fontSize: "3.5rem",
              fontWeight: "800",
              lineHeight: "1.2",
              color: "#0f172a",
              marginBottom: "1.5rem",
              letterSpacing: "-0.5px"
            }}>
              Know If You're Ready{" "}
              <span className="highlight" style={{
                position: "relative",
                display: "inline-block",
                color: "#5693C1"
              }}>
                Before You Apply
                <span className="highlight__line" style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "0",
                  width: "100%",
                  height: "8px",
                  backgroundColor: "rgba(86, 147, 193, 0.2)",
                  zIndex: "-1",
                  borderRadius: "4px"
                }} />
              </span>
            </h1>

            <p
              className="mt-20"
              data-aos="fade-up"
              data-aos-delay="500"
              style={{
                fontSize: "1.25rem",
                lineHeight: "1.6",
                color: "#64748b",
                marginBottom: "2.5rem",
                maxWidth: "600px",
                fontWeight: "400"
              }}
            >
              RoleReady helps students analyze{" "}
              <span style={{ 
                fontWeight: "600",
                color: "#334155"
              }}>
                skill gaps, measure placement readiness, and follow a clear improvement roadmap
              </span>{" "}
              instead of applying blindly.
            </p>

            {/* CTA BUTTONS */}
            <div
              className="d-flex gap-3"
              data-aos="fade-up"
              data-aos-delay="600"
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap"
              }}
            >
              {/* PRIMARY BUTTON */}
              <button
                style={{
                  padding: "16px 40px",
                  fontSize: "16px",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #5693C1 0%, #4a80b0 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(86, 147, 193, 0.3)",
                  letterSpacing: "0.3px",
                  position: "relative",
                  overflow: "hidden"
                }}
                onClick={onCheckReadiness}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(86, 147, 193, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(86, 147, 193, 0.3)";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 10px rgba(86, 147, 193, 0.3)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(86, 147, 193, 0.4)";
                }}
              >
                <span style={{ position: "relative", zIndex: 1 }}>
                  Check Your Readiness
                </span>
                <div style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #4a80b0 0%, #5693C1 100%)",
                  opacity: "0",
                  transition: "opacity 0.3s ease"
                }} 
                onMouseEnter={(e) => {
                  e.target.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = "0";
                }}
                />
              </button>

              {/* SECONDARY BUTTON */}
              <button
                style={{
                  padding: "16px 40px",
                  fontSize: "16px",
                  fontWeight: "700",
                  background: "white",
                  color: "#5693C1",
                  border: "2px solid #5693C1",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.3px",
                  position: "relative",
                  overflow: "hidden"
                }}
                onClick={onLearnMore}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(86, 147, 193, 0.15)";
                  e.currentTarget.style.background = "rgba(86, 147, 193, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.background = "white";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "rgba(86, 147, 193, 0.1)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.background = "rgba(86, 147, 193, 0.05)";
                }}
              >
                <span style={{ position: "relative", zIndex: 1 }}>
                  Learn More
                </span>
                <div style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  background: "rgba(86, 147, 193, 0.08)",
                  opacity: "0",
                  transition: "opacity 0.3s ease"
                }} 
                onMouseEnter={(e) => {
                  e.target.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = "0";
                }}
                />
              </button>
            </div>

            {/* Additional Info Text */}
            <p style={{
              marginTop: "24px",
              fontSize: "14px",
              color: "#94a3b8",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              Takes 5 minutes • No credit card required
            </p>
          </div>

          {/* RIGHT SIDE - Hero Image */}
          <div className="masthead__image" style={{ 
            flex: "1", 
            minWidth: "300px",
            maxWidth: "600px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <img
              src="/img/hero/hero.png"
              alt="RoleReady preview"
              style={{
                width: "100%",
                maxWidth: "600px",
                height: "auto",
                borderRadius: "20px",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
                transform: "perspective(1000px) rotateY(-10deg)",
                transition: "transform 0.5s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "perspective(1000px) rotateY(0deg)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "perspective(1000px) rotateY(-10deg)";
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Index;