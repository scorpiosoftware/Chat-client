class UserService {
    /**
     * Fetches a user from the API using the provided userId.
     * @param {string} userId - The ID of the user to retrieve.
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
  }
  
  export default UserService;
  