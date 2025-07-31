import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import { addDays, subDays } from "date-fns";

export default function CalendarRangeSelection({ start_period_date, end_period_date, dateRange, setDateRange }) {
  return (
    <Calendar
      mode="range"
      defaultMonth={new Date(start_period_date)}
      selected={dateRange}
      onSelect={setDateRange}
      disabled={{
        before: subDays(new Date(start_period_date), 1),
        after: addDays(new Date(end_period_date), 1),
      }}
      className="rounded-lg border shadow-sm" />
  );
}
