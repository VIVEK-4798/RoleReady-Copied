const Faq = () => {
  const faqContent = [
    {
      id: 1,
      collapseTarget: "One",
      title: "What qualifications are required to apply for an internship?",
      content: `Most internships are open to students or recent graduates. Specific qualifications vary depending on the role and company, but basic communication and learning attitude are usually expected.`,
    },
    {
      id: 2,
      collapseTarget: "Two",
      title: "Are internships paid or unpaid?",
      content: `Internships can be either paid or unpaid depending on the company policy. Paid internships will mention the stipend in the description, while unpaid ones may offer other benefits like experience or certifications.`,
    },
    {
      id: 3,
      collapseTarget: "Three",
      title: "Can I do an internship while studying full-time?",
      content: `Yes, many internships are designed to be part-time or remote, allowing students to manage both their academics and work experience simultaneously.`,
    },
    {
      id: 4,
      collapseTarget: "Four",
      title: "How long does an internship usually last?",
      content: `Internship durations vary but typically range from 1 to 6 months. Some programs may offer extensions based on performance or company requirements.`,
    },
    {
      id: 5,
      collapseTarget: "Five",
      title: "Will I receive a certificate or letter of recommendation?",
      content: `Most companies provide an internship completion certificate. A letter of recommendation may be given based on performance and at the discretion of the mentor or HR.`,
    },
  ];

  return (
    <>
      {faqContent.map((item) => (
        <div className="col-12" key={item.id}>
          <div className="accordion__item px-20 py-20 border-light rounded-4">
            <div
              className="accordion__button d-flex items-center"
              data-bs-toggle="collapse"
              data-bs-target={`#${item.collapseTarget}`}
            >
              <div className="accordion__icon size-40 flex-center bg-light-2 rounded-full mr-20">
                <i className="icon-plus" />
                <i className="icon-minus" />
              </div>
              <div className="button text-dark-1 text-start">{item.title}</div>
            </div>

            <div
              className="accordion-collapse collapse"
              id={item.collapseTarget}
              data-bs-parent="#Faq1"
            >
              <div className="pt-15 pl-60">
                <p className="text-15">{item.content}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Faq;
