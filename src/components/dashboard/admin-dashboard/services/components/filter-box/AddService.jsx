import { useState } from "react";
import "../../../../../../styles/modals.css";
import axios from "axios";
import { api } from "@/utils/apiProvider";
import GalleryUploader from "./GalleryUploader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddService = ({ refreshServices = () => {} }) => {
  const [showModal, setShowModal] = useState(false);
  const [serviceData, setServiceData] = useState({
    service_name: "",
    service_img: [],
    is_featured: false,
  });

  const handleImageUpload = (uploadedImages) => {
    setServiceData((prevServiceData) => ({
      ...prevServiceData,
      service_img: uploadedImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting service data:", serviceData);
      const response = await axios.post(
        `${api}/api/service/add-service`,
        { ...serviceData, service_img: JSON.stringify(serviceData.service_img) }
      );
      console.log("Response:", response);
  
      if (response.data.success === true) {
        toast.success("Service added successfully.");
        setServiceData({
          service_name: "",
          service_img: [],
          is_featured: false,
        });
        setShowModal(false);
        refreshServices();
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting service data:", error);
      toast.error(error.response?.data?.error || "An error occurred.");
    }
  };
  

  return (
    <div className="col-auto">
      {/* Add Service Button */}
      <button
        className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
        onClick={() => setShowModal(true)}
      >
        Add Service
        <div className="icon-arrow-top-right ml-15"></div>
      </button>

      {/* Add Service Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Service</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Service Name:
                <input
                  type="text"
                  value={serviceData.service_name}
                  onChange={(e) =>
                    setServiceData((prevServiceData) => ({
                      ...prevServiceData,
                      service_name: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label>
                Is Featured:
                <input
                  type="checkbox"
                  checked={serviceData.is_featured}
                  onChange={(e) =>
                    setServiceData((prevServiceData) => ({
                      ...prevServiceData,
                      is_featured: e.target.checked,
                    }))
                  }
                  style={{
                    width: '10%',
                    padding: '8px',
                    marginBottom: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                />
              </label>
              <GalleryUploader
                serviceFormData={serviceData}
                setServiceFormData={setServiceData}
                onUploadComplete={handleImageUpload}
                maxFiles={1}
              />
              <div className="modal-actions">
                <button type="submit" className="button bg-blue-1 text-white">
                  Submit
                </button>
                <button
                  type="button"
                  className="button bg-light-2 text-dark-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddService;