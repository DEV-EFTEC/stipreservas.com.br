"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"
import { enumStatus } from "@/lib/enumStatus"
import { SelectValue, SelectTrigger, Select, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function DataTable({
  columns,
  data,
  nextPage,
  previousPage,
  pagination
}) {
  const [columnFilters, setColumnFilters] = React.useState(
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    manualPagination: true,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      pagination: {
        pageSize: !pagination ? 0 : pagination.limit,
        pageIndex: !pagination ? 0 : pagination.page 
      }
    }
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Select onValueChange={(e) => table.getColumn("status")?.setFilterValue(e !== "none" ? e : "")} value={(table.getColumn("status")?.getFilterValue()) ?? ""}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"none"}>Sem filtro</SelectItem>
            {Object.entries(enumStatus).map(([key, label]) => {
              return (
                <SelectItem value={key}>
                  <Badge variant={key}>{label}</Badge>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {
        pagination
        &&
        <div className="flex items-center justify-center space-x-8 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={previousPage}
            disabled={pagination.page === 1}
          >
            <ChevronLeft />
            Anterior
          </Button>
          <p>Página {pagination.page} de {pagination.total_pages}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={pagination.page === pagination.total_pages}
          >
            Próximo
            <ChevronRight />
          </Button>
        </div>
      }
    </div>
  )
}
