import { useEffect, useState } from "react";
import { differenceInCalendarDays, format, addDays } from "date-fns";
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
  const dataMinima = addDays(new Date(), 7); // mínimo 7 dias de antecedência

  const handleSelect = (range) => {
    // Seleção inicial
    if (!range?.from) {
      setDate({ from: undefined, to: undefined });
      return;
    }

    // Apenas o from selecionado
    if (range.from && !range.to) {
      // Validar se a data está dentro do mínimo de antecedência
      if (range.from < dataMinima) {
        toast.warning("As reservas devem ser feitas com pelo menos 7 dias de antecedência.");
        setDate({ from: undefined, to: undefined });
        return;
      }

      setDate(range);
      return;
    }

    // Valida o intervalo
    const diff = differenceInCalendarDays(range.to, range.from);

    if (diff <= diasMax - 1) {
      setDate(range);
    } else {
      toast.error(`Seu tipo de cadastro permite reservas de até ${diasMax} dias.`);
      setDate({ from: range.to, to: undefined }); // recomeça seleção
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
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={2}
              locale={ptBR}
              disabled={(day) => day < dataMinima}
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
