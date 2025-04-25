const data = [
  {
    title: "Get your own web address for your store",
    description:
      "Help customers easily remember and find you on the internet. Choose and buy a perfect domain for your business right from your control panel. The new domain will be connected to your Instant Site.",
    icon: "/img/masthead/5/9910414.jpg",
    buttonUrl: "google_ads",
  },
];

const DashboardCardBanner2 = () => {
  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-12 col-md-12 col-sm-12">
          <div className="py-30 px-30 rounded-4 shadow-3  bg-warning">
            <div className="row y-gap-20 justify-between">
              <div className="col-6">
                <div className="fw-600 lh-14 text-white text-22">
                  {item.title}
                </div>
                <div className="text-15 lh-14  text-white  text-light-1 mt-5 d-none d-sm-block mb-20">
                  {item.description}
                </div>
                <a
                  href="/pricing"
                  className="button bg-success rounded text-white px-10 py-10"
                >
                  Upgrade to buy domain
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

export default DashboardCardBanner2;
