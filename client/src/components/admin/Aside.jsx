import { Card, CardContent } from "../ui/card";
import Text from "../Text";
import { Banknote, BedDouble, Calendar, CalendarRange, ChevronRight, UsersRound, XIcon } from "lucide-react";
import { differenceInDays, format, interval, intlFormatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useBooking } from "@/hooks/useBooking";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { calculateTotalPrice } from "@/hooks/useBookingPrice";
import { useEffect } from "react";

export default function Aside({ action, status }) {
  const { booking } = useBooking();
  const { formatted } = calculateTotalPrice(booking);
  const navigate = useNavigate();

  function renderButton(status) {
    switch (status) {
      case 'neutral':
        return (
          <Button disabled>Documentos pendentes de aprovação</Button>
        )
      case 'approved':
        return (
          <Button variant={'positive'} onClick={action}>Concluir aprovação</Button>
        )
      case 'refused':
        return (
          <Button variant={'destructive'} onClick={action}>Concluir reprovação</Button>
        )
    }
  }

  return (
    <>
      <Card className={"w-[16%] h-fit mr-8 mt-8 fixed right-0 top-0"}>
        <CardContent>
          <Text heading="h3">Resumo da reserva</Text>
          <Text heading="small">Durante o cadastro de sua solicitação, realizaremos a previsão de cálculos da sua reserva.</Text>
          <section className="mt-6 flex flex-col gap-6">
            <div className="flex flex-col">
              <header className="flex gap-4">
                <CalendarRange strokeWidth={3} size={20} className="text-yellow-500" />
                <strong className="text-sm">Período de estadia</strong>
              </header>
              <div className="ml-9">
                {
                  booking
                    ?
                    <>
                      <Text heading={"small"}>{format(booking.check_in, "d 'de' MMMM (ccc)", { locale: ptBR })}</Text>
                      <Text heading={"small"}>{format(booking.check_out, "d 'de' MMMM (ccc)", { locale: ptBR })}</Text>
                      <Text heading={"small"}>Total de {differenceInDays(booking.check_out, booking.check_in)} dia(s)</Text>
                    </>
                    :
                    <Text heading={"small"}>A definir</Text>

                }
              </div>
            </div>
            <div className="flex flex-col">
              <header className="flex gap-4">
                <UsersRound strokeWidth={3} size={20} className="text-blue-500" />
                <strong className="text-sm">Quantidade de pessoas</strong>
              </header>
              <div className="ml-9">
                {
                  booking
                    ?
                    <>
                      <Text heading={"small"}>{booking.partner_presence === true ? 1 : 0}x Titular</Text>
                      <Text heading={"small"}>{booking.dependents_quantity}x Dependente(s)</Text>
                      <Text heading={"small"}>{booking.guests_quantity}x Convidado(s)</Text>
                      <Text heading={"small"}>{booking.children_age_max_quantity}x Criança(s)</Text>
                      <Text heading={"small"}>Total de {(booking.partner_presence === true ? 1 : 0) + booking.dependents_quantity + booking.guests_quantity + booking.children_age_max_quantity} pessoas</Text>
                    </>
                    :
                    <Text heading={"small"}>A definir</Text>

                }
              </div>
            </div>
            <div className="flex flex-col">
              <header className="flex gap-4">
                <BedDouble strokeWidth={3} size={20} className="text-red-500" />
                <strong className="text-sm">Quartos</strong>
              </header>
              <div className="ml-9">
                <Text heading={"small"}>
                  {booking?.rooms
                    ? booking.rooms
                      .map((rm) => `Quarto ${rm.number}`)
                      .reduce((acc, curr, idx, arr) => {
                        if (idx === 0) return curr;
                        if (idx === arr.length - 1) return `${acc} e ${curr}`;
                        return `${acc}, ${curr}`;
                      }, "")
                    : "A definir"}
                </Text>
              </div>
            </div>
            <div className="flex flex-col">
              <header className="flex gap-4">
                <Banknote strokeWidth={3} size={20} className="text-emerald-600" />
                <strong className="text-sm">Preço</strong>
              </header>
              <div className="ml-9">
                {
                  booking ?
                  <Text heading={"small"}>{formatted}</Text>
                  :
                  <Text heading={"small"}>Aguardando escolha dos quartos</Text>
                }
              </div>
            </div>
          </section>
          <footer className="flex flex-col mt-16 gap-8">
            {renderButton(status)}
          </footer>
        </CardContent>
      </Card>
    </>
  )
}