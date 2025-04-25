const data = [
  {
    title: "Get found more easily",
    description:
      "Advertise your products to customers who search for what you sell.",
    icon: "/img/dashboard/icons/window_14015747.png",
    button: "Set up Google Analytics",
    buttonCls: "px-20 py-10",
    buttonUrl: "google_ads",
  },
  {
    title: "Get listed",
    description:
      "Include your products in the Google Shopping results that can appear on the top of the search results page.",
    icon: "/img/dashboard/icons/bar-chart_7274627.png",
    button: "Get Started",
    buttonCls: "px-60 py-10",
    buttonUrl: "facebook_ads",
  },
];

const AnalyzeCards = () => {
  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-12 col-md-12 col-sm-12">
          <div className="py-20 px-20 rounded-4 bg-white shadow-3">
            <div className="row y-gap-20 flex justify-between items-center">
              <div className="col-3 ">
                <img
                  src={item.icon}
                  className="h-auto w-auto"
                  // style={{
                  //   maxWidth: "4rem",
                  //   maxHeight: "4rem",
                  //   // marginLeft: "2rem",
                  // }}
                  alt="icon"
                />
              </div>
              <div className="col-9">
                <div className="fw-500 lh-14">{item.title}</div>
                {/* <div className="text-26 lh-16 fw-600 mt-5">{item.amount}</div> */}
                <div className="text-15 lh-14 text-light-1 mt-5 d-none d-sm-block">
                  {item.description}
                </div>
              </div>
              {/* <div className="col-auto">
                <a
                  className={`button bg-primary rounded text-white ${item.buttonCls}`}
                  href={item.buttonUrl}
                >
                  {item.button}
                </a>
              </div> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyzeCards;
