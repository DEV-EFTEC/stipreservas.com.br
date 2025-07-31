import { useEffect, useState } from "react";
import { differenceInCalendarDays, format, addDays, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

export default function DatePickerWithRange({ className, date, setDate, associate_role }) {
  const diasMax = associate_role === "partner" ? 10 : 7;
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  const liberaMesSeguinte = day >= 10;

  const mesLiberado = liberaMesSeguinte ? month + 1 : month;
  const anoLiberado = liberaMesSeguinte && month === 11 ? year + 1 : year;

  const inicioMesLiberado = new Date(anoLiberado, mesLiberado, 1);
  const dataMinima = addDays(inicioMesLiberado, 7);
  const dataMaxima = endOfMonth(inicioMesLiberado);
  const defaultMonth = inicioMesLiberado;

  const handleSelect = (range) => {
    if (!range?.from) {
      setDate({ from: undefined, to: undefined });
      return;
    }

    if (range.from && !range.to) {
      if (range.from < dataMinima) {
        toast.warning("As reservas devem ser feitas com pelo menos 7 dias de antecedência.");
        setDate({ from: undefined, to: undefined });
        return;
      }

      setDate(range);
      return;
    }

    const diff = differenceInCalendarDays(range.to, range.from);

    if (diff <= diasMax - 1) {
      setDate(range);
    } else {
      toast.error(`Seu tipo de cadastro permite reservas de até ${diasMax} dias.`);
      setDate({ from: range.to, to: undefined });
    }
  };

  const handleClear = () => {
    setDate({ from: undefined, to: undefined });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd 'de' LLLL", { locale: ptBR })} -{" "}
                  {format(date.to, "dd 'de' LLLL", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "dd 'de' LLLL", { locale: ptBR })
              )
            ) : (
              <span>Selecione um intervalo</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col items-center">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={defaultMonth}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={1}
              locale={ptBR}
              disabled={(day) => day < dataMinima || day > dataMaxima}
            />
            <Button
              variant="ghost"
              className="text-xs text-muted-foreground mt-2"
              onClick={handleClear}
            >
              <X className="w-4 h-4 mr-1" />
              Limpar intervalo
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
