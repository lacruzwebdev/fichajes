import { env } from "@/env";
import { clsx, type ClassValue } from "clsx";
import { differenceInMinutes } from "date-fns";
import { type User } from "next-auth";
import { twMerge } from "tailwind-merge";

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
