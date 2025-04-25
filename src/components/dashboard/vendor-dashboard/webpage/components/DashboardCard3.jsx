import { Link } from "react-router-dom";

const data = [
  {
    title: "Site appearance",
    description:
      "Customize your site the way you like it. Upload your logo and background image, adjust the color of texts and other elements, change your site’s layout and style without getting into code.",
    icon: "/img/dashboard/icons/web-design_14680382.png",
    buttonUrl: "#",
  },
  {
    title: "Site content",
    description:
      "Fill up your site with the info about your business: describe who you are, add social proof and links to your social media. Update the content of your site to promote special events and stay connected with your customers.",
    icon: "/img/dashboard/icons/diy_3999884.png",
    buttonUrl: "#",
  },
];

const DashboardCard3 = () => {
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
                  className={`button bg-success rounded text-white px-60 py-10`}
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard3;
