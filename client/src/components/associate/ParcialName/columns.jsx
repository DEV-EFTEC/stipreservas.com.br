"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => { row.toggleSelected(!!value) }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "cpf",
    header: "CPF",
  },
  {
    accessorKey: "birth_date",
    header: "Data de nascimento",
    cell: ({ row }) => (format(row.original.birth_date, 'dd/MM/yyyy', { locale: ptBR }))
  },
]
