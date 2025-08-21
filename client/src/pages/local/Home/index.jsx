import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Text from "@/components/Text";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { useSocket } from "@/hooks/useSocket";
import { addDays, format, subDays } from "date-fns";
import CardLocalBooking from "@/components/local/CardLocalBooking";
import { Button } from "@/components/ui/button";
import { enumPresenceRole } from "@/lib/enumPresenceRole";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Home() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState(new Date());
  const { socket } = useSocket();
  const [presenceRole, setPresenceRole] = useState("pending");

  useEffect(() => {
    (async () => {
      const result = await apiRequest(`/bookings/local/get-bookings-complete?date=${date.toISOString()}`, { method: 'GET' });
      setBookings(result);
      console.log(result)
    })();
  }, [date]);

  return (
    <section className="w-full p-20">
      <GlobalBreadcrumb />
      <div className="flex w-full justify-between items-center mb-10">
        <Text heading={'h1'}>Reservas - {format(date, 'dd/MM/yyy')}</Text>
        <div className="flex gap-8">
          <Button onClick={() => setDate(subDays(date, 1))}><ChevronLeft />Dia anterior</Button>
          <Button onClick={() => setDate(addDays(date, 1))}>Próximo dia <ChevronRight /></Button>
        </div>
      </div>
      <section className="mb-6">
        <p>Filtro aplicado: <Badge variant={presenceRole}>{presenceRole ? enumPresenceRole[presenceRole] : "Nenhum"}</Badge></p>
      </section>
      <section className="flex justify-between gap-4 mb-6">
        <div className="border rounded-lg shadow w-full text-center py-5">
          <p className="font-bold text-3xl text-slate-800">{bookings.length}</p>
          <p className="text-sm text-slate-500">Total</p>
        </div>
        <div className="border rounded-lg shadow w-full text-center py-5">
          <p className="font-bold text-3xl text-amber-500">{bookings.filter(boo => boo.presence_role === 'pending').length}</p>
          <p className="text-sm text-slate-500">Aguardando</p>
        </div>
        <div className="border rounded-lg shadow w-full text-center py-5">
          <p className="font-bold text-3xl text-green-500">{bookings.filter(boo => boo.presence_role === 'check_in_confirmed').length}</p>
          <p className="text-sm text-slate-500">Check-In</p>
        </div>
        <div className="border rounded-lg shadow w-full text-center py-5">
          <p className="font-bold text-3xl text-blue-500">{bookings.filter(boo => boo.presence_role === 'check_out_confirmed').length}</p>
          <p className="text-sm text-slate-500">Check-Out</p>
        </div>
        <div className="border rounded-lg shadow w-full text-center py-5">
          <p className="font-bold text-3xl text-red-500">{bookings.filter(boo => boo.presence_role === 'not_present').length}</p>
          <p className="text-sm text-slate-500">Não compareceu</p>
        </div>
      </section>
      <section className="flex justify-between gap-4 mb-6 w-full">
        <div className="w-full">
          <Button onClick={() => setPresenceRole(null)} className={'w-full bg-slate-800'}>Totais do dia</Button>
        </div>
        <div className="w-full">
          <Button onClick={() => setPresenceRole("pending")} className={'w-full bg-amber-500'}>Pendentes do dia</Button>
        </div>
        <div className="w-full">
          <Button onClick={() => setPresenceRole("check_in_confirmed")} className={'w-full bg-green-500'}>Check-Ins do dia</Button>
        </div>
        <div className="w-full">
          <Button onClick={() => setPresenceRole("check_out_confirmed")} className={'w-full bg-blue-500'}>Check-Outs do dia</Button>
        </div>
        <div className="w-full">
          <Button onClick={() => setPresenceRole("not_present")} className={'w-full bg-red-500'}>Não comparecidos do dia</Button>
        </div>
      </section>
      <section className="flex flex-col gap-8">
        {
          bookings.length > 0
            ?
            bookings.filter(bo => presenceRole === null ? bo : bo.presence_role === presenceRole).length > 0
              ?
              bookings.filter(bo => presenceRole === null ? bo : bo.presence_role === presenceRole).map(boo => (
                <CardLocalBooking key={boo.id} {...boo} booking={boo} setBookings={setBookings} />
              ))
              :
              <p className="text-lg text-center text-slate-500 py-4">Nenhum <Badge variant={presenceRole}>{enumPresenceRole[presenceRole]}</Badge> em {format(date, 'dd/MM/yyyy')}</p>
            :
            <p className="text-lg text-center text-slate-500 py-4">Nenhuma reserva no dia {format(date, 'dd/MM/yyyy')}</p>

        }
      </section>
    </section>
  )
}