import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MonthYearCalendar({ date, setDate, isChild = false, isDisabled = false }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-80 justify-start text-left font-normal"
            disabled={isDisabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? fmtPlainNameDateBR(date) : <span>Selecionar data</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            defaultMonth={date}
            selected={date}
            onSelect={setDate}
            captionLayout={"dropdown"}
            className="rounded-lg border shadow-sm" />
        </PopoverContent>
      </Popover>
    </div>
  );
}
