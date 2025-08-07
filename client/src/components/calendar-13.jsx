import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

export default function Calendar13() {
  const [dropdown, setDropdown] =
    React.useState("dropdown")
  const [date, setDate] = React.useState(new Date(2025, 5, 12))

  return (
    <div className="flex flex-col gap-4">
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        captionLayout={"dropdown"}
        className="rounded-lg border shadow-sm" />
    </div>
  );
}
