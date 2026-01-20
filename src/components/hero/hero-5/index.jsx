import { useEffect } from "react";

const Index = () => {
  return (
    <section className="masthead -type-5" style={{paddingTop: "200px", paddingBottom: "50px"}}>
      <div className="container">
        <div className="row">
          {/* LEFT SIDE */}
          <div className="masthead__content">
            <h1
              className="masthead__title"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Know If You’re Ready <br />
              <span className="highlight">
                Before You Apply
                <span className="highlight__line" />
              </span>
            </h1>
            <p 
              className="mt-20" 
              data-aos="fade-up" 
              data-aos-delay="500"
              style={{
                fontSize: '1.25rem',
                lineHeight: 1.6,
                color: '#4a5568',
                marginBottom: '2.5rem',
                maxWidth: '600px'
              }}
            >
              RoleReady helps students analyze 
              <span style={{fontWeight: 600}}> kill gaps, measure placement readiness, follows a clear improvement roadmap </span> 
              instead of applying blindly.
              <br />
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="masthead__image">
            <img
              src="/img/hero/hero.png"
              alt="wedding"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;