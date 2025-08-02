import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast, Toaster } from "sonner";

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
      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;
      const userId = user.id;
      const isAdmin = user.role === 'admin' ? true : false;

      if (userId) {
        newSocket.emit("join", { userId, isAdmin });
      }
    });

    newSocket.on("admin:payment:refund", (data) => {
      toast.info("Reembolso!", {
        description: `A reserva ${data.booking_id} foi cancelada e foi solicitado o reembolso.`
      })
    });

    newSocket.on("admin:payment:confirmed", (data) => {
      toast.success("Pagamento confirmado!", {
        description: `A reserva ${data.booking.id} teve o pagamento confirmado.`
      });
    });

    newSocket.on("payment:refund", (data) => {
      toast.info("Reembolso!", {
        description: `A reserva ${data.booking_id} foi cancelada e foi solicitado o reembolso.`
      })
    });

    newSocket.on("booking:approved", (data) => {
      toast.info("Aprovado!", {
        description: `A solicitação ${data.booking_id} foi aprovada com sucesso! Realize o pagamento.`
      })
    });

    newSocket.on("booking:refused", (data) => {
      toast.info("Recusado.", {
        description: `Infelizmente a solicitação ${data.booking_id} foi recusada. Veja os detalhes da solicitação para ver a justificativa.`
      })
    });

    newSocket.on("payment:confirmed", (data) => {
      toast.success("Pagamento confirmado!", {
        description: `A reserva ${data.booking.id} teve o pagamento confirmado.`
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
      <Toaster richColors />
    </SocketContext.Provider>
  );
}
