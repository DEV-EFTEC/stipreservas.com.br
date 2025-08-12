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

export default function CardLocalBooking({ holders, associates, dependents, stepchildren, guests, children, check_in, check_out, presence_role, status, id, rooms }) {

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

  return (
    <Card className={'flex flex-row justify-between p-5'}>
      <div className="w-full m-0 p-0">
        <CardHeader className="m-0 p-0">
          <CardTitle>{holders[0].name} - {holders[0].cpf} - Check-In: {format(check_in, 'dd/MM/yyyy')} | Check-Out: {format(check_out, 'dd/MM/yyyy')}<Badge variant={status}>{enumStatus[status]}</Badge></CardTitle>
          <CardDescription>Reserva #{id.slice(0, 8)}</CardDescription>
          <CardDescription>Quartos {rooms.map(r => r.number).join(', ')}</CardDescription>
        </CardHeader>
        <CardContent className="m-0 p-0">
          <div>
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
      <div className="flex flex-col gap-4">
        <Button disabled={presence_role === 'pending' ? false : true} variant={'check_in_confirmed'} onClick={() => handleCheckIn('check_in_confirmed')}>Confirmar Check-In</Button>
        <Button variant="not_presence" disabled={presence_role === 'pending' ? false : true} onClick={() => handleNotPresence('not_present')}>Não compareceu</Button>
        <Button variant={'refused'} disabled={presence_role === 'check_in_confirmed' ? false : true} onClick={() => handleCheckOut('check_out_confirmed')}>Confirmar Check-Out</Button>
      </div>
    </Card>
  )
}