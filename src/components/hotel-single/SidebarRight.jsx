import FilterBox from "../../components/hotel-single/filter-box";

const SidebarRight = ({ internship }) => {
  return (
    <aside className="ml-50 lg:ml-0">
      <div className="px-30 py-30 border-light rounded-4 shadow-4">
        <div style={{ display: 'flex',flexDirection:"column", justifyContent: 'space-between' }}>
          {/* Stipend Section */}
          <div className="mb-20">
            <span className="text-20 fw-500">Stipend: ₹{internship?.stipend}</span>
            <span className="text-14 text-light-1 ml-5">per month</span>
          </div>

          {/* Internship Type */}
          <div className="mb-20">
            <div className="lh-15 fw-500">Internship Type: {internship?.internship_type}</div>
          </div>

          {/* Duration */}
          <div className="mb-20">
            <div className="lh-15 text-light-1">Duration: {internship?.duration_months} months</div>
          </div>

          {/* Work Detail */}
          <div>
            <div className="lh-15 text-light-1">Work Detail: {internship?.work_detail}</div>
          </div>

        </div>
        {/* End d-flex */}

        {/* FilterBox */}
        <div className="row y-gap-20 ">
          <FilterBox />
        </div>
      </div>
      {/* End px-30 FilterBox */}
    </aside>
  );
};

export default SidebarRight;
