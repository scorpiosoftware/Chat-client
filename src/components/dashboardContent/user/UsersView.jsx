import React, { useState, useEffect } from "react";
import UserService from '../../../Services/UserService';
export default function UsersView() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({name: "",email: "",role: ""});
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("token");
  if (!token) {
    setError("No authentication token found");
    console.log(error);
    return;
  }

  // Fetch Users Data from End Point APU
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await UserService.getUsers();
        const usersArray = userData.payload.data;
        setTimeout(() => {
          setUsers(usersArray);
          setLoading(false);
          setError(null);
        }, 350);
      } catch (err) {
        setError(err.message);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const UpdateUserHandler = async (userId) => {
    if (!window.confirm("Are you sure you want to modify this user?")) return;
    try {

      const formData = {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
      }
      await UserService.updateUser(userId, formData);
      // Update UI by filtering out deleted user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, ...formData } : user
        )
      );
      setError(null);
    } catch (err) {
      setError(`Update Failed: ${err.message}`);
    } finally {
      // setDeletingId(null);
    }
  }


  // Delete User Button Event
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setDeletingId(userId);
      await UserService.deleteUserById(deletingId);
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
      <div className="flex justify-start items-center space-x-10 max-w-screen-2xl p-4">

        <div className="flex justify-start items-center gap-x-4">
          <label htmlFor="name">Name</label>
          <input onChange={handleChange} type="text" name="name" value={selectedUser.name} id="name" />
        </div>
        <div className="flex justify-start items-center gap-x-4">
          <label htmlFor="email">email</label>
          <input onChange={handleChange} type="text" name="email" value={selectedUser.email} id="email" />
        </div>
        <div className="flex justify-start items-center gap-x-4">
          <label htmlFor="name">Name</label>
          <select onChange={handleChange} name="role" value={selectedUser.role} id="role">
            <option value="user">User</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <button onClick={() => UpdateUserHandler(selectedUser.id)} className="rounded-full px-4 py-1 border cursor-pointer bg-green-200 transition-all delay-75 hover:scale-105">update</button>
      </div>
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
              <tr
                onClick={() => setSelectedUser(user)}
                key={user.id}
                className="bg-white border-b d:bg-gray-800 d:border-gray-700 border-gray-200"
              >
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
