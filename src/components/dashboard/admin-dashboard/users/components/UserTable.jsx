import { useState, useEffect } from "react";
import axios from "axios";
import ActionsButton from "./ActionsButton"; // Ensure you reuse the same ActionsButton component
import { api } from "@/utils/apiProvider";
import { useNavigate } from "react-router-dom";
import { getId } from "@/utils/DOMUtils";
import Pagination from "@/components/hotel-list/common/Pagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserTable = ({ searchParameter = "", refresh }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({ page: 1, limit: 10 }); 

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await axios.get(`${api}/api/user/get-users`, {
        headers: {
          id: getId(),
        },
        params : {
          ...searchParams,
          search : searchParameter
        }
      });
      if (response.status === 200) {
        setUsers(response.data);
        console.log(response.data.results);
        
      } else {
        setError("Failed to fetch users.");
      }
    } catch (err) {
      setError("An error occurred while fetching users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  // Handle Search
  useEffect(() => {
    fetchUsers();
  }, [searchParameter, searchParams]);

  // Edit user
  const handleEdit = (user) => {
    navigate("/admin-dashboard/user/edit", { state: user });
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/api/user/delete-users/${id}`);
      toast.success("User deleted successfully.");
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.error || "An error occurred.");
    }
  };  

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            {loading ? (
              <p>Loading users...</p>
            ) : error ? (
              <p className="text-red-1">{error}</p>
            ) : users?.results.length === 0 ? (
              <p>No users available.</p>
            ) : (
              <div className="overflow-scroll scroll-bar-1">
                <table className="table-3 -border-bottom col-12">
                  <thead className="bg-light-2">
                    <tr>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.results.map((user, index) => (
                      <tr key={index}>
                        <td>{user.name || "N/A"}</td>
                        <td>{user.mobile || "N/A"}</td>
                        <td>{user.email || "N/A"}</td>
                        <td>{user.role || "N/A"}</td>
                        <td>
                          <ActionsButton
                            user={user} // Pass user data
                            onEdit={() => handleEdit(user)} // Handle Edit
                            onDelete={() => handleDelete(user.user_id)} // Handle Delete
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
        <Pagination totalPages={users?.pagination?.totalPages} setSearchParams={setSearchParams}/>
      </div>
    </>
  );
};

export default UserTable;