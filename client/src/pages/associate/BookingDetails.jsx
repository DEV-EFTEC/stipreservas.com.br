import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import Text from "@/components/Text";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function BookingDetails() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const booking_id = queryParams.get("booking_id");

  const [booking, setBooking] = useState();

  useEffect(() => {
    (async () => {
      const response = await apiRequest(`/bookings/get-booking-complete?booking_id=${booking_id}`, {
        method: "GET"
      });

      setBooking(response);
    })()
  }, [])

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
    <section className="flex w-full p-20 justify-between">
      {
        booking
        &&
        <section className="w-fit">
          <GlobalBreadcrumb />
          <div className="flex gap-12 items-end mb-8">
            <Text heading="h1">Detalhes da solicitação</Text>
            <div className="flex items-center gap-2">
              <Label>Solicitação</Label>
              <Badge variant="">#{booking && booking.id.slice(0, 8)}</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <p>Status:</p>
            <Badge variant={booking.status}>{enumStatus[booking.status]}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <p>Data de entrada: {format(booking.check_in, "dd/MM/yyyy", { locale: ptBR })}</p>
          </div>
          <div className="flex items-center space-x-2">
            <p>Data de saída: {format(booking.check_out, "dd/MM/yyyy", { locale: ptBR })}</p>
          </div>
          <div>
            <p>Quartos:</p>
            {booking.rooms.map(r => (<p>{r.number}</p>))}
          </div>
        </section>
      }
    </section>
  )
}