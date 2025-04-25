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
                  <div className="fw-500 lh-14">Grow your reach</div>
                  <div className="text-15 lh-14 text-light-1 mt-5 d-none d-sm-block">
                    Advertise and sell your products directly through your
                    Facebook page and reach billions of potential customers.
                  </div>
                </div>
                <div className="px-30 py-10">
                  <div className="fw-500 lh-14">Increase your revenue</div>
                  <div className="text-15 lh-14 text-light-1 mt-5 d-none d-sm-block">
                    Merchants see an average increase of 15% in revenue when
                    selling on Facebook.
                  </div>
                </div>
                <div className="px-30 py-10">
                  <div className="fw-500 lh-14">Easy checkout</div>
                  <div className="text-15 lh-14 text-light-1 mt-5 d-none d-sm-block">
                    With Facebook Shop, your customers will easily browse
                    products on mobile and checkout on any device.
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
