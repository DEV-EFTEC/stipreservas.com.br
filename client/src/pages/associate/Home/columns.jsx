"use client"

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { enumStatus } from "@/lib/enumStatus";

export const columns = [
  {
    accessorKey: "id",
    header: "Cód.",
    cell: ({ row }) => (
      <>
        #
        {
          row.original.id.slice(0, 8)
        }
      </>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status}>
        {enumStatus[row.original.status]}
      </Badge>
    )
  },
  {
    accessorKey: "check_in",
    header: "Entrada",
    cell: ({ row }) => (format(row.original.check_in, "dd/MM/yyyy"))
  },
  {
    accessorKey: "check_out",
    header: "Saída",
    cell: ({ row }) => (format(row.original.check_out, "dd/MM/yyyy"))
  },
  {
    accessorKey: "utc_created_on",
    header: "Criada em",
    cell: ({ row }) => (format(row.original.utc_created_on, "dd/MM/yyyy 'às' HH:mm"))
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const navigate = useNavigate();

      return (
        <>
          <Button
            variant={'outline'}
            onClick={() => navigate(`/associado/solicitacao/${row.original.id.slice(0, 8)}?booking_id=${row.original.id}`)}
          >
            Ver detalhes
          </Button>
        </>
      );
    }
  }
]
