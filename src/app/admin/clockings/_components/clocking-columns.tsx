"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type ColumnDef } from "@tanstack/react-table";
import { type z } from "zod";
import { calculateTimeDifference, getS3URL, isClockingLate } from "@/lib/utils";
import { type clockingSchema } from "@/zod-schema/schema";
import { compareAsc, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import ClockingColumnsActions from "./clocking-columns-actions";
import { Checkbox } from "@/components/ui/checkbox";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<z.infer<typeof clockingSchema>>[] = [
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
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <p>{row.original.id}</p>,
  },
  {
    accessorKey: "clockingTotalTime",
    header: "Clocked Time",
    cell: ({ row }) => (
      <p>
        {row.original.clockOut
          ? calculateTimeDifference(row.original.clockIn, row.original.clockOut)
          : "---"}
      </p>
    ),
  },
  {
    accessorKey: "user",
    filterFn: (row, columnId, filterValue: string) => {
      const user: {
        name: string;
      } = row.getValue(columnId);
      return user.name.toLowerCase().includes(filterValue.toLowerCase());
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const img: string = row.original.user.image ?? "";
      const name: string = row.original.user.name ?? "Sin nombre establecido";
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getS3URL(img)} />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <p>{name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "clockIn",
    header: "Clock In Time",
    cell: ({ row }) => {
      const clockIn = row.original.clockIn;
      const schedulesDays = row.original.user.schedules.schedulesDays;
      const { isLate, formattedTime } = isClockingLate(clockIn, schedulesDays);
      return (
        <p>
          {format(row.original.clockIn, "HH:mm")}{" "}
          <span
            className={`text-xs ${isLate ? "text-green-500" : "text-red-500"}`}
          >
            {formattedTime}
          </span>
        </p>
      );
    },
  },
  {
    accessorKey: "clockOut",
    header: "Clock Out Time",
    cell: ({ row }) => {
      const clockOut = row.original.clockOut;
      if (!clockOut) return <p>---</p>;
      const schedulesDays = row.original.user.schedules.schedulesDays;
      const { isLate, formattedTime } = isClockingLate(
        clockOut,
        schedulesDays,
        "endTime",
      );

      return (
        <p>
          {format(clockOut, "HH:mm")}{" "}
          <span
            className={`text-xs ${isLate ? "text-red-500" : "text-green-500"}`}
          >
            {formattedTime}
          </span>
        </p>
      );
    },
  },
  {
    accessorKey: "date",
    sortingFn: (a, b) => compareAsc(a.original.clockIn, b.original.clockIn),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <p>{format(row.original.clockIn, "dd-MM-yyyy")}</p>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <ClockingColumnsActions clocking={row.original} />;
    },
  },
];
