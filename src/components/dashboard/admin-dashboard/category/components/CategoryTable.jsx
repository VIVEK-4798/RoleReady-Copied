import { useState, useEffect } from "react";
import axios from "axios";
import { SketchPicker } from "react-color"; // Import SketchPicker from react-color
import { api } from "@/utils/apiProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Pagination from "../../common/Pagination";
import ActionsButton from "./ActionsButton";

const CategoryTable = ({ searchParameter, refresh }) => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [categoryData, setCategoryData] = useState({
    category_id: null,
    category_name: "",
    category_color_class: "#ffffff", // Default color
  });

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await axios.get(`${api}/api/categories/get-categories`);
      if (response.data.success) {
        setCategories(response.data.results);
        setFilteredCategories(response.data.results); // Set both main and filtered data
      } else {
        setError("Failed to fetch categories.");
      }
    } catch (err) {
      setError("An error occurred while fetching categories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  // Handle Search
  useEffect(() => {
    const lowercasedTerm = searchParameter.toLowerCase();
    const filtered = categories.filter((category) =>
      category.category_name.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredCategories(filtered);
  }, [searchParameter]);

  // Edit category
  const handleEdit = (category) => {
    setCategoryData({
      category_id: category.category_id,
      category_name: category.category_name,
      category_color_class: category.category_color_class || "#ffffff", // Default to white if empty
    });
    setEditMode(true);
    setShowModal(true);
  };

  // Update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${api}/api/categories/update-categories/${categoryData.category_id}`,
        categoryData
      );
      toast.success("Category updated successfully.");
      setShowModal(false);
      fetchCategories(); // Refresh categories list
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.error || "An error occurred.");
    }
  };  

  // Delete category
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/api/categories/delete-categories/${id}`);
      toast.success("Category deleted successfully.");
      fetchCategories(); // Refresh categories list
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.error || "An error occurred.");
    }
  };  

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            {loading ? (
              <p>Loading categories...</p>
            ) : error ? (
              <p className="text-red-1">{error}</p>
            ) : filteredCategories.length === 0 ? (
              <p>No categories available.</p>
            ) : (
              <div className="overflow-scroll scroll-bar-1">
                <table className="table-3 -border-bottom col-12">
                  <thead className="bg-light-2">
                    <tr>
                      <th>Category Name</th>
                      <th>Badge Color</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category, index) => (
                      <tr key={index}>
                        <td>{category.category_name || "N/A"}</td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <div
                              style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor:
                                  category.category_color_class || "#ccc",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                              }}
                            ></div>
                            <span>{category.category_color_class || "N/A"}</span>
                          </div>
                        </td>
                        <td>
                          <ActionsButton
                            category={category} // Passing the category data
                            onEdit={() => handleEdit(category)} // Handle Edit
                            onDelete={() => handleDelete(category.category_id)} // Handle Delete
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
      {/* Pagination can be added here */}

      {/* Edit Category Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editMode ? "Edit Venue Category" : "Add Category"}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Category Name:
                <input
                  type="text"
                  value={categoryData.category_name}
                  onChange={(e) =>
                    setCategoryData({
                      ...categoryData,
                      category_name: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
              Category Badge Color:
                <SketchPicker
                  color={categoryData.category_color_class}
                  onChangeComplete={(color) =>
                    setCategoryData({
                      ...categoryData,
                      category_color_class: color.hex,
                    })
                  }
                />
              </label>
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
    </>
  );
};

export default CategoryTable;
