const data = [
  {
    title: "Effortless search advertising",
    description:
      "Use Google Shopping to increase presence in search engines and get found more easily by customers. Sell your products on free channels like the Shopping tab and through paid channels with Google Ads in a few simple steps. Just set a budget and your target audience to start your Google Shopping advertising campaign.",
    icon: "/img/dashboard/icons/google-marketing.png",
    buttonUrl: "google_ads",
  },
];

const DashboardCard = () => {
  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-12 col-md-12 col-sm-12">
          <div className="py-30 px-30 rounded-4 bg-white shadow-3">
            <div className="row y-gap-20 justify-between items-center">
              <div className="col-6 ">
                <img src={item.icon} className="h-auto w-auto" alt="icon" />
              </div>
              <div className="col-6">
                <div className="fw-500 lh-14">{item.title}</div>
                <div className="text-15 lh-14 text-light-1 mt-5 d-none d-sm-block mb-20">
                  {item.description}
                </div>
                <a
                  className="button bg-primary rounded text-white px-30 py-10"
                  href={item.buttonUrl}
                >
                  Enable
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;
