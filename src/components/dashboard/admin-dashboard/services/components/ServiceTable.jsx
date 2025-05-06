import { useState, useEffect } from "react";
import axios from "axios";
// import Pagination from "../../common/Pagination";
import ActionsButton from "./ActionsButton";
import { api } from "@/utils/apiProvider";
import GalleryUploader from "./filter-box/GalleryUploader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceTable = ({ searchParameter, refresh }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [serviceData, setServiceData] = useState({
    service_id: null,
    service_name: "",
    service_img: [],
    new_image: null, // For uploading a new image
    is_featured: false,
  });

  // Fetch services
  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${api}/api/service/get-services`);
      if (response.data.success) {
        setServices(response.data.results);
        setFilteredServices(response.data.results);
      } else {
        setError("Failed to fetch services.");
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("An error occurred while fetching services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [refresh]);

  // Unified Search Logic
  useEffect(() => {
    const lowercasedTerm = searchParameter.toLowerCase();
    const filtered = services.filter((service) =>
      service.service_name.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredServices(filtered);
  }, [searchParameter]);

  // Edit service
  const handleEdit = (service) => {
    setServiceData({
      service_id: service.service_id,
      service_name: service.service_name,
      service_img: JSON.parse(service.service_img || "[]"), // Existing images
      new_image: null, // Reset new image field
      is_featured: service.is_featured || false,
    });
    setEditMode(true);
    setShowModal(true);
  };

  // Update service
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${api}/api/service/update-services/${serviceData.service_id}`, {
        ...serviceData,
        service_img: JSON.stringify(serviceData.service_img),
      });
  
      toast.success("Service updated successfully.");
      setShowModal(false);
      fetchServices(); // Refresh services list
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error(error.response?.data?.error || "An error occurred.");
    }
  };
  
  // Delete service
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/api/service/delete-services/${id}`);
      toast.success("Service deleted successfully.");
      fetchServices(); // Refresh services list
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error(error.response?.data?.error || "An error occurred.");
    }
  };  

  // Handle new image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setServiceData((prevServiceData) => ({
        ...prevServiceData,
        new_image: file,
      }));
    }
  };

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            {loading ? (
              <p>Loading services...</p>
            ) : error ? (
              <p className="text-red-1">{error}</p>
            ) : filteredServices.length === 0 ? (
              <p>No services available.</p>
            ) : (
              <div className="overflow-scroll scroll-bar-1">
                <table className="table-3 -border-bottom col-12">
                  <thead className="bg-light-2">
                    <tr>
                      <th>Service Name</th>
                      <th>Image</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((service, index) => (
                      <tr key={index}>
                        <td>{service.service_name || "N/A"}</td>                        
                        <td>
                          <img
                            src={
                              service.service_img
                                ? JSON.parse(service.service_img)[0]
                                : "placeholder-image-url"
                            }
                            alt={service.service_name || "Service"}
                            style={{ width: "50px", height: "50px" }}
                          />
                        </td>
                        <td>{service.is_featured ? "Yes" : "No"}</td>
                        <td>
                          <ActionsButton
                            service={service}
                            onEdit={() => handleEdit(service)}
                            onDelete={() => handleDelete(service.service_id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* if want pagination insert here   <Pagination /> */}
      {/* Edit Service Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editMode ? "Edit Service" : "Add Service"}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Service Name:
                <input
                  type="text"
                  value={serviceData.service_name}
                  onChange={(e) =>
                    setServiceData({ ...serviceData, service_name: e.target.value })
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
                    setServiceData({
                      ...serviceData,
                      is_featured: e.target.checked,
                    })
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
                  Update
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
    </>
  );
};

export default ServiceTable;