import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useBooking } from "@/hooks/useBooking";
import { useEffect, useState } from "react";
import { AlertCircleIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Text from "@/components/Text";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { io } from "socket.io-client";

export function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [bookings, setBookings] = useState([]);

  const socket = io(import.meta.env.VITE_API_URL);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado ao socket:", socket.id);
    });

    socket.on("custom-event-response", (data) => {
      console.log("Resposta recebida:", data);
    });

    socket.on("new-booking-response", (data) => {
      console.log("Nova solicitação de", data);
      toast.info(`Nova solicitação do usuário: ${data.userId}`);
    });
  
    // Emitir evento de teste
    socket.emit("custom-event", { user: "Emily", msg: "Olá servidor!" });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Ouvir no painel do admin:

  useEffect(() => {
    (async () => {
      const result = await apiRequest(`/bookings/get-all-bookings?page=${page}&limit=${limit}&user_type=${user.role}`, { method: 'GET' });
      setBookings(result.data);
    })();
  }, [page]);

  const enumStatus = {
    "pending_approval": "Aprovação pendente",
    "refused": "Recusado",
    "expired": "Expirado",
    "closed": "Encerrado",
    "approved": "Aprovado",
    "payment_pending": "Pagamento pendente",
    "cancelled": "Cancelado",
    "incomplete": "Incompleta"
  }

  return (
    <section className="w-full p-20">
      <GlobalBreadcrumb />
      <div className="flex w-full justify-between items-center mb-10">
        <Text heading={'h1'}>Últimas solicitações</Text>
      </div>
      <DataTable data={bookings} columns={columns} />
    </section>
  )
}