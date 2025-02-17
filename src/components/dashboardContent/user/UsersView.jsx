import React, { useState, useEffect } from "react";
export default function UsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  if (!token) {
    setError("No authentication token found");
    console.log(error);
    return;
  }
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3010/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Authentication failed. Please login again.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const usersArray = responseData.payload.data;
        // setUsers(usersArray);
        setTimeout(() => {
          setUsers(usersArray);
          setLoading(false);
          setError(null);
        }, 1000);
        // Wait 2 seconds even if data is ready
      } catch (err) {
        setError(err.message);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);


  // Delete user handler
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setDeletingId(userId);
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:3010/api/users/delete/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update UI by filtering out deleted user
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setError(null);
    } catch (err) {
      setError(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 d:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 d:bg-gray-700 d:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Role
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users?.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="bg-white border-b d:bg-gray-800 d:border-gray-700 border-gray-200">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap d:text-white"
                >
                  {user.id}
                </th>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={deletingId === user.id}
                    className="delete-btn"
                  >
                    {deletingId === user.id ? (
                      <span className="deleting-spinner" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <p>Loading</p>
          )}
        </tbody>
      </table>
    </div>
  );
}
