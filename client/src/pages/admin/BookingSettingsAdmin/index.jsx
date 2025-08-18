import Aside from "@/components/Aside";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import Text from "@/components/Text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api";
import { Accessibility, Building, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingTable from "./BookingTable";
import { toast } from "sonner";

export default function BookingSettingsAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const booking_id = queryParams.get("booking_id");
  const [booking, setBooking] = useState();

  const enumFloor = {
    "0": "Térreo",
    "1": "1º Andar",
    "2": "2º Andar",
    "3": "3º Andar",
  };

  useEffect(() => {
    (async () => {
      const response = await apiRequest(`/bookings/get-booking-complete?booking_id=${booking_id}`, {
        method: "GET"
      });
      setBooking(response);
    })();
  }, []);

  async function handleSubmit() {
    const occupancy = getRoomOccupancy(booking);
    const overfilled = booking.rooms.some(room => (occupancy[room.id] || 0) > room.capacity);

    if (overfilled) {
      toast.error("Um ou mais quartos estão com capacidade excedida.");
      return;
    }

    const response = await apiRequest(`/bookings/update-participants-booking?booking_id=${booking.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        holders: booking.holders.map(({ id, check_in, check_out, room_id }) => ({ id, check_in, check_out, room_id })),
        children: booking.children.map(({ id, check_in, check_out, room_id }) => ({ id, check_in, check_out, room_id })),
        dependents: booking.dependents.map(({ id, check_in, check_out, room_id }) => ({ id, check_in, check_out, room_id })),
        guests: booking.guests.map(({ id, check_in, check_out, room_id }) => ({ id, check_in, check_out, room_id })),
        stepchildren: [],
        associates: [],
      })
    })
    if (response) {
      navigate(`/admin/criar-reserva/${booking.id.slice(0, 8)}/finalizar-reserva?booking_id=${booking.id}`);
    }
  }

  function getRoomOccupancy(booking) {
    const allPeople = [
      ...booking.holders,
      ...booking.children,
      ...booking.dependents,
      ...booking.guests
    ];

    const occupancy = {};

    allPeople.forEach(p => {
      if (p.room_id) {
        occupancy[p.room_id] = (occupancy[p.room_id] || 0) + 1;
      }
    });

    return occupancy;
  }

  return (
    <section className="flex w-full p-20 justify-between">
      {
        booking &&
        <>
          <section className="w-fit">
            <GlobalBreadcrumb />
            <div>
              <div className="flex gap-12 items-end mb-4">
                <Text heading="h1">Organização da Reserva</Text>
                <div className="flex items-center gap-2">
                  <Label>Solicitação</Label>
                  <Badge variant="">#{booking.id.slice(0, 8)}</Badge>
                </div>
              </div>
              <p className="text-zinc-400 mb-6">Aqui você pode organizar a disposição dos quartos e definir uma data de entrada e saída para eventuais necessidades para você e sua companhia.</p>
            </div>
            <div className="mb-4">
              <Text heading={'h2'}>{booking.rooms.length > 1 ? "Suas escolhas" : "Sua escolha"}</Text>
            </div>
            <div className="mb-10 flex items-center justify-between">
              {
                booking.rooms.map(room => {
                  const occupancy = getRoomOccupancy(booking);
                  const count = occupancy[room.id] || 0;
                  const isFull = count >= room.capacity;

                  return (
                    <Card className={`flex flex-col justify-between ${isFull ? 'border-red-500 bg-red-50' : 'border-teal-500'}`}>
                      <CardContent>
                        <Text heading={"h4"}>Quarto {room.number < 10 ? `0${room.number}` : room.number}</Text>
                        <p className="text-sm font-medium">Ocupação: {count}/{room.capacity}</p>
                        <div className="flex flex-col space-y-2 mt-4">
                          <div className="flex items-center space-x-4">
                            <UsersRound size={16} strokeWidth={3} />
                            <p className="text-sm font-medium">Capacidade: {room.capacity}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Building size={16} strokeWidth={3} />
                            <p className="text-sm font-medium">{enumFloor[room.floor]}</p>
                          </div>
                          {room.preferential && (
                            <Badge variant="preferential">
                              <Accessibility size={20} strokeWidth={3} />
                              <p className="text-sm font-normal">Preferencial</p>
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              }
            </div>
            <section className="flex flex-col space-y-8 ">
              <BookingTable
                title="Titular"
                people={booking.holders}
                rooms={booking.rooms}
                onChangeRoom={(id, value) => {
                  setBooking(prev => ({
                    ...prev,
                    holders: prev.holders.map(h =>
                      h.id === id ? { ...h, room_id: value } : d
                    )
                  }));
                }}
                onChangeCheckIn={(id, e) => {
                  const newDate = e.target.value;
                  setBooking(prev => ({
                    ...prev,
                    holders: prev.holders.map(h => {
                      if (h.id === id) {
                        return {
                          ...h,
                          check_in: newDate
                        };
                      }
                      return h;
                    })
                  }));
                }}
                onChangeCheckOut={(id, e) => {
                  const newDate = e.target.value;
                  setBooking(prev => ({
                    ...prev,
                    holders: prev.holders.map(h => {
                      if (h.id === id) {
                        return {
                          ...h,
                          check_out: newDate
                        };
                      }
                      return h;
                    })
                  }));
                }}
              />
              <BookingTable
                title="Dependentes"
                people={booking.dependents}
                rooms={booking.rooms}
                onChangeRoom={(id, value) => {
                  setBooking(prev => ({
                    ...prev,
                    dependents: prev.dependents.map(d =>
                      d.id === id ? { ...d, room_id: value } : d
                    )
                  }));
                }}
                onChangeCheckIn={(id, e) => {
                  const newDate = e.target.value;
                  setBooking(prev => ({
                    ...prev,
                    dependents: prev.dependents.map(d => {
                      if (d.id === id) {
                        return {
                          ...d,
                          check_in: newDate
                        };
                      }
                      return d;
                    })
                  }));
                }}
                onChangeCheckOut={(id, e) => {
                  const newDate = e.target.value;
                  setBooking(prev => ({
                    ...prev,
                    dependents: prev.dependents.map(d => {
                      if (d.id === id) {
                        return {
                          ...d,
                          check_out: newDate
                        };
                      }
                      return d;
                    })
                  }));
                }}
              />

              <BookingTable
                title="Convidados"
                people={booking.guests}
                rooms={booking.rooms}
                onChangeRoom={(id, value) => {
                  setBooking(prev => ({
                    ...prev,
                    guests: prev.guests.map(g =>
                      g.id === id ? { ...g, room_id: value } : g
                    )
                  }));
                }}
                onChangeCheckIn={(id, e) => {
                  const newDate = e.target.value;
                  setBooking(prev => ({
                    ...prev,
                    guests: prev.guests.map(g => {
                      if (g.id === id) {
                        return {
                          ...g,
                          check_in: newDate
                        };
                      }
                      return g;
                    })
                  }));
                }}
                onChangeCheckOut={(id, e) => {
                  const newDate = e.target.value;
                  setBooking(prev => ({
                    ...prev,
                    guests: prev.guests.map(g => {
                      if (g.id === id) {
                        return {
                          ...g,
                          check_out: newDate
                        };
                      }
                      return g;
                    })
                  }));
                }}
              />

              <BookingTable
                title="Crianças"
                people={booking.children}
                rooms={booking.rooms}
                tooltip={'Crianças menores que 5 anos podem dormir no mesmo quarto. Caso seja necessário, poderá levar um colchão'}
                onChangeRoom={(id, value) => {
                  setBooking(prev => ({
                    ...prev,
                    children: prev.children.map(c =>
                      c.id === id ? { ...c, room_id: value } : c
                    )
                  }));
                }}
                onChangeCheckIn={(id, e) => {
                  const newDate = e.target.value;
                  setBooking(prev => ({
                    ...prev,
                    children: prev.children.map(c => {
                      if (c.id === id) {
                        return {
                          ...c,
                          check_in: newDate
                        };
                      }
                      return c;
                    })
                  }));
                }}
                onChangeCheckOut={(id, e) => {
                  const newDate = e.target.value;
                  setBooking(prev => ({
                    ...prev,
                    children: prev.children.map(c => {
                      if (c.id === id) {
                        return {
                          ...c,
                          check_out: newDate
                        };
                      }
                      return c;
                    })
                  }));
                }}
              />
            </section>
          </section>
          <Aside action={handleSubmit} />
        </>
      }
    </section>
  )
}