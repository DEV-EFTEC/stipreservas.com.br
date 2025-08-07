"use client"

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PasswordConfirmDialog } from "@/components/admin/PasswordConfirmDialog";
import { useAuth } from "@/hooks/useAuth";

const enumRole = {
  "local": "Sede Shangri-lá",
  "admin": "Sede Curitiba"
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
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "cpf",
    header: "CPF",
  },
  {
    accessorKey: "role",
    header: "Tipo",
    cell: ({ row }) => (
      <Badge variant={row.original.role}>
        {enumRole[row.original.role]}
      </Badge>
    )
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const { user } = useAuth();
      return (
        <>
          {
            row.original.id === user.id ?
              <></>
              :
              <PasswordConfirmDialog
                userId={row.original.id}
              />
          }
        </>
      );
    }
  }
]
