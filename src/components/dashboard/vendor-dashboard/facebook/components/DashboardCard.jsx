const data = [
  {
    title: "Step 1: Add your products to Facebook",
    description:
      "Connect with Facebook to get your products into your very own Facebook Shop.",
    icon: "/img/dashboard/icons/social-media_8644426.png",
    buttonUrl: "google_ads",
    button: "Connect Facebook",
  },
  {
    title: "Step 2: Set up Facebook Pixel",
    description:
      "Insert a free Facebook Pixel into your store that will track visitors and enable you to display ads to those who left without a purchase. Get Pixel ID",
    icon: "/img/dashboard/icons/bullhorn_1998087.png",
    buttonUrl: "facebook_ads",
    button: "",
  },
  {
    title: "Step 3: Launch your ad campaign",
    description:
      "You are now ready to run ads on Facebook. Proceed to Facebook to specify ad details and start your campaign.",
    icon: "/img/dashboard/icons/social-media-marketing_10846647.png",
    buttonUrl: "facebook_ads",
    button: "",
  },
];

const DashboardCard = () => {
  return (
    <div className="row y-gap-5">
      {data.map((item, index) => (
        <div key={index} className="col-xl-12 col-md-12 col-sm-12">
          <div className="py-30 px-10 rounded-4 bg-white shadow-3">
            <div className="row y-gap-20 flex justify-center items-center">
              <div className="col-auto ">
                <img
                  src={item.icon}
                  className="h-auto w-auto"
                  style={{
                    maxWidth: "4rem",
                    maxHeight: "4rem",
                    // marginLeft: "2rem",
                  }}
                  alt="icon"
                />
              </div>
              <div className={item.button !== "" ? `col-6` : `col-9`}>
                <div className="fw-500 lh-14">{item.title}</div>
                {/* <div className="text-26 lh-16 fw-600 mt-5">{item.amount}</div> */}
                <div className="text-15 lh-14 text-light-1 mt-5 d-none d-sm-block">
                  {item.description}
                </div>
              </div>
              {item.button !== "" && (
                <div className="col-auto">
                  <a
                    className="button bg-primary rounded text-white px-20 py-10"
                    href={item.buttonUrl}
                  >
                    {item.button}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;
