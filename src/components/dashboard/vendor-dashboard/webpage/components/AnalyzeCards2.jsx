import { useState } from "react";

const data = [
  {
    title: "Site address",
    description:
      "Use a name for your address at the free subdomain provided by Webeazzy if you don’t want to use your own domain. You can change the subdomain name at any time.",
    icon: "/img/dashboard/icons/tablet_2110497.png",
    button: "Change Address",
    buttonCls: "px-20 py-10",
    buttonUrl: "#",
  },
  {
    title: "Connect an existing domain to your site",
    description:
      "Link your Instant Site with your own purchased domain if you have one. The feature is available with the Venture plan or higher.",
    icon: "/img/dashboard/icons/web_13618510.png",
    button: "Upgrade",
    buttonCls: "px-40 py-10",
    buttonUrl: "/pricing",
  },
];

const AnalyzeCards2 = () => {
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
                  {item.title === "Site address" && (
                    <>
                      {" "}
                      <br />
                      <a
                        href={`store/${store}`}
                        className="text-primary fw-500"
                      >
                        Current address: store/{store}
                      </a>
                    </>
                  )}
                </div>
              </div>
              <div className="col-auto">
                <a
                  className={`button bg-success rounded text-white col-auto ${item.buttonCls}`}
                  href={item.buttonUrl}
                >
                  {item.button}
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyzeCards2;
