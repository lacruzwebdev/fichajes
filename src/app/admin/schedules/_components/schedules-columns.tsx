"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type ColumnDef } from "@tanstack/react-table";
import { type scheduleSchema } from "@/zod-schema/schema";
import { type z } from "zod";
import { getS3URL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import SchedulesColumnsActions from "./schedules-columns-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<{ id: number; name: string }>[] = [
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
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name: string = row.getValue("name") ?? "Sin nombre establecido";
      return (
        <div className="flex items-center gap-2">
          <p>{name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <SchedulesColumnsActions scheduleId={row.original.id} />;
    },
  },
];
