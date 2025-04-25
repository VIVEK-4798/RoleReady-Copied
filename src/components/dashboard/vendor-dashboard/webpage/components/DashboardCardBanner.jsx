import { useState } from "react";

const data = [
  {
    title: "Online Store",
    description:
      "Preview your site to see what it looks like to your customers. Edit your Instant Site at any time to keep its appearance and content up to date.",
    icon: "/img/masthead/5/11240811.jpg",
    buttonUrl: "#",
  },
];

const DashboardCardBanner = () => {
  const [store, setStore] = useState(sessionStorage.getItem("store"));

  const generateRandomString = () => {
    const randomChars = Math.random().toString(36).substring(2, 10);
    const randomNumbers = parseInt(Math.random().toString().slice(2, 10))
      .toString()
      .padStart(8, "0");

    return `${randomChars}${randomNumbers}`;
  };

  if (!store) {
    // project name is dynamic
    const randomStoreName = generateRandomString();
    setStore(randomStoreName);
    sessionStorage.setItem("store", randomStoreName);
  }
  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-12 col-md-12 col-sm-12">
          <div className="py-30 px-30 rounded-4 shadow-3 bg-white">
            <div className="row y-gap-20 justify-between ">
              <div className="col-6">
                <div className="fw-600 lh-14 text-24">{item.title}</div>
                <a
                  href={`/store/${store}`}
                  className="text-15 lh-14 fw-bold text-light-1 text-primary mt-5 d-none d-sm-block mb-20"
                >
                  Visit your webpage store/{store}
                </a>
                <div className="text-15 lh-14 text-light-1   mt-5 d-none d-sm-block mb-20">
                  {item.description}
                </div>
                <a
                  href="#"
                  className="button rounded  px-30 py-10 border-black"
                >
                  Edit Website
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
