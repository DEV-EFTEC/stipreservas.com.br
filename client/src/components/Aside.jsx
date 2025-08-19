import { Card, CardContent } from "./ui/card";
import Text from "./Text";
import { Banknote, BedDouble, Calendar, CalendarRange, ChevronRight, Menu, UsersRound, XIcon } from "lucide-react";
import { differenceInDays, eachDayOfInterval, format, interval, intlFormatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useBooking } from "@/hooks/useBooking";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { rangeIncludesDate } from "react-day-picker";

function Summary() {
  const { booking } = useBooking();

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant={'secondary'}>
            <Menu />
            Ver resumo da solicitação
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Resumo da reserva</DrawerTitle>
            <DrawerDescription>Durante o cadastro de sua solicitação, realizaremos a previsão de cálculos da sua reserva.</DrawerDescription>
          </DrawerHeader>
          <div className="px-8">
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
                        <Text heading={"small"}>Total de {eachDayOfInterval({ start: new Date(booking.check_out), end: new Date(booking.check_in) }).length} dia(s)</Text>
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
                        <Text heading={"small"}>Total de {(booking.partner_presence === true ? 1 : 0) + booking.dependents_quantity + booking.guests_quantity + booking.children_age_max_quantity + (booking.associates_quantity || 0)} pessoas</Text>
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
                  <Text heading={"small"}>Aguardando escolha dos quartos</Text>
                </div>
              </div>
            </section>
          </div>
          <DrawerFooter>
            <DrawerClose>
              <Button variant="outline">Voltar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default function Aside({ action, isDisabled }) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 w-full left-0 bg-white border-t rounded-t-xl p-4 flex items-center justify-center">
      <footer className="flex flex-col gap-4 w-full xl:w-[50%]">
        <Summary />
        <Button variant={"positive"} onClick={action} disabled={isDisabled}>Ir para a próxima etapa <ChevronRight /></Button>
        <Button variant={"link_cancel"} onClick={() => navigate("/associado/home")}>Cancelar <XIcon /></Button>
      </footer>
    </div>
  )
}