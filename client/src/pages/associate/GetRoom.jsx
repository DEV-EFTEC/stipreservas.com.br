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

export default function GetRoom() {
  const [rooms, setRooms] = useState([]);
  const [userType, setUserType] = useState();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { booking } = useBooking();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    setUserType(user.associate_role);

    if (booking) {
      (async () => {
        const response = await apiRequest(`/rooms/get-available-rooms?check_in=${booking.check_in}&check_out=${booking.check_out}`);
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

  return (

    <section className="flex w-full p-20 justify-between">
      <section className="w-[80%]">
        <GlobalBreadcrumb />
        <Text heading={"h2"}>Quartos</Text>
        <section className="grid xl:grid-cols-3 gap-3 sm:grid-cols-1 lg:grid-cols-2 md:grid-cols-1 w-full">
          {
            rooms.map((room, index) => (
              <Card className={"flex flex-col justify-between"}>
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
                          <AlertDialogTrigger className="w-full">
                            {
                              selectedRooms.includes(room.number)
                                ?
                                <Button variant={"selected"} className={"w-full"}>
                                  Sua seleção
                                </Button>
                                :
                                <Button className={"w-full"} onClick={() => setSelectedRooms(prevState => [...prevState, room.number])}>
                                  Selecionar
                                </Button>
                            }
                          </AlertDialogTrigger>
                          <AlertDialogContent className={"bg-amber-500"}>
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
                          selectedRooms.includes(room.number)
                            ?
                            <Button variant={"selected"} className={"w-full"}>
                              Sua seleção
                            </Button>
                            :
                            <Button className={"w-full"} onClick={() => setSelectedRooms(prevState => [...prevState, room.number])}>
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
      <Aside />
    </section>
  )
}