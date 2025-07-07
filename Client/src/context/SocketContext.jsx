import { createContext, useContext, useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";
import { jwtDecode } from "jwt-decode";

const SocketContext = createContext();

const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decoded = jwtDecode(token);

    const userData = {
      token: token,
      id: decoded.id,
      name: `${decoded.FirstName} ${decoded?.LastName ?? ""}`,
      profileImage: decoded.profileImage,
    };
    setUser(userData);
  }, []);

  const { socket, isConnected, onlineUsers } = useSocket(user);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers, user }}>
      {children}
    </SocketContext.Provider>
  );
};
export default useSocketContext;
