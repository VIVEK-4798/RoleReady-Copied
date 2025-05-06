import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const DetailsAndPricing = ({
  vendorData,
  handleComponentDelete,
  handleChange = () => {},
  services = [],
  handleServiceDropDownChange,
  component,
  handleComponentChange,
  handleSubmitComponent,
  handleDropDownChange
}) => {
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const validationErrors = {};
    if (!component?.component_name?.trim()) {
      validationErrors.component_name = "Component Name is required.";
    }
    if (!component?.component_remark?.trim()) {
      validationErrors.component_remark = "Remark is required.";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      handleSubmitComponent();
    }
  };

  const renderSelectedService = () => {
    return vendorData?.vendor_service !== "" ? (
      <div
        className="py-5 px-15 mr-5 bg-blue-1 rounded-right-4 text-12 lh-16 fw-500 uppercase text-white"
        style={{ width: "fit-content" }}
      >
        {vendorData?.vendor_service}
      </div>
    ) : (
      <div>Select Service Category</div>
    );
  };

  return (
    <div className="col-xl-10">
  <div className="text-18 fw-500 mb-10">Details & Pricing</div>

  <div className="row x-gap-20 y-gap-20">
    {/* Overview */}
    <div className="col-12">
      <ReactQuill
        value={vendorData?.vendor_overview}
        onChange={(text) =>
          handleDropDownChange({ name: "vendor_overview", value: text })
        }
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
        placeholder="Write overview about the job..."
      />
    </div>

    {/* Service Dropdown */}
    <div className="col-12">
      <div className="form-input mb-15" style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}>
        <div className="dropdown js-dropdown js-services-active w-100">
          <div
            className="dropdown__button d-flex items-center justify-between bg-white rounded-4 w-100 text-14 px-20 h-50"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="d-flex js-dropdown-title">{renderSelectedService()}</span>
            <i className="icon icon-chevron-sm-down text-7 ml-10" />
          </div>
          <div className="toggle-element -dropdown w-100 dropdown-menu">
            <div className="text-14 y-gap-15 js-dropdown-list">
              {services.map((service, index) => (
                <div
                  key={index}
                  id={service.service_id}
                  className={service.service_name === vendorData.vendor_service ? "text-blue-1" : ""}
                  onClick={() => handleServiceDropDownChange(service)}
                >
                  {service.service_name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Responsibilities */}
    <div className="col-12">
      <div className="form-input mb-15">
        <input
          type="text"
          name="responsibilities"
          value={vendorData?.responsibilities || ""}
          onChange={handleChange}
          required
        />
        <label className="lh-1 text-16 text-light-1">Job Responsibilities</label>
      </div>
    </div>

    {/* Requirements */}
    <div className="col-12">
      <div className="form-input mb-15">
        <input
          type="text"
          name="requirements"
          value={vendorData?.requirements || ""}
          onChange={handleChange}
          required
        />
        <label className="lh-1 text-16 text-light-1">Requirements</label>
      </div>
    </div>

    {/* Perks */}
    <div className="col-12">
      <div className="form-input mb-15">
        <input
          type="text"
          name="perks"
          value={vendorData?.perks || ""}
          onChange={handleChange}
          required
        />
        <label className="lh-1 text-16 text-light-1">Perks</label>
      </div>
    </div>

    {/* Eligibility */}
    <div className="col-12">
      <div className="form-input mb-15">
        <input
          type="text"
          name="eligibility"
          value={vendorData?.eligibility || ""}
          onChange={handleChange}
          required
        />
        <label className="lh-1 text-16 text-light-1">Eligibility</label>
      </div>
    </div>

    {/* Job Type */}
    <div className="col-12">
      <div className="form-input mb-15">
        <select
          name="job_type"
          value={vendorData?.job_type || ""}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="" disabled>Select Job Type/Timing</option>
          <option value="Full-Time">Full-Time (9am - 6pm)</option>
          <option value="Part-Time">Part-Time (Flexible Hours)</option>
          <option value="Hybrid">Hybrid (3 Days Office + Remote)</option>
          <option value="Remote">Remote Only</option>
          <option value="Shift-Based">Shift-Based Job</option>
          <option value="Freelance">Freelance / Contract-Based</option>
        </select>
      </div>
    </div>

    {/* Work Detail */}
    <div className="col-12 mb-15">
      <div className="form-input">
        <input
          type="text"
          name="work_detail"
          value={vendorData?.work_detail || ""}
          onChange={handleChange}
          required
        />
        <label className="lh-1 text-16 text-light-1">Work Detail (e.g., 5 Days a Week)</label>
      </div>
    </div>

    {/* Salary & Experience */}
    <div className="row">
      <div className="col-6">
        <div className="form-input mb-15">
          <input
            type="number"
            name="job_salary"
            value={vendorData?.job_salary || ""}
            onChange={handleChange}
            required
          />
          <label className="lh-1 text-16 text-light-1">Salary (₹ per month)</label>
        </div>
      </div>

      <div className="col-6">
        <div className="form-input mb-15">
          <input
            type="number"
            name="work_experience"
            value={vendorData?.work_experience || ""}
            onChange={handleChange}
            required
          />
          <label className="lh-1 text-16 text-light-1">Experience (in years)</label>
        </div>
      </div>
    </div>
  </div>

  <div className="border-top-light mt-30 mb-30" />
</div>

  );
};

export default DetailsAndPricing;
