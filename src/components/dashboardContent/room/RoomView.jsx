import React, { useState, useEffect } from "react";
import RoomService from '../../../Services/RoomService';
import UserService from "../../../Services/UserService";
export default function RoomView() {
    const [rooms, setRooms] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState({ name: "", admin_id: "" });
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);
    const token = sessionStorage.getItem("token");
    if (!token) {
        setError("No authentication token found");
        console.log(error);
        return;
    }
    // Fetch Rooms Data from End Point API
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const roomData = await RoomService.getRooms();
                const roomsArray = roomData.payload.data;
                setTimeout(() => {
                    setRooms(roomsArray);
                    setLoading(false);
                    setError(null);
                }, 350);
            } catch (err) {
                setError(err.message);
                setRooms([]);
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const adminData = await UserService.getUsers();
                const adminsArray = adminData.payload.data;
                setTimeout(() => {
                    setUsers(adminsArray);
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
        setSelectedRoom((prevRoom) => ({
            ...prevRoom,
            [name]: value,
        }));
    };

    const UpdateRoomHandler = async (roomId) => {
        if (!window.confirm("Are you sure you want to modify this room?")) return;
        try {
            const formData = {
                name: selectedRoom.name,
                admin_id: selectedRoom.admin_id,
                room_users: selectedUsers
            }
            await RoomService.updateRoom(roomId, formData);
            // Update UI
            setRooms((prevRooms) =>
                prevRooms.map((room) =>
                    room.id === roomId ? { ...room, ...formData } : room
                )
            );
            setError(null);
        } catch (err) {
            setError(`Update Failed: ${err.message}`);
        }
    }

    const handleSelectChange = (event) => {
        const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
        setSelectedUsers(selectedValues);
    };

    // Delete User Button Event
    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;
        try {
            setDeletingId(roomId);
            await RoomService.deleteRoomById(deletingId);
            // Update UI by filtering out deleted user
            setRooms((prev) => prev.filter((room) => room.id !== roomId));
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
                    <input onChange={handleChange} type="text" name="name" value={selectedRoom.name} id="name" />
                </div>
                <div className="flex justify-start items-center gap-x-4">
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                        Select Users
                    </label>
                    <select
                        multiple
                        value={selectedUsers}
                        onChange={handleSelectChange}
                        className="block w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                    >
                        {users.map((user) => (
                            <option key={user.id} value={user.id} className="text-gray-700 py-2 px-3">
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={() => UpdateRoomHandler(selectedRoom.id)} className="rounded-full px-4 py-1 border cursor-pointer bg-yellow-200 transition-all delay-75 hover:scale-105">Create</button>
                <button onClick={() => UpdateRoomHandler(selectedRoom.id)} className="rounded-full px-4 py-1 border cursor-pointer bg-green-200 transition-all delay-75 hover:scale-105">update</button>
         
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
                            Admin_id
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Created At
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Updated At
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rooms?.length > 0 ? (
                        rooms.map((room) => (
                            <tr
                                onClick={() => setSelectedRoom(room)}
                                key={room.id}
                                className="bg-white border-b d:bg-gray-800 d:border-gray-700 border-gray-200"
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap d:text-white"
                                >
                                    {room.id}
                                </th>
                                <td className="px-6 py-4">{room.name}</td>
                                <td className="px-6 py-4">{room.admin_name}</td>
                                <td className="px-6 py-4">{room.created_at}</td>
                                <td className="px-6 py-4">{room.updated_at}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDeleteRoom(room.id)}
                                        disabled={deletingId === room.id}
                                        className="delete-btn"
                                    >
                                        {deletingId === room.id ? (
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
