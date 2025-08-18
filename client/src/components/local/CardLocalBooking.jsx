import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "../ui/button"
import { format } from "date-fns"
import { Badge } from "../ui/badge"
import { enumStatus } from "@/lib/enumStatus"
import { apiRequest } from "@/lib/api"
import { toast } from "sonner"
import { CalendarDays, CheckCircle, Clock, Mail, MapPin, Phone, XCircle } from "lucide-react"
import { enumPresenceRole } from "@/lib/enumPresenceRole"
import { calculateTotalPrice } from "@/hooks/useBookingPrice";
import { useEffect } from "react"

export default function CardLocalBooking({ holders, associates, dependents, stepchildren, guests, children, check_in, check_out, presence_role, status, id, rooms, utc_check_in_confirmed, utc_check_out_confirmed, booking }) {
  const { formatted } = calculateTotalPrice(booking);

  useEffect(() => {
    console.log(booking)
  }, [])

  async function handleCheckIn(status) {
    try {
      const result = await apiRequest(`/bookings/update-booking`, {
        method: "POST",
        body: JSON.stringify({
          id,
          presence_role: status
        })
      });

      if (result) {
        toast.success('CheckIn realizado com sucesso!');
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleCheckOut(status) {
    try {
      const result = await apiRequest(`/bookings/update-booking`, {
        method: "POST",
        body: JSON.stringify({
          id,
          presence_role: status,
          status: 'finished'
        })
      });

      if (result) {
        toast.success('CheckOut realizado com sucesso!');
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleNotPresence(status) {
    try {
      const result = await apiRequest(`/bookings/update-booking`, {
        method: "POST",
        body: JSON.stringify({
          id,
          presence_role: status,
          status: 'finished'
        })
      });

      if (result) {
        toast.warning('Presença alterada.');
      }
    } catch (err) {
      console.error(err)
    }
  }

  function getIconPresenceRole(status) {
    switch (status) {
      case "not_present":
        return <XCircle className="h-6 w-6" />
      case "pending":
        return <Clock className="h-6 w-6" />
      case "check_in_confirmed":
        return <CheckCircle className="h-6 w-6" />
      case "check_out_confirmed":
        return <CheckCircle className="h-6 w-6" />
    }
  }

  return (
    <Card className={'flex flex-row justify-between p-5'}>
      <div className="w-full m-0 p-0">
        <CardHeader className="m-0 p-0 w-full flex justify-between">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-semibold text-lg">{holders[0].name}</h2>
            <p className="text-slate-500 text-sm">CPF: {holders[0].cpf}</p>
            <div className="flex items-center gap-4">
              <div className="text-slate-500 text-sm flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {!holders[0].mobilePhone ? "Sem número" : holders[0].mobilePhone}
              </div>
              <div className="text-slate-500 text-sm flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {holders[0].email}
              </div>
            </div>
          </div>
          <div>
            <Badge variant={presence_role}>{getIconPresenceRole(presence_role)}{enumPresenceRole[presence_role]}</Badge>
          </div>
        </CardHeader>
        <CardContent className="m-0 p-0">
          <div className="flex my-6 flex-wrap gap-50">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-500" />
              <div className="text-sm">
                <p className="font-semibold">Check-in</p>
                <p className="text-slate-500">
                  {format(check_in, "dd/MM/yyyy")}
                  {" "}
                  <p className="text-green-700">
                    {utc_check_in_confirmed
                      &&
                      `às ${format(utc_check_in_confirmed, 'HH:mm')}`
                    }
                  </p>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-500" />
              <div className="text-sm">
                <p className="font-semibold">Check-out</p>
                <p className="text-slate-500">
                  {format(check_out, "dd/MM/yyyy")}
                  {" "}
                  <p className="text-blue-700">
                    {utc_check_out_confirmed
                      &&
                      `às ${format(utc_check_out_confirmed, 'HH:mm')}`
                    }
                  </p>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-500" />
              <div className="text-sm">
                <p className="font-semibold">Acomodação</p>
                <p className="text-slate-500">
                  {rooms.length > 1 ? "Quartos" : "Quarto"}
                  {" "}
                  {rooms.map(r => r.number).join(',')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-500" />
              <div className="text-sm">
                <p className="font-semibold">Preço</p>
                <p className="text-slate-500">
                  {formatted}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-medium text-sm">Acompanhantes</h2>
            {
              dependents.length > 0
                ?
                <div>
                  <p className="font-bold">Dependentes</p>
                  {dependents.map(dep => (
                    <p>{dep.name} - {dep.cpf}</p>
                  ))}
                </div>
                : <></>
            }
            {
              guests.length > 0
                ?
                <div>
                  <p className="font-bold">Convidados</p>
                  {guests.map(gue => (
                    <p>{gue.name} - {gue.cpf}</p>
                  ))}
                </div>
                : <></>
            }
            {
              children.length > 0
                ?
                <div>
                  <p className="font-bold">Crianças menores que 5 anos</p>
                  {children.map(chi => (
                    <p>{chi.name} - {chi.cpf}</p>
                  ))}
                </div>
                : <></>
            }
            {
              stepchildren.length > 0
                ?
                <div>
                  <p className="font-bold">Enteados</p>
                  {stepchildren.map(ste => (
                    <p>{ste.name} - {ste.cpf}</p>
                  ))}
                </div>
                : <></>
            }
            {
              associates.length > 0
                ?
                <div>
                  <p className="font-bold">Associados</p>
                  {associates.map(ass => (
                    <p>{ass.name} - {ass.cpf}</p>
                  ))}
                </div>
                : <></>
            }
          </div>
        </CardContent>
      </div>
      {/* <div className="flex flex-col gap-4">
        <Button disabled={presence_role === 'pending' ? false : true} variant={'check_in_confirmed'} onClick={() => handleCheckIn('check_in_confirmed')}>Confirmar Check-In</Button>
        <Button variant="not_presence" disabled={presence_role === 'pending' ? false : true} onClick={() => handleNotPresence('not_present')}>Não compareceu</Button>
        <Button variant={'refused'} disabled={presence_role === 'check_in_confirmed' ? false : true} onClick={() => handleCheckOut('check_out_confirmed')}>Confirmar Check-Out</Button>
      </div> */}
    </Card>
  )
}