import Aside from "@/components/Aside";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import Text from "@/components/Text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api";
import { format } from "date-fns";
import { Accessibility, Building, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function BookingSettings() {
  const location = useLocation();
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

  function handleSubmit() {
    navigate(`/associado/criar-reserva/${booking.id.slice(0, 8)}/finalizar-reserva?booking_id=${booking.id}`);
  }

  return (
    <section className="flex w-full p-20 justify-between">
      <section className="w-fit">
        <GlobalBreadcrumb />
        <div>
          <div className="flex gap-12 items-end mb-8">
            <Text heading="h1">Organização da Reserva</Text>
            <div className="flex items-center gap-2">
              <Label>Solicitação</Label>
              <Badge variant="">#aaa</Badge>
            </div>
          </div>
          <p>Aqui você pode organizar a disposição dos quartos e definir uma data de entrada e saída para eventuais necessidades para você e sua companhia.</p>
        </div>
        {
          booking &&
          booking.rooms.map(room => (
            <Card className={`flex flex-col justify-between`}>
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
                  {room.preferential && (
                    <Badge variant="preferential">
                      <Accessibility size={20} strokeWidth={3} />
                      <p className="text-sm font-normal">Preferencial</p>
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        }
        <div>
          <Text heading={'h3'}>Dependentes</Text>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Quarto</TableHead>
                <TableHead>Data de entrada</TableHead>
                <TableHead>Data de saída</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                booking &&
                booking.dependents.map(dep => (
                  <TableRow>
                    <TableCell className="font-medium">{dep.name}</TableCell>
                    <TableCell>{dep.cpf}</TableCell>
                    <TableCell>
                      <Select value={booking.rooms.length === 1 ? booking.rooms[0].id : ""} disabled={booking.rooms.length === 1}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Quartos</SelectLabel>
                            {
                              booking.rooms.map(room => (
                                <SelectItem value={room.id}>Quarto {room.number < 10 ? `0${room.number}` : room.number}</SelectItem>
                              ))
                            }
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input type="date" value={format(new Date(dep.check_in), 'yyyy-MM-dd')} min={format(new Date(dep.check_in), 'yyyy-MM-dd')} max={format(new Date(dep.check_out), 'yyyy-MM-dd')} />
                    </TableCell>
                    <TableCell>
                      <Input type="date" value={format(new Date(dep.check_out), 'yyyy-MM-dd')} min={format(new Date(dep.check_in), 'yyyy-MM-dd')} max={format(new Date(dep.check_out), 'yyyy-MM-dd')} />
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
        <div>
          <Text heading={'h3'}>Convidados</Text>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Quarto</TableHead>
                <TableHead>Data de entrada</TableHead>
                <TableHead>Data de saída</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                booking &&
                booking.guests.map(gue => (
                  <TableRow>
                    <TableCell className="font-medium">{gue.name}</TableCell>
                    <TableCell>{gue.cpf}</TableCell>
                    <TableCell>
                      <Select value={booking.rooms.length === 1 ? booking.rooms[0].id : ""} disabled={booking.rooms.length === 1}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Quartos</SelectLabel>
                            {
                              booking.rooms.map(room => (
                                <SelectItem value={room.id}>Quarto {room.number < 10 ? `0${room.number}` : room.number}</SelectItem>
                              ))
                            }
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input type="date" value={format(new Date(gue.check_in), 'yyyy-MM-dd')} min={format(new Date(gue.check_in), 'yyyy-MM-dd')} max={format(new Date(gue.check_out), 'yyyy-MM-dd')} />
                    </TableCell>
                    <TableCell>
                      <Input type="date" value={format(new Date(gue.check_out), 'yyyy-MM-dd')} min={format(new Date(gue.check_in), 'yyyy-MM-dd')} max={format(new Date(gue.check_out), 'yyyy-MM-dd')} />
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
        <div>
          <Text heading={'h3'}>Crianças</Text>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Quarto</TableHead>
                <TableHead>Data de entrada</TableHead>
                <TableHead>Data de saída</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                booking &&
                booking.children.map(chi => (
                  <TableRow>
                    <TableCell className="font-medium">{chi.name}</TableCell>
                    <TableCell>{chi.cpf}</TableCell>
                    <TableCell>
                      <Select value={booking.rooms.length === 1 ? booking.rooms[0].id : ""} disabled={booking.rooms.length === 1}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Quartos</SelectLabel>
                            {
                              booking.rooms.map(room => (
                                <SelectItem value={room.id}>Quarto {room.number < 10 ? `0${room.number}` : room.number}</SelectItem>
                              ))
                            }
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input type="date" value={format(new Date(chi.check_in), 'yyyy-MM-dd')} min={format(new Date(chi.check_in), 'yyyy-MM-dd')} max={format(new Date(chi.check_out), 'yyyy-MM-dd')} />
                    </TableCell>
                    <TableCell>
                      <Input type="date" value={format(new Date(chi.check_out), 'yyyy-MM-dd')} min={format(new Date(chi.check_in), 'yyyy-MM-dd')} max={format(new Date(chi.check_out), 'yyyy-MM-dd')} />
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
      </section>
      <Aside action={handleSubmit} />
    </section>
  )
}