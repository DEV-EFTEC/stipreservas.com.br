import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

export default function Calendar05() {
  const [dateRange, setDateRange] = React.useState({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  })

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
