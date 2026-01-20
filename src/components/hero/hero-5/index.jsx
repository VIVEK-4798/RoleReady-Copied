import { useEffect } from "react";

const Index = () => {
  return (
    <section className="masthead -type-5 pt-[140px] md:pt-[120px] sm:pt-[100px] pb-[50px] relative overflow-hidden rounded-b-[20px]">
      <div className="container relative z-10">
        <div className="row flex flex-wrap items-center justify-between">
          {/* LEFT SIDE */}
          <div className="masthead__content flex-1 min-w-[320px] max-w-[520px] lg:max-w-full pl-[30px] lg:pl-0 flex flex-col items-start z-40 relative">
            <h1
              className="masthead__title w-full text-[2.5rem] md:text-[2.1rem] sm:text-[1.8rem] font-bold leading-tight text-gray-800 mb-6 text-shadow-sm"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Know If You're Ready <br className="hidden sm:block" />
              <span className="highlight text-blue-600 relative inline-block">
                Before You Apply
                <span className="highlight__line absolute bottom-[-10px] left-0 w-full h-2 bg-gradient-to-r from-blue-500/45 to-blue-500/15 rounded z-[-1] transform scale-x-90" />
              </span>
            </h1>
            <p 
              className="mt-5 text-xl md:text-lg text-gray-600 mb-10 max-w-[600px] leading-relaxed"
              data-aos="fade-up" 
              data-aos-delay="500"
            >
              RoleReady helps students analyze 
              <span className="font-semibold"> skill gaps, measure placement readiness, follow a clear improvement roadmap </span> 
              instead of applying blindly.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="masthead__image flex-1 min-w-[500px] lg:min-w-full lg:mt-11 flex items-center justify-end lg:justify-center z-10 relative">
            <img
              src="/img/hero/hero.png"
              alt="RoleReady Dashboard Preview"
              className="img-fluid w-full max-w-[120%] lg:max-w-full h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500 ease-in-out"
              data-aos="fade-left"
              data-aos-delay="600"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;