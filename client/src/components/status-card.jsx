import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Badge } from "@/components/ui/badge"
import { CalendarArrowDown, CalendarArrowUp, Circle, PartyPopper } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import LexicalViewerCard from "./lexical-viewer-card"
import { apiRequest } from "@/lib/api"

const enumStatus = {
  "not_initiated": 'Não iniciado',
  "in_progress": 'Em progresso',
  "cancelled": 'Cancelado',
  "concluded": 'Concluído',
}

export default function StatusCard({ draw, setDraws }) {

  async function handleChangeStatus(status) {
    const result = await apiRequest(`/draws/${draw.id}/update-draw`, {
      method: 'PUT',
      body: JSON.stringify({
        status
      })
    })
    setDraws(prevState =>
      prevState.map(ps => {
        if (ps.id === result.id) {
          return {
            ...result
          }
        }
        return ps
      })
    );
  }

  return (
    <Card className={"gap-2 min-w-full"}>
      <CardHeader>
        <Badge variant={draw.status}>{enumStatus[draw.status]}</Badge>
        <CardTitle className={"text-xl mt-1"}>{draw.title}</CardTitle>
        <CardAction className={'flex space-x-4'}>
          <Select value={draw.status} onValueChange={handleChangeStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_initiated">Não iniciado</SelectItem>
              <SelectItem value="in_progress">Em progresso</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
              <SelectItem value="concluded">Concluído</SelectItem>
            </SelectContent>
          </Select>
          <Button variant={'outline'} onClick={() => alert("hello world")}>Configurar</Button>
        </CardAction>
      </CardHeader>
      <CardContent className={''}>
        <LexicalViewerCard jsonContent={draw.description} />
      </CardContent>
      <CardFooter className={'flex flex-col items-start justify-center space-y-4'}>
        <section className={'flex items-center space-x-4'}>
          <div className="flex items-center gap-1 text-sm text-foreground/60">
            <CalendarArrowUp size={16} />
            {format(draw.start_date, 'dd/MM/yyyy')}
          </div>
          <div className="flex items-center gap-1 text-sm text-foreground/60">
            <CalendarArrowDown size={16} />
            {format(draw.end_date, 'dd/MM/yyyy')}
          </div>
          <div className="flex items-center gap-1 text-sm text-foreground/60">
            <PartyPopper size={16} />
            {format(draw.draw_date, 'dd/MM/yyyy')}
          </div>
          <div className="flex items-center gap-1 text-sm text-foreground/60">
            <Circle size={16} strokeWidth="20px" color={draw.color} className="rounded-xl" />
            {draw.color}
          </div>
          <div className="flex items-center gap-1 text-sm text-foreground/60">
            <Circle size={16} strokeWidth="20px" color={draw.color_2} className="rounded-xl" />
            {draw.color_2}
          </div>
        </section>
        <p className="text-sm text-right w-full text-foreground/50">Criado em {format(draw.utc_created_on, "dd/MM/yyyy 'às' HH:mm")}</p>
      </CardFooter>
    </Card>
  )
}