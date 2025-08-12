import { createContext, useContext, useState } from "react";
import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;

const UserProfileContext = createContext({
  user: null,
  setUser: () => {},
  fetchUserDetails: () => Promise.resolve(null),
});

// Provider component
export const UserProfileProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/user/details?id=${userId}`
      );
      const userData = response.data;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  return (
    <UserProfileContext.Provider value={{ user, setUser, fetchUserDetails }}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook for using user profile context
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};

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