import Aside from "@/components/Aside";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import Text from "@/components/Text";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useBooking } from "@/hooks/useBooking";
import { apiRequest } from "@/lib/api";
import { Accessibility, AlertTriangle, Building, Terminal, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function GetRoom() {
  const [rooms, setRooms] = useState([]);
  const [userType, setUserType] = useState();
  const [selectedRoomsNumber, setSelectedRoomsNumber] = useState([]);
  const [selectedRoomsCapacity, setSelectedRoomsCapacity] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [peopleCapacity, setPeopleCapacity] = useState(0);
  const { booking } = useBooking();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    setUserType(user.associate_role);

    if (booking) {
      const qtd = (booking.partner_presence ? 1 : 0) + booking.dependents_quantity + booking.guests_quantity + booking.children_age_max_quantity;
      setPeopleCapacity(qtd);
      (async () => {
        const response = await apiRequest(`/rooms/get-available-rooms?check_in=${booking.check_in}&check_out=${booking.check_out}&capacity=${qtd}`);
        setRooms(response);
      })()
    }
  }, [booking])

  const enumFloor = {
    "0": "Térreo",
    "1": "1º Andar",
    "2": "2º Andar",
    "3": "3º Andar",
  }

  function handleSelectRoom(room) {
    setSelectedRoomsNumber(prevState => [...prevState, room.number]); setSelectedRoomsCapacity(prevState => prevState + room.capacity);
    setSelectedRooms(prevState => [...prevState, {
      booking_id: booking.id,
      room_id: room.id,
      check_in: booking.check_in,
      check_out: booking.check_out
    }])
  }

  function handleUnselectRoom(room) {
    setSelectedRoomsNumber(prevState => prevState.filter(r => r !== room.number));
    setSelectedRoomsCapacity(prevState => prevState - room.capacity);
    setSelectedRooms(prevState => prevState.filter(r => r.room_id !== room.id));
  }

  useEffect(() => {
    console.log(selectedRooms);
  }, [selectedRooms])

  function handleSubmit() {
    apiRequest(`/rooms/book-room`, {
      method: "POST",
      body: JSON.stringify({rooms: selectedRooms})
    });

    navigate(`/associado/criar-reserva/${booking.id.slice(0,8)}/finalizar-reserva?booking_id=${booking.id}`);
  }
  return (
    <section className="flex w-full p-20 justify-between">
      <section className="w-[80%]">
        <GlobalBreadcrumb />
        <Text heading={"h2"}>Quartos</Text>
        <section className="grid xl:grid-cols-3 gap-3 sm:grid-cols-1 lg:grid-cols-2 md:grid-cols-1 w-full">
          {
            rooms.map((room, index) => (
              <Card className={`flex flex-col justify-between ${selectedRooms.includes(room.number) && "border-teal-500"}`}>
                <CardContent>
                  <Text heading={"h4"}>Quarto {room.number < 10 ? `0${room.number}` : room.number}</Text>
                  <div className="flex flex-col space-y-2 mt-4">
                    <div className="flex items-center space-x-4">
                      <UsersRound size={16} strokeWidth={3} />
                      <p className="text-sm font-medium">Capacidade: {room.capacity}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Building size={16} strokeWidth={3} />
                      <p className="text-sm font-medium">{enumFloor[room.floor]}</p>
                    </div>
                    {
                      room.preferential &&
                      <Badge variant={"preferential"} >
                        <Accessibility size={20} strokeWidth={3} />
                        <p className="text-sm font-normal">
                          Preferêncial
                        </p>
                      </Badge>
                    }
                  </div>
                </CardContent>
                <CardContent>
                  {
                    room.preferential ?
                      <>
                        <div className="mb-5">
                          <div className="flex flex-col space-y-2">
                            <div>
                              <p className="text-sm">Taxa de reserva</p>
                              <div className="flex items-center space-x-2">
                                <p className="text-xl font-bold">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(userType == "partner" ? room.partner_booking_fee_per_day : room.contributor_booking_fee_per_day)}</p>
                                <Text heading={"small"}>por dia</Text>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm">Por convidado</p>
                              <div className="flex items-center space-x-2">
                                <p className="text-xl font-bold">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(userType == "partner" ? room.partner_guest_fee_per_day : room.contributor_guest_fee_per_day)}</p>
                                <Text heading={"small"}>por dia</Text>
                              </div>
                            </div>
                          </div>
                        </div>
                        <AlertDialog>
                          {
                            selectedRoomsNumber.includes(room.number)
                              ?
                              <Button variant={"selected"} className={"w-full"} onClick={() => handleUnselectRoom(room)}>
                                Cancelar seleção
                              </Button>
                              :
                              <AlertDialogTrigger className="w-full">
                                <Button className={"w-full"} onClick={() => handleSelectRoom(room)} disabled={selectedRoomsCapacity >= peopleCapacity}>
                                  Selecionar
                                </Button>
                              </AlertDialogTrigger>
                          }
                          <AlertDialogContent className={"bg-amber-400"}>
                            <AlertDialogHeader>
                              <AlertDialogTitle className={"text-white"}>Atenção!</AlertDialogTitle>
                              <AlertDialogDescription className={"text-white"}>
                                Você está selecionando um quarto preferêncial. Caso aja uma solicitação com comprovação de laudo médico, você será realocado com aviso prévio.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Fechar</AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                      :
                      <>
                        <div className="mb-5">
                          <div className="flex flex-col space-y-2">
                            <div>
                              <p className="text-sm">Taxa de reserva</p>
                              <div className="flex items-center space-x-2">
                                <p className="text-xl font-bold">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(userType == "partner" ? room.partner_booking_fee_per_day : room.contributor_booking_fee_per_day)}</p>
                                <Text heading={"small"}>por dia</Text>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm">Por convidado</p>
                              <div className="flex items-center space-x-2">
                                <p className="text-xl font-bold">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(userType == "partner" ? room.partner_guest_fee_per_day : room.contributor_guest_fee_per_day)}</p>
                                <Text heading={"small"}>por dia</Text>
                              </div>
                            </div>
                          </div>
                        </div>
                        {
                          selectedRoomsNumber.includes(room.number)
                            ?
                            <Button variant={"selected"} className={"w-full"} onClick={() => handleUnselectRoom(room)}>
                              Cancelar seleção
                            </Button>
                            :
                            <Button className={"w-full"} onClick={() => handleSelectRoom(room)} disabled={selectedRoomsCapacity >= peopleCapacity}>
                              Selecionar
                            </Button>
                        }
                      </>
                  }
                </CardContent>
              </Card>
            ))
          }
        </section>
      </section>
      <Aside action={handleSubmit}/>
    </section>
  )
}