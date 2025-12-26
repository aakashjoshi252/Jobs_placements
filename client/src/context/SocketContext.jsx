import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useSelector((state) => state.auth.user);

  // Request browser notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("✅ Notification permission granted");
        } else {
          console.log("⚠️ Notification permission denied");
        }
      });
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      const newSocket = io("http://localhost:3000", {
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        console.log("Connected to socket server");
        newSocket.emit("userOnline", user._id);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
