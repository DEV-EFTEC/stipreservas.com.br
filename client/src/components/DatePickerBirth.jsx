import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"

export default function DatePickerBirth({ date, setDate, isChild = false }) {
  const [open, setOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(date || new Date())

  const currentYear = new Date().getFullYear()
  const maxYear = isChild ? currentYear : currentYear - 0
  const minYear = isChild ? currentYear - 5 : currentYear - 100

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i)

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  const today = new Date()
  const fiveYearsAgo = new Date()
  fiveYearsAgo.setFullYear(today.getFullYear() - 5)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-80 justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecionar data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selected) => {
            setDate(selected)
            setCalendarMonth(selected)
            setOpen(false)
          }}
          locale={ptBR}
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          disabled={(date) => {
            if (isChild) {
              return date > today || date < fiveYearsAgo
            }
            return false
          }}
          components={{
            Caption: ({ displayMonth, onMonthChange }) => {
              const handleMonthChange = (e) => {
                const newDate = new Date(calendarMonth)
                newDate.setMonth(Number(e.target.value))
                setCalendarMonth(newDate)
              }

              const handleYearChange = (e) => {
                const newDate = new Date(calendarMonth)
                newDate.setFullYear(Number(e.target.value))
                setCalendarMonth(newDate)
              }

              return (
                <div className="flex justify-center gap-2 mt-2 mb-4">
                  <select
                    value={displayMonth.getMonth()}
                    onChange={handleMonthChange}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {months.map((month, idx) => (
                      <option key={idx} value={idx}>
                        {month}
                      </option>
                    ))}
                  </select>

                  <select
                    value={displayMonth.getFullYear()}
                    onChange={handleYearChange}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
