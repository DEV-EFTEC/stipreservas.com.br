import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Toaster } from "sonner";

const SocketContext = createContext({ socket: null });

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      const user = localStorage.getItem("user");
      const userId = user.id;
      const isAdmin = user.role === 'admin' ? true : false;

      if (userId && !isAdmin) {
        newSocket.emit("join", { userId, isAdmin });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
      <Toaster richColors/>
    </SocketContext.Provider>
  );
}
