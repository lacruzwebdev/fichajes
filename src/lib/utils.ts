import { env } from "@/env";
import { schedulesDaysSchema } from "@/zod-schema/schema";
import { clsx, type ClassValue } from "clsx";
import {
  differenceInMinutes,
  getDay,
  parse,
  setHours,
  setMinutes,
} from "date-fns";
import { type User } from "next-auth";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAdmin(user: User) {
  return user.role === "admin";
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytes")
      : (sizes[i] ?? "Bytes")
  }`;
}

export async function uploadFile(file: File, url: string) {
  if (!file || !url) throw new Error("Error uploading file");
  try {
    const res = await fetch(url, {
      method: "PUT",
      body: file,
    });
    if (!res.ok) {
      throw new Error("Failed to upload file");
    }
    return { success: true };
  } catch {
    throw new Error("Something went wrong");
  }
}

export function getS3URL(url: string) {
  if (!url) return "";
  return `${env.NEXT_PUBLIC_S3_URL}/${url}`;
}

export function calculateTimeDifference(d1: Date, d2: Date) {
  // Calcula la diferencia total en minutos
  const totalMinutes = differenceInMinutes(d1, d2);

  // Calcula las horas y minutos
  const hours = Math.floor(Math.abs(totalMinutes) / 60);
  const minutes = Math.abs(totalMinutes) % 60;

  const timeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return timeString;
}

export function parseTime(time: string) {
  return parse(time, "HH:mm", new Date());
}

type Interval = {
  startTime: string;
  endTime: string;
};

export function findClosestInterval(
  date: Date,
  intervals: Interval[],
): Interval {
  let closestInterval: Interval | null = null;
  let shortestDistance = Infinity;
  intervals.forEach((interval) => {
    const [startHour, startMinute] = interval.startTime.split(":").map(Number);
    const [endHour, endMinute] = interval.endTime.split(":").map(Number);

    if (!startHour || !startMinute || !endHour || !endMinute) return;

    const startDate = setMinutes(setHours(date, startHour), startMinute);
    const endDate = setMinutes(setHours(date, endHour), endMinute);

    const distanceToStart = Math.abs(differenceInMinutes(date, startDate));
    const distanceToEnd = Math.abs(differenceInMinutes(date, endDate));

    const minDistance = Math.min(distanceToStart, distanceToEnd);

    if (minDistance < shortestDistance) {
      shortestDistance = minDistance;
      closestInterval = interval;
    }
  });
  if (!closestInterval) throw new Error("No closest interval found");

  return closestInterval;
}

export function isClockingLate(
  clocking: Date,
  scheduleDays: z.infer<typeof schedulesDaysSchema>[],
  type: "startTime" | "endTime" = "startTime",
) {
  const dayOfWeek = getDay(clocking);
  const intervals = scheduleDays.filter((day) => day.dayOfWeek === dayOfWeek);
  const closestInterval = findClosestInterval(clocking, intervals);
  const [startHour, startMinute] = closestInterval[type].split(":").map(Number);
  if (!startHour || !startMinute)
    throw new Error("Invalid start time in table");
  const closestIntervalDate = setMinutes(
    setHours(clocking, startHour),
    startMinute,
  );
  const difference = differenceInMinutes(clocking, closestIntervalDate);
  const differenceIsNegative = difference < 0;
  const absoluteDifference = Math.abs(difference);
  const hours = Math.floor(absoluteDifference / 60);
  const minutes = absoluteDifference % 60;
  const formattedTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  return { isLate: differenceIsNegative, formattedTime };
}
