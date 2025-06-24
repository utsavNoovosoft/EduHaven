import React, { createContext, useContext, useState } from "react";
import axios from "axios";

// const UserProfileContext = createContext();

// export const UserProfileProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);

//   const fetchUserDetails = async (userId) => {
//     try {
//       const { data } = await axios.get(
//         `/user/details?id=${encodeURIComponent(userId)}`
//       );
//       setUser(data);
//       setError(null); // Clear any previous errors
//       return data;
//     } catch (err) {
//       console.error("fetchUserDetails error:", err);
//       setError(err);
//       return null;
//     }
//   };

//   return (
//     <UserProfileContext.Provider
//       value={{ user, error, fetchUserDetails, setUser, setError }}
//     >
//       {children}
//     </UserProfileContext.Provider>
//   );
// };

// export const useUserProfile = () => {
//   const context = React.useContext(UserProfileContext);
//   if (!context) {
//     throw new Error(
//       "useUserProfile must be used within a UserProfileProvider"
//     );
//   }
//   return context;
// };


const UserProfileContext = createContext({
  user: null,
  setUser: () => {},
  fetchUserDetails: () => Promise.resolve(null)
});

// Provider component
export const UserProfileProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/user/details?id=${userId}`
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
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
