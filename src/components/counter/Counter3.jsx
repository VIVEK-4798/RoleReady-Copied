const Counter3 = () => {
  const blockContent = [
    {
      id: 1,
      number: "4,958",
      meta: "Startups",
      hasUnit: "",
      delayAnim: "100",
    },
    {
      id: 2,
      number: "2,869",
      meta: "Internships",
      hasUnit: "",
      delayAnim: "200",
    },
    {
      id: 3,
      number: "2",
      meta: "Deals",
      hasUnit: "M",
      delayAnim: "300",
    },
    {
      id: 4,
      number: "574,974",
      meta: "Investor",
      hasUnit: "",
      delayAnim: "400",
    },
  ];
  return (
    <>
      {blockContent.map((item) => (
        <div
          className="col-xl-3 col-6"
          key={item.id}
          data-aos="fade"
          data-aos-delay={item.delayAnim}
        >
          <div className="text-40 lh-13 text-blue-1 fw-600">
            {item.number}
            {item.hasUnit}
          </div>
          <div className="text-25 lh-14 text-blue-1 mt-5">{item.meta}</div>
        </div>
      ))}
    </>
  );
};

export default Counter3;
