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

export function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { booking, removeBooking } = useBooking();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (loading) return;

    async function fetchBookings() {
      try {
        const result = await apiRequest(`/bookings/get-bookings?user_id=${user.id}`, {
          method: "GET"
        });
        setBookings(result);
      } catch (err) {
        console.error("Erro ao buscar reservas:", err.message);
      }
    }

    fetchBookings();
  }, [loading]);

  function handleCancel() {
    apiRequest(`/bookings/delete-booking/${booking.id}`, {
      method: "DELETE"
    });

    removeBooking();
    toast.success("Sua reserva foi cancelada!")
  }

  async function handleContinue() {
    const result = await apiRequest(`/bookings/get-participants?booking_id=${booking.id}`, {
      method: "GET"
    });

    if (result) {
      navigate(`/associado/criar-reserva/${booking.id.slice(0, 8)}/enviar-documentos`, {
        state: { participants: result }
      });
    }
  }

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
        <Text heading={'h1'}>Suas solicitações recentes</Text>
        <Button variant="positive" onClick={() => navigate("/associado/criar-reserva")}><PlusIcon /> Criar uma nova solicitação</Button>
      </div>
      {
        booking
        &&
        <Alert className="w-fit h-fit">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Oi! Parece que você deixou uma reserva pendente.</AlertTitle>
          <AlertDescription>
            Quer continuar preenchendo ou prefere cancelar?
            <div className="flex justify-between w-full mt-1">
              <Button variant={"positive"} onClick={handleContinue}>Continuar preenchendo</Button>
              <Button variant={"destructive"} onClick={handleCancel}>Cancelar</Button>
            </div>
          </AlertDescription>
        </Alert>
      }
      <Table className={"w-full"}>
        <TableCaption>Uma lista com as suas reservas recentes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Cód.</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Entrada</TableHead>
            <TableHead>Saída</TableHead>
            <TableHead>Solicitação criada em</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">#{booking.id.slice(0, 8)}</TableCell>
              <TableCell>
                <Badge variant={booking.status}>{enumStatus[booking.status]}</Badge>
              </TableCell>
              <TableCell>{format(booking.check_in, "dd/MM/yyyy")}</TableCell>
              <TableCell>{format(booking.check_out, "dd/MM/yyyy")}</TableCell>
              <TableCell>{format(booking.utc_created_on, "dd/MM/yyyy 'às' HH:mm")}</TableCell>
              <TableCell className={"w-min"}>
                <Button variant={"outline"} size={"sm"} onClick={() => navigate(`/associado/solicitacao/${booking.id.slice(0, 8)}?booking_id=${booking.id}`)}>Ver detalhes</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}