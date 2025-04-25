const data = [
  {
    title: "Sell on Instagram",
    description:
      "Showcase your products on Instagram and convert your audience to buyers with shoppable Instagram posts.",
    icon: "/img/masthead/5/social-media-marketing-with-instagram-ads.png",
    buttonUrl: "google_ads",
  },
];

const DashboardCardBanner = () => {
  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-12 col-md-12 col-sm-12">
          <div className="py-30 px-30 rounded-4 bg-white shadow-3">
            <div className="row y-gap-20 justify-between">
              <div className="col-6">
                <div className="fw-600 lh-14  text-24">{item.title}</div>
                <div className="text-15 lh-14 text-light-1 mt-5 d-none d-sm-block mb-20">
                  {item.description}
                  <br />
                  <br />
                  Instagram does not allow to connect Instagram accounts
                  registered from your country.See the
                  <span> </span>
                  <a href="#" className="text-primary">
                    list of supported countries
                  </a>
                </div>
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
