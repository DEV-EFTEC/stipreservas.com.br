import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { CalendarArrowDown, CalendarArrowUp, Circle, PartyPopper } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import LexicalViewerCard from "./lexical-viewer-card"

const enumStatus = {
  "not_initiated": 'Não iniciado',
  "in_progress": 'Em progresso',
  "cancelled": 'Cancelado',
  "concluded": 'Concluído',
}

export default function StatusCard({ status, title, content, start_date, end_date, utc_created_on, color = "#CCCCCC", color2, draw_date }) {
  return (
    <Card className={"gap-2 min-w-full"}>
      <CardHeader>
        <Badge variant={status}>{enumStatus[status]}</Badge>
        <CardTitle className={"text-xl mt-1"}>{title}</CardTitle>
        <CardAction>
          <Button variant={'outline'} onClick={() => alert("hello world")}>Configurar</Button>
        </CardAction>
      </CardHeader>
      <CardContent className={''}>
        <LexicalViewerCard jsonContent={content} />
      </CardContent>
      <CardFooter className={'flex flex-col items-start justify-center space-y-4'}>
        <section className={'flex items-center space-x-4'}>
          <div className="flex items-center gap-1 text-sm text-foreground/60">
            <CalendarArrowUp size={16} />
            {format(start_date, 'dd/MM/yyyy')}
          </div>
          <div className="flex items-center gap-1 text-sm text-foreground/60">
            <CalendarArrowDown size={16} />
            {format(end_date, 'dd/MM/yyyy')}
          </div>
          <div className="flex items-center gap-1 text-sm text-foreground/60">
            <PartyPopper size={16} />
            {format(draw_date, 'dd/MM/yyyy')}
          </div>
          <div className="flex items-center gap-1 text-sm text-foreground/60">
            <Circle size={16} strokeWidth="20px" color={color} className="rounded-xl" />
            {color}
          </div>
          <div className="flex items-center gap-1 text-sm text-foreground/60">
            <Circle size={16} strokeWidth="20px" color={color2} className="rounded-xl" />
            {color2}
          </div>
        </section>
        <p className="text-sm text-right w-full text-foreground/50">Criado em {format(utc_created_on, "dd/MM/yyyy 'às' HH:mm")}</p>
      </CardFooter>
    </Card>
  )
}