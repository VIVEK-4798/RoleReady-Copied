const WhyChooseUs = () => {
  const expertContent = [
    {
      id: 1,
      icon: "/img/featureIcons/1/1.svg",
      title: "Check Your Eligibility",
      text: `A startup must meet certain criteria to be considered eligible for DPIIT Recognition.`,
    },
    {
      id: 2,
      icon: "/img/featureIcons/1/2.svg",
      title: "Get Recognised",
      text: `Click here to know more about the recognition process & apply as a Startup.`,
    },
    {
      id: 3,
      icon: "/img/featureIcons/1/3.svg",
      title: "Notifications",
      text: `Stay on top of Recognition & Tax Exemption updates.`,
    },
    {
      id: 4,
      icon: "/img/featureIcons/1/3.svg",
      title: "Validate Certificate",
      text: `Click here to verify your Recognition/Tax Exemption certificates.`,
    },
  ];

  return (
    <>
      <div className="section-bg__item -right -image col-5 md:mb-60 sm:mb-40">
        <img src="/img/masthead/11/dpiitimg.png" alt="image" />
      </div>
      {/* End right video popup icon with image */}

      <div className="container">
        <div className="row">
          <div className="col-xl-4 col-md-7">
            <h2 className="text-30 fw-600">DPIIT Recognition</h2>
            <p className="mt-5">
            Support Network for Indian Startups
            </p>
            <div className="row y-gap-30 pt-60 md:pt-40">
              {expertContent.map((item) => (
                <div className="col-12" key={item.id}>
                  <div className="d-flex pr-30">
                    <img className="size-50" src={item.icon} alt="image" />
                    <div className="ml-15">
                      <h4 className="text-18 fw-500">{item.title}</h4>
                      <p className="text-15 mt-10">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* End left local expert content */}
    </>
  );
};

export default WhyChooseUs;
