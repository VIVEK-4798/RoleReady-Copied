import { useState, useEffect } from "react";
import axios from "axios";
import ActionsButton from "./ActionsButton";
import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";
import { useNavigate } from "react-router-dom";
import { getId } from "@/utils/DOMUtils";
import "../../../../../styles/modals.css";
import Pagination from "@/components/hotel-list/common/Pagination";
import { data } from "@/components/dashboard/dashboard/db-dashboard/components/ChartMain";

const VenueTable = ({ searchParameter = "", refresh }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({ page: 1, limit: 10 });
  const [error, setError] = useState(null);
  const [selectedVenues, setSelectedVenues] = useState([]); // Track selected venues
  const navigate = useNavigate();

  // Fetch venues
  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${api}/api/venue/get-venue`, {
        headers: {
          id: getId(),
        },
        params: {
          ...searchParams,
          search: searchParameter,
        },
      });
      if (response.data.success) {
        setVenues(response.data);
        console.log("response.data", response.data.results);
      } else {
        setError("Failed to fetch venues.");
      }
    } catch (err) {
      setError("An error occurred while fetching venues.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [refresh, searchParameter, searchParams]);

  // Handle checkbox selection
  const handleSelectVenue = (venueId) => {
    setSelectedVenues((prev) =>
      prev.includes(venueId)
        ? prev.filter((id) => id !== venueId)
        : [...prev, venueId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedVenues.length === venues.results?.length) {
      setSelectedVenues([]);
    } else {
      setSelectedVenues(venues.results.map((venue) => venue.venue_id));
    }
  };

  // Handle Edit venue
  const handleEdit = (venue) => {
    navigate("/admin-dashboard/venue/edit", { state: venue });
  };

  // Handle Delete venue
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/api/venue/delete-venue/${id}`);
      showAlert("Venue deleted successfully.", "success");
      fetchVenues();
    } catch (error) {
      console.error("Error deleting venue:", error);
      showAlert(error.response?.data?.error || "An error occurred.", "error");
    }
  };

  // Bulk delete selected venues
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedVenues.map((id) =>
          axios.delete(`${api}/api/venue/delete-venue/${id}`)
        )
      );
      showAlert("Selected venues deleted successfully.", "success");
      setSelectedVenues([]);
      fetchVenues();
    } catch (error) {
      console.error("Error deleting venues:", error);
      showAlert("An error occurred while deleting venues.", "error");
    }
  };

  // Bulk set as draft
  const handleBulkDraft = async () => {
    try {
      await axios.put(`${api}/api/venue/update-status`, {
        venueIds: selectedVenues,
        is_enable: false,
      });
      showAlert("Selected venues set to draft successfully.", "success");
      setSelectedVenues([]);
      fetchVenues();
    } catch (error) {
      console.error("Error updating venues:", error);
      showAlert("An error occurred while updating venues.", "error");
    }
  };

  // Bulk make featured
  const handleBulkFeatured = async () => {
    try {
      await axios.put(`${api}/api/venue/update-featured`, {
        venueIds: selectedVenues,
        is_featured: true,
      });
      showAlert("Selected venues set as featured successfully.", "success");
      setSelectedVenues([]);
      fetchVenues();
    } catch (error) {
      console.error("Error updating venues:", error);
      showAlert("An error occurred while updating venues.", "error");
    }
  };

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        {/* Action Buttons */}
        {selectedVenues.length > 0 && (
          <div className="row x-gap-20 y-gap-20 items-center">
          <div className="col-auto">
            <button
              className="button h-50 px-24 -outline-red-1"
              onClick={handleBulkDelete}
            >
              Delete
            </button>
          </div>
          <div className="col-auto">
            <button
              className="button h-50 px-24 -outline-blue-1"
              onClick={handleBulkDraft}
            >
              Set as Draft
            </button>
          </div>
          <div className="col-auto">
            <button
              className="button h-50 px-24 -outline-blue-1"
              onClick={handleBulkFeatured}
            >
              Make Featured
            </button>
          </div>
        </div>
        )}

        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            {loading ? (
              <p>Loading venues...</p>
            ) : error ? (
              <p className="text-red-1">{error}</p>
            ) : venues.length === 0 ? (
              <p>No venues available.</p>
            ) : (
              <div className="overflow-scroll scroll-bar-1">
                <table className="table-3 -border-bottom col-12">
                  <thead className="bg-light-2">
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={
                            selectedVenues.length === venues.results?.length &&
                            venues.results?.length > 0
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th>Owner Name</th>
                      <th>Venue Name</th>
                      <th>City Name</th>
                      <th>Region Name</th>
                      <th>Venue Rate</th>
                      <th>Veg Package Price</th>
                      <th>Non-Veg Package Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venues.results.map((venue) => (
                      <tr key={venue.venue_id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedVenues.includes(venue.venue_id)}
                            onChange={() => handleSelectVenue(venue.venue_id)}
                          />
                        </td>
                        <td>{venue.user_name}</td>
                        <td>{venue.venue_name}</td>
                        <td>{venue.city_name || "N/A"}</td>
                        <td>{venue.region_name || "N/A"}</td>
                        <td>{venue.venue_rate || "N/A"}</td>
                        <td>{venue.veg_package_price || "N/A"}</td>
                        <td>{venue.non_veg_package_price || "N/A"}</td>
                        <td
                          className={
                            venue.is_enable
                              ? "status-published"
                              : "status-draft"
                          }
                        >
                          {venue.is_enable ? "Published" : "Draft"}
                        </td>
                        <td>
                          <ActionsButton
                            venue={venue}
                            onEdit={() => handleEdit(venue)}
                            onDelete={() => handleDelete(venue.venue_id)}
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
        <Pagination
          totalPages={venues?.pagination?.totalPages}
          setSearchParams={setSearchParams}
        />
      </div>
    </>
  );
};

export default VenueTable;