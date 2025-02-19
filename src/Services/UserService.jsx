export default class UserService {
  /**
   * Fetches a user from the API using the provided userId.
   * @param {string} userId - The ID of the user to retrieve.
   * @var {string} token = sessionStorage.getItem('token');
   * @returns {Promise<Object>} - A promise that resolves to the user object.
   */  

  static async getUserById(userId) {
    try {
      const response = await fetch(`http://localhost:3010/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching user: ${response.status}`);
      }
      const data = await response.json();
      return data; // Adjust this depending on how your API returns the user (e.g., data.user)
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  }

  static async updateUser(userId,formData) {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3010/api/users/update/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json(); // Ensure response is returned
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }

  static async getUsers() {
    try {
      const token = sessionStorage.getItem('token');
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
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  }

  static async deleteUserById(userId) {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3010/api/users/delete/${userId}`,
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
    } catch (error) {

    }
  }
}
