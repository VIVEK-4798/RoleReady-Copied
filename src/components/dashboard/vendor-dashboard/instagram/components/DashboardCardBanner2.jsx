const data = [
  {
    title: "Make your Instagram page shoppable with Linkup",
    description:
      "Linkup is a mobile-friendly landing page that can be placed in the Links section of your Instagram bio. Share your most important content, including new arrivals, best-selling products, reviews, and more. Customize page design to make it suitable for your business. Track analytics to get insights into customer’s behavior and increase revenue.",
    icon: "/img/masthead/5/instagram-marketing.png",
    buttonUrl: "google_ads",
  },
];

const DashboardCardBanner2 = () => {
  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-12 col-md-12 col-sm-12">
          <div className="py-30 px-30 rounded-4 bg-white shadow-3">
            <div className="row y-gap-20 justify-between items-center">
              <div className="col-6">
                <div className="fw-600 lh-14 text-22">{item.title}</div>
                <div className="text-15 lh-14 text-light-1 mt-5 d-none d-sm-block mb-20">
                  {item.description}
                </div>
                <a className="button bg-primary rounded text-white px-30 py-10 col-6">
                  Manage Linkup
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
