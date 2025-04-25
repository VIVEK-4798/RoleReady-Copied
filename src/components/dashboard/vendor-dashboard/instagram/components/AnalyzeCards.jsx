const data = [
  {
    title: "Get to know your customers, Google Analytics",
    description:
      "Connect your store with Google Analytics to get a deeper understanding of who your customers are, where they come from, and how they interact with your shop.",
    icon: "/img/dashboard/icons/new_10829197.png",
    button: "Set up Google Analytics",
    buttonCls: "px-20 py-10",
    buttonUrl: "google_ads",
  },
];

const AnalyzeCards = () => {
  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-12 col-md-12 col-sm-12">
          <div className="py-10 px-10 rounded-4 bg-white shadow-3">
            <div className="row y-gap-20 flex justify-center items-center">
              <div className="col-6 py-20 px-20">
                <div className="px-30 py-10">
                  <div className="fw-500 lh-14">
                    Post your products to Instagram
                  </div>
                  <div className="text-15 lh-14 text-light-1 mt-5 d-none d-sm-block">
                    Tag your products in Instagram to get them in front of your
                    audience as shoppable Instagram posts.
                  </div>
                </div>
                <div className="px-30 py-10">
                  <div className="fw-500 lh-14">
                    Offer a seamless shopping experience
                  </div>
                  <div className="text-15 lh-14 text-light-1 mt-5 d-none d-sm-block">
                    Open up a new way for mobile shoppers to discover and shop
                    your products with in-app checkout on Instagram.
                  </div>
                </div>
                <div className="px-30 py-10">
                  <div className="fw-500 lh-14">Grow your reach</div>
                  <div className="text-15 lh-14 text-light-1 mt-5 d-none d-sm-block">
                    Showcase products to your followers and millions of
                    potential customers who explore new products on Instagram.
                  </div>
                </div>
              </div>
              <div className="col-6 ">
                <img
                  src="/img/dashboard/icons/5618169.jpg"
                  className="h-auto w-auto"
                  alt="icon"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyzeCards;
