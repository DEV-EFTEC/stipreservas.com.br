import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import Text from "@/components/Text";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function FinishBook() {
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
      console.log(response);
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
    "incomplete": "Incompleto"
  }

  return (
    <section className="flex w-full p-20 justify-between">
      {
        booking
        &&
        <section className="w-fit">
          <GlobalBreadcrumb />
          <div className="flex flex-col space-y-2 mb-8">
            <div className="flex gap-12 items-end">
              <Text heading="h1">Revise sua reserva antes de finalizar</Text>
              <div className="flex items-center gap-2">
                <Label>Solicitação</Label>
                <Badge variant="">#{booking && booking.id.slice(0, 8)}</Badge>
              </div>
            </div>
            <p className="text-muted-foreground">Confira os detalhes e, se necessário, volte para ajustar sua escolha.</p>
            <div className="flex items-center space-x-2">
              <p className="font-medium">Status:</p>
              <Badge variant={booking.status}>{enumStatus[booking.status]}</Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <p>Data de entrada: {format(booking.check_in, "dd/MM/yyyy (cccccc)", { locale: ptBR })}</p>
          </div>
          <div className="flex items-center space-x-2">
            <p>Data de saída: {format(booking.check_out, "dd/MM/yyyy (cccccc)", { locale: ptBR })}</p>
          </div>
          <div className="flex items-center space-x-1">
            <p>Quarto{booking.rooms.length > 1 ? "s" : ""}:</p>
            {booking.rooms.map((r, index) => (<p>{r.number}{booking.rooms.length > 1 && booking.rooms.length - 2 === index && " e"}</p>))}
          </div>
          <div>
            <div className="flex flex-col">
              <strong>Dependentes</strong>
              {
                booking.dependents.length > 0 && booking.dependents.map((d, index) => (
                  <p>{d.name}</p>
                ))
              }
            </div>
            <div className="flex flex-col">
              <strong>Convidados</strong>
              {
                booking.guests.length > 0 && booking.guests.map((g, index) => (
                  <p>{g.name}</p>
                ))
              }
            </div>
            <div className="flex flex-col">
              <strong>Crianças</strong>
              {
                booking.children.length > 0 && booking.children.map((c, index) => (
                  <p>{c.name}</p>
                ))
              }
            </div>
          </div>
        </section>
      }
    </section>
  )
}