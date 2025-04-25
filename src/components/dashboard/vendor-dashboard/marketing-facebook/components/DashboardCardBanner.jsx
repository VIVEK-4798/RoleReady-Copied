const data = [
  {
    title: "Setup guide",
    description:
      "Facebook is visited by millions of users daily. Running ads on Facebook lets you show your products in newsfeed of users who match your target audience.",
    icon: "/img/dashboard/icons/5618169.jpg",
    buttonUrl: "google_ads",
  },
];

const DashboardCardBanner = () => {
  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-12 col-md-12 col-sm-12">
          <div className="py-30 px-30 rounded-4 bg-white shadow-3">
            <div className="row y-gap-20 justify-between items-center">
              <div className="col-6">
                <div className="fw-600 lh-14">{item.title}</div>
                <div className="text-15 lh-14 text-light-1 mt-5 d-none d-sm-block mb-20">
                  {item.description}
                  <br />
                  <br />
                  Start your ad campaign in 3 simple steps. For a detailed setup
                  guide, please visit{" "}
                  <a href="#" className="text-primary">
                    Help Center
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
