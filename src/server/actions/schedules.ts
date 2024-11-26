"use server";

import { actionClient, ActionError } from "@/lib/safe-action";
import { scheduleSchema, type schedulesDaysSchema } from "@/zod-schema/schema";
import { db } from "../db";
import { schedules, schedulesDays } from "../db/schema";
import { z } from "zod";
import { validateAdminSession } from "./users";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createSchedule = actionClient
  .schema(scheduleSchema)
  .action(async ({ parsedInput: { name, days } }) => {
    const [schedule] = await db
      .insert(schedules)
      .values({
        name,
      })
      .returning({ id: schedules.id });

    if (!schedule) throw new Error("Something went wrong");

    const filteredIntervals: z.infer<typeof schedulesDaysSchema>[] =
      days.flatMap((day, index) => {
        return day
          .filter(
            (interval): interval is { startTime: string; endTime: string } =>
              interval !== undefined && !!interval.startTime,
          )
          .map((interval) => ({
            ...interval,
            dayOfWeek: index,
            scheduleId: schedule.id,
          }));
      });

    await db.insert(schedulesDays).values(filteredIntervals);
    revalidatePath("/admin/schedules");
    return { message: "Schedule created successfully" };
  });

export const updateSchedule = actionClient
  .schema(scheduleSchema)
  .action(async ({ parsedInput }) => {
    await validateAdminSession();
    if (!parsedInput.id) throw new Error("Schedule ID is required");
    const selectedSchedule = await db.query.schedules.findFirst({
      where: eq(schedules.id, parsedInput.id),
      with: {
        schedulesDays: true,
      },
    });
    if (!selectedSchedule) throw new Error("Schedule not found");
    await db
      .update(schedules)
      .set({ name: parsedInput.name })
      .where(eq(schedules.id, parsedInput.id));

    const existingScheduleDays = selectedSchedule.schedulesDays;

    const newScheduleDays = parsedInput.days.flatMap((day, index) => {
      return day
        .filter(
          (interval): interval is { startTime: string; endTime: string } =>
            interval !== undefined && !!interval.startTime,
        )
        .map((interval) => ({
          ...interval,
          dayOfWeek: index,
          scheduleId: parsedInput.id!,
        }));
    });

    const toDelete = existingScheduleDays.filter((existing) => {
      return !newScheduleDays.some(
        (inserted) =>
          inserted.dayOfWeek === existing.dayOfWeek &&
          inserted.startTime === existing.startTime &&
          inserted.endTime === existing.endTime,
      );
    });

    if (toDelete.length > 0) {
      const toDeleteIds = toDelete.map((day) => day.id);

      await db
        .delete(schedulesDays)
        .where(inArray(schedulesDays.id, toDeleteIds));
    }

    const toInsert = newScheduleDays.filter((newDay) => {
      return !existingScheduleDays.some(
        (existingDay) =>
          existingDay.dayOfWeek === newDay.dayOfWeek &&
          existingDay.startTime === newDay.startTime &&
          existingDay.endTime === newDay.endTime,
      );
    });
    await db.insert(schedulesDays).values(toInsert);

    revalidatePath("/admin/schedules");
    return { message: "Schedule updated successfully" };
  });

export const getSchedules = actionClient.action(async () => {
  await validateAdminSession();
  return db.query.schedules.findMany();
});

export const getSchedule = actionClient
  .schema(z.number())
  .action(async ({ parsedInput }) => {
    await validateAdminSession();
    const res = await db.query.schedules.findFirst({
      where: eq(schedules.id, parsedInput),
      with: {
        schedulesDays: true,
      },
    });
    if (!res) throw new Error("Schedule not found");
    const schedule = {
      id: res.id,
      name: res.name,
      days: Array.from({ length: 7 }, (_, index) => {
        const days = res.schedulesDays.filter((day) => day.dayOfWeek === index);
        if (days.length === 1) {
          return [{ ...days[0] }, { startTime: "", endTime: "" }];
        }
        return days.length > 0
          ? days.map((day) => ({
              startTime: day.startTime,
              endTime: day.endTime,
            }))
          : [
              { startTime: "", endTime: "" },
              { startTime: "", endTime: "" },
            ];
      }),
    };
    return schedule;
  });

export const deleteSchedule = actionClient
  .schema(z.number())
  .action(async ({ parsedInput }) => {
    await validateAdminSession();
    const schedule = await db.query.schedules.findFirst({
      where: eq(schedules.id, parsedInput),
    });
    if (!schedule) throw new Error("Schedule not found");
    await db.delete(schedules).where(eq(schedules.id, parsedInput));
    revalidatePath("/admin/schedules");
    return { message: "Schedule deleted successfully" };
  });
