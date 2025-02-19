export default class UserService {
  /**
   * Fetches from the API using the provided userId.
   * @param {string} Id
   * @var {string} token
   * @returns {Promise<Object>}
   */

  static async getRoomById(id) {
    try {
      const response = await fetch(`http://localhost:3010/api/room/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching room: ${response.status}`);
      }
      const data = await response.json();
      return data; // Adjust this depending on how your API returns the user (e.g., data.user)
    } catch (error) {
      console.error("Failed to fetch room:", error);
      throw error;
    }
  }
  static async storeRoom(formData) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3010/api/room/create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json(); // Ensure response is returned
    } catch (error) {
      console.error("Failed to update room:", error);
      throw error;
    }
  }

  static async updateRoom(id, formData) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3010/api/room/update/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json(); // Ensure response is returned
    } catch (error) {
      console.error("Failed to update room:", error);
      throw error;
    }
  }

  static async getRooms() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("http://localhost:3010/api/rooms", {
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
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      throw error;
    }
  }

  static async deleteRoomById(id) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3010/api/room/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {}
  }
}
