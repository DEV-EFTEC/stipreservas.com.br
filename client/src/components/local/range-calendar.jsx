import * as React from "react"

import { Calendar } from "@/components/ui/calendar"


export default function RangeCalendar({ dateRange, setDateRange }) {
  return (
    <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={setDateRange}
      numberOfMonths={2}
      className="rounded-lg border shadow-sm" />
  );
}
