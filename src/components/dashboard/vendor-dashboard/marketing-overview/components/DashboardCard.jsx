import { Link } from "react-router-dom";

const data = [
  {
    title: "Advertise through Google",
    description:
      "Advertise your products to people who have displayed interest in similar products. Launch an automated ad campaign in 5 minutes right from your store’s dashboard.",
    icon: "/img/dashboard/icons/growth-graph_5627216.png",
    buttonUrl: "/vendor-dashboard/google_ads",
  },
  {
    title: "Promote and sell on Facebook",
    description:
      "Connect with Facebook to get your very own Facebook Shop and launch an ad campaign to show your products in newsfeed of potential customers.",
    icon: "/img/dashboard/icons/bullhorn_1998087.png",
    buttonUrl: "/vendor-dashboard/facebook_ads",
  },
];

const DashboardCard = () => {
  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-12 col-md-12 col-sm-12">
          <div className="py-10 px-10 rounded-4 bg-white shadow-3">
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
              <div className="col-6">
                <div className="fw-500 lh-14">{item.title}</div>
                {/* <div className="text-26 lh-16 fw-600 mt-5">{item.amount}</div> */}
                <div className="text-15 lh-14 text-light-1 mt-5 d-none d-sm-block">
                  {item.description}
                </div>
              </div>
              <div className="col-auto">
                <Link
                  to={item.buttonUrl}
                  className={`button bg-primary rounded text-white px-60 py-10`}
                >
                  Get started
                </Link>
                {/* <a
                  className="button bg-primary rounded text-white px-60 py-10"
                  href={item.buttonUrl}
                >
                  Get started
                </a> */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;
