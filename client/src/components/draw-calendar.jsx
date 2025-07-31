import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import { subDays, addDays } from "date-fns";

export default function DrawCalendar({ setDrawDate, drawDate, start_period_date, end_period_date }) {
  return (
    <Calendar
      mode="single"
      defaultMonth={new Date(start_period_date)}
      selected={drawDate}
      onSelect={setDrawDate}
      disabled={{
        before: subDays(new Date(start_period_date), 1),
        after: addDays(new Date(end_period_date), 1),
      }}
      className="rounded-lg border shadow-sm" />
  );
}
