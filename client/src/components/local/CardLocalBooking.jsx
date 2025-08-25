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
import { CalendarDays, CheckCircle, Clock, Coins, Mail, MapPin, Phone, UsersRound, XCircle } from "lucide-react"
import { enumPresenceRole } from "@/lib/enumPresenceRole"
import { calculateTotalPrice } from "@/hooks/useBookingPrice";
import { useEffect } from "react"
import { fmtPlainBR, fmtPlainDateBR } from "@/lib/fmtPlainBR"

export default function CardLocalBooking({ holders, associates, dependents, stepchildren, guests, children, check_in, check_out, presence_role, status, id, rooms, utc_check_in_confirmed, utc_check_out_confirmed, booking, setBookings }) {
  const { formatted } = calculateTotalPrice(booking);

  async function handleCheckIn(status) {
    const utc_check_in_confirmed = new Date()
    try {
      const result = await apiRequest(`/bookings/update-booking`, {
        method: "POST",
        body: JSON.stringify({
          id,
          presence_role: status,
          utc_check_in_confirmed
        })
      });

      if (result) {
        setBookings(prevState => {
          return prevState.map((ps) => {
            if (ps.id === id) {
              return {
                ...ps,
                presence_role: "check_in_confirmed",
                utc_check_in_confirmed
              }
            }
            return ps
          })
        })
        toast.success('CheckIn realizado com sucesso!');
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleCheckOut(status) {
    const utc_check_out_confirmed = new Date()

    try {
      const result = await apiRequest(`/bookings/update-booking`, {
        method: "POST",
        body: JSON.stringify({
          id,
          presence_role: status,
          status: 'finished',
          utc_check_out_confirmed
        })
      });

      if (result) {
        setBookings(prevState => {
          return prevState.map((ps) => {
            if (ps.id === id) {
              return {
                ...ps,
                presence_role: "check_out_confirmed",
                utc_check_out_confirmed
              }
            }
            return ps
          })
        })
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
        setBookings(prevState => {
          return prevState.map((ps) => {
            if (ps.id === id) {
              return {
                ...ps,
                presence_role: "not_present"
              }
            }
            return ps
          })
        })
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
          <div className="flex mt-6 flex-wrap gap-20 border-b pb-4 mb-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-500" />
              <div className="text-sm">
                <p className="font-semibold">Check-in</p>
                <p className="text-slate-500">
                  {fmtPlainDateBR(check_in, "dd/MM/yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-500" />
              <div className="text-sm">
                <p className="font-semibold">Check-in confirmado em</p>
                <p className="text-slate-500">
                  <p className="text-green-700">
                    {utc_check_in_confirmed
                      &&
                      `${format(utc_check_in_confirmed, "dd/MM/yyyy 'às' HH:mm")}`
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
                  {fmtPlainDateBR(check_out)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-500" />
              <div className="text-sm">
                <p className="font-semibold">Check-out confirmado em</p>
                <p className="text-slate-500">
                  <p className="text-blue-700">
                    {utc_check_out_confirmed
                      &&
                      `${format(utc_check_out_confirmed, "dd/MM/yyyy 'às' HH:mm")}`
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
              <Coins className="h-4 w-4 text-slate-500" />
              <div className="text-sm">
                <p className="font-semibold">Preço</p>
                <p className="text-slate-500">
                  {formatted}
                </p>
              </div>
            </div>
          </div>
          <div>
            {
              dependents.length + guests.length + children.length + stepchildren.length + associates.length > 0
              &&
              <>
                <h2 className="font-medium text-sm flex items-center gap-2"><UsersRound className="h-4 w-4 text-slate-500" /> Acompanhantes ({dependents.length + guests.length + children.length + stepchildren.length + associates.length})</h2>
                <section className="flex flex-wrap mt-2 pb-4 mb-2 border-b gap-4">
                  {
                    dependents.length > 0
                      ?
                      dependents.map(dep => (
                        <div className="bg-muted text-sm rounded-lg p-2">
                          <p className="font-bold">{dep.name} - Dependente</p>
                          <span className="text-slate-500 text-xs font-medium">CPF: {dep.cpf}</span>
                        </div>
                      ))
                      : <></>
                  }
                  {
                    guests.length > 0
                      ?
                      guests.map(gue => (
                        <div className="bg-muted text-sm rounded-lg p-2">
                          <p className="font-bold">{gue.name} - Convidado</p>
                          <span className="text-slate-500 text-xs font-medium">CPF: {gue.cpf}</span>
                        </div>
                      ))
                      : <></>
                  }
                  {
                    children.length > 0
                      ?
                      children.map(chi => (
                        <div className="bg-muted text-sm rounded-lg p-2">
                          <p className="font-bold">{chi.name} - Menor de 5 anos</p>
                          <span className="text-slate-500 text-xs font-medium">CPF: {chi.cpf ? chi.cpf : "Não possui"}</span>
                        </div>
                      ))
                      : <></>
                  }
                  {
                    stepchildren.length > 0
                      ?
                      stepchildren.map(ste => (
                        <div className="bg-muted text-sm rounded-lg p-2">
                          <p className="font-bold">{ste.name} - Enteado</p>
                          <span className="text-slate-500 text-xs font-medium">CPF: {ste.cpf ? ste.cpf : "Não possui"}</span>
                        </div>
                      ))
                      : <></>
                  }
                  {
                    associates.length > 0
                      ?
                      associates.map(ass => (
                        <div className="bg-muted text-sm rounded-lg p-2">
                          <p className="font-bold">{ass.name} - Enteado</p>
                          <span className="text-slate-500 text-xs font-medium">CPF: {ass.cpf}</span>
                        </div>
                      ))
                      : <></>
                  }
                </section>
              </>
            }
          </div>
        </CardContent>
        <div className="flex gap-4">
          <Button disabled={presence_role === 'pending' ? false : true} variant={'check_in_confirmed'} onClick={() => handleCheckIn('check_in_confirmed')}><CheckCircle />Realizar Check-In</Button>
          <Button variant="not_present" disabled={presence_role === 'pending' ? false : true} onClick={() => handleNotPresence('not_present')}><XCircle />Marcar como Não compareceu</Button>
          <Button variant={'check_out_confirmed'} disabled={presence_role === 'check_in_confirmed' ? false : true} onClick={() => handleCheckOut('check_out_confirmed')}><CheckCircle /> Realizar Check-Out</Button>
        </div>
      </div>
    </Card>
  )
}