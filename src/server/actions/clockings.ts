"use server";

import { actionClient, ActionError } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "../db";
import { and, asc, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { clockings, users } from "../db/schema";
import { revalidatePath } from "next/cache";
import { validateAdminSession, validateUserSession } from "./users";
import { clockingSchema } from "@/zod-schema/schema";

export const getUserClockings = actionClient
  .schema(z.string().min(0))
  .action(async ({ parsedInput }) => {
    await validateUserSession();
    const data = await db
      .select()
      .from(clockings)
      .where(eq(clockings.userId, parsedInput));
    return data;
  });

export const addUserClocking = actionClient.action(async () => {
  const userId = await validateUserSession();
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!currentUser?.id) throw new ActionError("User not found");
  await db.insert(clockings).values({
    userId: currentUser.id,
  });
});

export const getLatestOpenClocking = actionClient.action(async () => {
  const userId = await validateUserSession();
  const data = await db
    .select()
    .from(clockings)
    .where(eq(clockings.userId, userId) && isNull(clockings.clockOut))
    .limit(1);
  return data;
});

export const getTodaysClockings = actionClient.action(async () => {
  const userId = await validateUserSession();
  const data = await db
    .select()
    .from(clockings)
    .where(
      eq(clockings.userId, userId) &&
        sql`strftime('%Y-%m-%d', clock_in, 'unixepoch') = DATE('now')`,
    );
  return data;
});

export const clockUser = actionClient.action(async () => {
  const userId = await validateUserSession();
  const [openedClocking] = await db
    .select()
    .from(clockings)
    .where(
      and(
        eq(clockings.userId, userId),
        sql`strftime('%Y-%m-%d', clock_in, 'unixepoch') = DATE('now')`,
        isNull(clockings.clockOut),
      ),
    )
    .limit(1);

  if (openedClocking) {
    await db
      .update(clockings)
      .set({
        clockOut: sql`strftime('%s', 'now')`,
      })
      .where(eq(clockings.id, openedClocking.id));
  } else {
    await addUserClocking();
  }
  revalidatePath("/dashboard");
});

export const hasOpenedClocking = actionClient.action(async () => {
  const userId = await validateUserSession();
  const openedClocking = await db
    .select()
    .from(clockings)
    .where(
      and(
        eq(clockings.userId, userId),
        sql`strftime('%Y-%m-%d', clock_in, 'unixepoch') = DATE('now')`,
        isNull(clockings.clockOut),
      ),
    )
    .limit(1);
  return openedClocking.length > 0;
});

export const getClockings = actionClient.action(async () => {
  await validateAdminSession();
  const data = await db.query.clockings.findMany({
    orderBy: [desc(clockings.clockIn)],
    with: {
      user: true,
    },
  });
  return data;
});

export const deleteClocking = actionClient
  .schema(z.number().min(0))
  .action(async ({ parsedInput: clockingId }) => {
    await validateAdminSession();
    const [deletedClocking] = await db
      .delete(clockings)
      .where(eq(clockings.id, clockingId))
      .returning({ id: clockings.id });
    if (!deletedClocking) throw new ActionError("Clocking not found");
    revalidatePath("/admin/clockings");
    return { message: "Clocking deleted successfully" };
  });

export const deleteClockings = actionClient
  .schema(z.array(z.number()))
  .action(async ({ parsedInput }) => {
    await validateAdminSession();
    const deletedClockings = await db
      .delete(clockings)
      .where(inArray(clockings.id, parsedInput));
    if (!deletedClockings) throw new ActionError("Clockings not found");
    revalidatePath("/admin/clockings");
    return { message: "Clockings deleted successfully" };
  });

export const updateClocking = actionClient
  .schema(clockingSchema.pick({ id: true, clockIn: true, clockOut: true }))
  .action(async ({ parsedInput }) => {
    await validateAdminSession();
    if (!parsedInput.clockOut || parsedInput.clockOut < parsedInput.clockIn)
      throw new ActionError("Clock out must be greater than clock in");
    const [updatedClocking] = await db
      .update(clockings)
      .set({
        clockIn: parsedInput.clockIn,
        clockOut: parsedInput.clockOut,
      })
      .where(eq(clockings.id, parsedInput.id))
      .returning({ id: clockings.id });
    if (!updatedClocking) throw new ActionError("Clocking not found");
    revalidatePath("/admin/clockings");
    return { message: "Clocking updated successfully" };
  });
