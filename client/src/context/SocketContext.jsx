import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

// Dynamic Socket URL - works with localhost and network IP
const getSocketURL = () => {
  const hostname = window.location.hostname;
  
  // If accessing via network IP, use that IP for backend
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:3000`;
  }
  
  // Default to localhost
  return "http://localhost:3000";
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useSelector((state) => state.auth.user);

  // Request browser notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log(" Notification permission granted");
        } else {
          console.log("  Notification permission denied");
        }
      });
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      const SOCKET_URL = getSocketURL();
      console.log(`🔌 Connecting to Socket.IO: ${SOCKET_URL}`);

      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      newSocket.on("connect", () => {
        console.log(" Connected to socket server");
        newSocket.emit("userOnline", user._id);
      });

      newSocket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error.message);
      });

      newSocket.on("disconnect", (reason) => {
        console.log(" Socket disconnected:", reason);
      });

      newSocket.on("userStatusChange", ({ userId, status }) => {
        setOnlineUsers((prev) => {
          if (status === "online") {
            return [...new Set([...prev, userId])];
          } else {
            return prev.filter((id) => id !== userId);
          }
        });
      });

      setSocket(newSocket);

      return () => {
        console.log(" Closing socket connection");
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
