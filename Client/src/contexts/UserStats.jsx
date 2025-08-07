import axios from "axios";

const backendUrl = import.meta.env.VITE_API_URL;

/**
 * Fetches the full public stats of a user by userId.
 *
 * @param {string} userId - The ID of the user whose stats are to be fetched.
 * @returns {Promise<Object>} - Resolves with the user's stats data.
 * @throws {Error} - Throws an error if the API call fails.
 */
export const fetchUserStats = async (userId) => {
  try {
    // Get token from localStorage or wherever you're storing it
    const token = localStorage.getItem("token");

    // Throw an error early if token doesn't exist
    if (!token) {
      throw new Error("No auth token found");
    }

    // Make authenticated request
    const response = await axios.get(`${backendUrl}/friends/${userId}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user stats:", error.response?.data || error.message);
    throw error;
  }
};
