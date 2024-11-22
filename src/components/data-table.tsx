"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import DeleteBulkUsers from "@/app/admin/users/_components/delete-bulk-users";
import { z } from "zod";
import { clockingSchema, selectUserSchema } from "@/zod-schema/schema";
import DeleteBulkClockings from "@/app/admin/clockings/_components/delete-bulk-clocking";

interface DataTableProps<TData, TValue> {
  type: "users" | "clockings";
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  type,
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  const visiblePages = Array.from(Array(pageCount).keys()).filter(
    (page) =>
      page === 0 || page === pageCount - 1 || Math.abs(page - currentPage) <= 1,
  );

  return (
    <>
      <div className="flex items-center py-4">
        {table.getAllColumns().some((obj) => obj.id === "email") && (
          <Input
            placeholder="Filter by email"
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        {table.getAllColumns().some((obj) => obj.id === "user") && (
          <Input
            placeholder="Filter by user"
            value={(table.getColumn("user")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("user")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
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
                            header.getContext(),
                          )}
                    </TableHead>
                  );
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-start justify-end space-x-2 py-4">
        <div className="flex-1 text-xs text-muted-foreground">
          <div>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          {table.getFilteredSelectedRowModel().rows.length > 0 &&
            type === "users" && (
              <DeleteBulkUsers
                setRowSelection={setRowSelection}
                users={
                  table
                    .getFilteredSelectedRowModel()
                    .rows.map((row) => row.original) as z.infer<
                    typeof selectUserSchema
                  >[]
                }
              />
            )}
          {table.getFilteredSelectedRowModel().rows.length > 0 &&
            type === "clockings" && (
              <DeleteBulkClockings
                setRowSelection={setRowSelection}
                clockings={
                  table
                    .getFilteredSelectedRowModel()
                    .rows.map((row) => row.original) as z.infer<
                    typeof clockingSchema
                  >[]
                }
              />
            )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          {visiblePages.map((page) => (
            <Button
              key={page}
              variant={
                page === table.getState().pagination.pageIndex
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => table.setPageIndex(page)}
            >
              {page + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
