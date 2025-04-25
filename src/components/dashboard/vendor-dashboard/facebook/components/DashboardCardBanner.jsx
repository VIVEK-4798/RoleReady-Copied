const data = [
  {
    title: "Sell on Facebook",
    description:
      "Reach billions of shoppers on Facebook and grow your customer base.",
    icon: "/img/masthead/5/social-media-marketing-with-facebook-ads.png",
    buttonUrl: "google_ads",
  },
];

const DashboardCardBanner = () => {
  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-12 col-md-12 col-sm-12">
          <div className="py-30 px-30 rounded-4 bg-primary shadow-3">
            <div className="row y-gap-20 justify-between">
              <div className="col-6">
                <div className="fw-600 lh-14 text-24 text-white">
                  {item.title}
                </div>
                <div className="text-15 lh-14 text-light-1  text-white mt-5 d-none d-sm-block mb-20">
                  {item.description}
                </div>
                <a
                  href="#"
                  className="button rounded text-white px-30 py-10"
                  style={{ backgroundColor: "#0cac42" }}
                >
                  Upgrate to sell on Facebook
                </a>
              </div>
              <div className="col-6 ">
                <img src={item.icon} className="h-auto w-auto" alt="icon" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCardBanner;
