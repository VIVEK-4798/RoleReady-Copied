import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const DetailsAndPricing = ({
  venueFormData = {},
  handleChange = () => {},
  allCategories = [],
  handleCategoryDropDownChange,
  handleDropDownChange
}) => {
  const renderSelectedCategory = () => {
    return venueFormData.venue_categories?.length === 0 ? (
      "Select Categories"
    ) : (
      venueFormData.venue_categories.map((category) => (
        <div
          key={category.category_id}
          className={`py-5 px-15 mr-5 rounded-right-4 text-12 lh-16 fw-500 uppercase text-white`}
          style={{
            backgroundColor: category.category_color_class,
            width: "fit-content",
          }}
        >
          {category.category_name}
        </div>
      ))
    );
  };

  return (
    <div className="col-xl-10">
      <div className="text-18 fw-500 mb-10">Details & Pricing</div>
      <div className="row x-gap-20 y-gap-20">
        {/* Overview */}
        <div className="col-12">
          <ReactQuill
            value={venueFormData?.venue_overview}
            onChange={(text) => {
              handleDropDownChange({ name: "venue_overview", value: text });
            }}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                ["clean"],
              ],
            }}
            formats={[
              "header",
              "bold",
              "italic",
              "underline",
              "strike",
              "list",
              "bullet",
              "link",
            ]}
            placeholder="Write overview for your Internship..."
          />
        </div>

        {/* Responsibilities */}
        <div className="col-12">
          <div className="form-input">
            <input
              type="text"
              required
              name="responsibilities"
              value={venueFormData?.responsibilities || ""}
              onChange={handleChange}
            />
            <label className="lh-1 text-16 text-light-1">
              Responsibilities of the Intern
            </label>
          </div>
        </div>

        {/* Requirements */}
        <div className="col-12">
          <div className="form-input">
            <input
              type="text"
              required
              name="requirements"
              value={venueFormData?.requirements || ""}
              onChange={handleChange}
            />
            <label className="lh-1 text-16 text-light-1">Requirements</label>
          </div>
        </div>

        {/* Perks */}
        <div className="col-12">
          <div className="form-input">
            <input
              type="text"
              required
              name="perks"
              value={venueFormData?.perks || ""}
              onChange={handleChange}
            />
            <label className="lh-1 text-16 text-light-1">Perks</label>
          </div>
        </div>

        {/* Eligibility */}
        <div className="col-12">
          <div className="form-input">
            <input
              type="text"
              required
              name="eligibility"
              value={venueFormData?.eligibility || ""}
              onChange={handleChange}
            />
            <label className="lh-1 text-16 text-light-1">Eligibility</label>
          </div>
        </div>

        {/* Categories Dropdown */}
        <div className="col-12">
          <div
            className="form-input"
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px",
            }}
          >
            <div className="dropdown js-dropdown js-services-active w-100">
              <div
                className="dropdown__button d-flex items-center justify-between bg-white rounded-4 w-100 text-14 px-20 h-50 text-14"
                data-bs-toggle="dropdown"
                data-bs-auto-close="true"
                aria-expanded="false"
                data-bs-offset="0,10"
              >
                <span className="d-flex js-dropdown-title">
                  {renderSelectedCategory()}
                </span>
                <i className="icon icon-chevron-sm-down text-7 ml-10" />
              </div>
              <div className="toggle-element -dropdown w-100 dropdown-menu">
                <div className="text-14 y-gap-15 js-dropdown-list">
                  {allCategories.map((category) => (
                    <div
                      key={category.category_id || index}
                      id={category.category_id}
                      className="js-dropdown-link"
                      style={{
                        color: venueFormData?.venue_categories?.some(
                          (selected) =>
                            category.category_name === selected.category_name
                        )
                          ? category.category_color_class
                          : "inherit",
                        flex: "0 0 130px",
                        borderRadius: "0 15px 15px 0",
                      }}
                      onClick={() => handleCategoryDropDownChange(category)}
                    >
                      {category.category_name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Internship Type/Timing */}
        <div className="col-12 ">
          <div className="form-input ">
            <select
              name="internship_type"
              required
              value={venueFormData?.internship_type || ""}
              onChange={handleChange}
              className="form-select"
            >
              <option value="" disabled>Select Internship Type/Timing</option>
              <option value="Full-Time">Full-Time (9am - 6pm)</option>
              <option value="Part-Time">Part-Time (Flexible Hours)</option>
              <option value="Hybrid">Hybrid (3 Days Office + Remote)</option>
              <option value="Remote">Remote Only</option>
              <option value="Weekend">Weekend Internship</option>
              <option value="Night Shift">Night Shift Internship</option>
            </select>
          </div>
        </div>
        {/* Work Detail */}
        <div className="col-12">
          <div className="form-input">
            <input
              type="text"
              required
              name="work_detail"
              value={venueFormData?.work_detail || ""}
              onChange={handleChange}
            />
            <label className="lh-1 text-16 text-light-1">Work Detail (Ex - 5 days)</label>
          </div>
        </div>

        {/* Internship Stipend */}
        <div className="col-6">
          <div className="form-input">
            <input
              type="number"
              required
              name="stipend"
              value={venueFormData?.stipend || ""}
              onChange={handleChange}
            />
            <label className="lh-1 text-16 text-light-1">Internship Stipend</label>
          </div>
        </div>

        {/* Duration */}
        <div className="col-6">
          <div className="form-input">
            <input
              type="number"
              required
              name="duration_months"
              value={venueFormData?.duration_months || ""}
              onChange={handleChange}
            />
            <label className="lh-1 text-16 text-light-1">Internship Duration in months</label>
          </div>
        </div>
      </div>
      <div className="border-top-light mt-30 mb-30" />
    </div>
  );
};

export default DetailsAndPricing;
