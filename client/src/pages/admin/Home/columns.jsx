"use client"

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { enumStatus } from "@/lib/enumStatus";

const enumAssociateRole = {
  "partner": "Sócio",
  "contributor": "Contribuinte"
}

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
    accessorKey: "created_by_name",
    header: "Titular",
  },
  {
    accessorKey: "created_by_associate_role",
    header: "Associação",
    cell: ({ row }) => (
      <Badge variant={row.original.created_by_associate_role}>
        {enumAssociateRole[row.original.created_by_associate_role]}
      </Badge>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status}>{enumStatus[row.original.status]}</Badge>
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
      const navigate = useNavigate(); // AGORA dentro do componente (correto!)

      return (
        <>
          {
            row.original.status === 'pending_approval' |
              row.original.status === 'refused'
              ?
              <Button
                variant={'outline'}
                onClick={() => navigate(`/admin/solicitacao/${row.original.id}?booking_id=${row.original.id}`)}
              >
                Ver solicitação
              </Button>
              :
              <></>
          }
        </>
      );
    }
  }
]
