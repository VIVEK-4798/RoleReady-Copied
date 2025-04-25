import MainFilterSearchBox from "./MainFilterSearchBox";

const Index = () => {
  return (
    <section className="masthead -type-5">
      <div className="masthead__bg">
        {/* <img alt="image" src="/img/masthead/5/bg.svg" className="js-lazy" /> */}
      </div>
      {/* End bg image */}

      <div className="container">
        <div className="row w-100">
          <div className="col-xl-9 w-50">
            <h1
              className="text-60 lg:text-40 md:text-30"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Connect and grow your  {" "}
              <span
                className="text-blue-1 relative"
                // style={{ color: "#5693c1" }}
              >
                Startup Network{" "}
                <span className="-line">
                  <img src="/img/general/line.png" alt="image" />
                </span>
              </span>
            </h1>
            <p className="mt-20" data-aos="fade-up" data-aos-delay="500">
            Startups 24×7 is an Online Social Networking Platform for Startups, 
            <b>Investors & Advisors to Freely Communicate with each other and to
              </b>.Promote their Products & Services to our Niche Audience.
              <br />
            </p>

            {/* <MainFilterSearchBox /> */}
            {/* End filter content */}
          </div>

          <div
            className="masthead__image w-50"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <img
              src="/img/masthead/5/27 - Video chatting.svg"
              alt="image"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
      {/* End .container */}

      {/* End .masthead__image */}
    </section>
  );
};

export default Index;
