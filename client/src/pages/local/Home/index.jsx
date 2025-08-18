import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Text from "@/components/Text";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { useSocket } from "@/hooks/useSocket";
import { addDays, format, subDays } from "date-fns";
import CardLocalBooking from "@/components/local/CardLocalBooking";
import { Button } from "@/components/ui/button";

export function Home() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState(new Date());
  const { socket } = useSocket();

  useEffect(() => {
    (async () => {
      const result = await apiRequest(`/bookings/local/get-bookings-complete?date=${date.toISOString()}`, { method: 'GET' });
      setBookings(result);
    })();
  }, [date]);

  return (
    <section className="w-full p-20">
      <GlobalBreadcrumb />
      <div className="flex w-full justify-between items-center mb-10">
        <Text heading={'h1'}>Reservas - {format(date, 'dd/MM/yyy')}</Text>
        <div>
          <Button onClick={() => setDate(subDays(date, 1))}>Dia anterior</Button>
          <Button onClick={() => setDate(addDays(date, 1))}>Próximo dia</Button>
        </div>
      </div>
      <section className="flex flex-col gap-8">
        {
          bookings.length > 0
            ?
            bookings.map(boo => (
              <CardLocalBooking key={boo.id} {...boo} booking={boo}/>
            ))
            :
            <p>Nenhuma reserva para o dia {format(date, 'dd/MM/yyyy')}</p>

        }
      </section>
    </section>
  )
}