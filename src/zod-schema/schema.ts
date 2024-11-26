import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { schedulesDays, users } from "@/server/db/schema";
import { parseTime } from "@/lib/utils";
import { areIntervalsOverlapping } from "date-fns";

const MAX_FILE_SIZE = 1024 * 1024;

const imageFile = z
  .instanceof(File)
  .refine((file: File) => file.size !== 0, "Image is required")
  .refine((file) => file?.size < MAX_FILE_SIZE, "Max size is 1MB")
  .refine((file) => file?.type.startsWith("image/"), "Only images are allowed")
  .optional();

export const loginSchema = z.object({
  email: z.string().trim().email({
    message: "Invalid email",
  }),
});

export const selectUserSchema = createSelectSchema(users).omit({
  emailVerified: true,
});

export const userSchema = z.object({
  id: z.string().min(0).optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().trim().email({
    message: "Invalid email",
  }),
  image: z.boolean().default(false),
  imageFile,
  scheduleId: z.coerce.number().optional(),
});
export const schedulesDaysSchema = createInsertSchema(schedulesDays);

const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const timeIntervalSchema = z
  .object({
    startTime: z
      .string()
      .regex(timeFormatRegex, "You must select a time.")
      .or(z.literal("")),
    endTime: z
      .string()
      .regex(timeFormatRegex, "You must select a time.")
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (
        (!data.startTime && !data.endTime) ||
        (!!data.startTime && !!data.endTime)
      )
        return true;
      return !data.startTime && !!data.endTime;
    },
    {
      path: ["endTime"],
      message: "You must input end time.",
    },
  )
  .refine(
    (data) => {
      if (
        (!data.startTime && !data.endTime) ||
        (!!data.startTime && !!data.endTime)
      )
        return true;
      return !!data.startTime && !data.endTime;
    },
    {
      path: ["startTime"],
      message: "You must input start time.",
    },
  )
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      const startTime = parseTime(data.startTime);
      const endTime = parseTime(data.endTime);
      return startTime < endTime;
    },
    {
      path: ["endTime"],
      message: "End time must be after start time.",
    },
  );

export const scheduleSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required").default(""),
    days: z
      .array(
        z
          .array(timeIntervalSchema.optional())
          .max(2)
          .superRefine((data, ctx) => {
            if (!data[0] || !data[1]) return;
            const firstInterval = {
              start: parseTime(data[0].startTime),
              end: parseTime(data[0].endTime),
            };
            const secondInterval = {
              start: parseTime(data[1].startTime),
              end: parseTime(data[1].endTime),
            };
            if (areIntervalsOverlapping(firstInterval, secondInterval)) {
              ctx.addIssue({
                path: ["1.startTime"],
                code: z.ZodIssueCode.custom,
                message: "Second interval must not overlap with the first one.",
              });
            }
          }),
      )
      .length(7),
  })
  .refine(
    (data) => {
      return data.days.flat().some((interval) => interval?.startTime);
    },
    {
      path: ["days"],
      message: "You must input at least one interval.",
    },
  );

export const clockingSchema = z.object({
  id: z.number(),
  userId: z.string().min(0),
  clockIn: z.date(),
  clockOut: z.date().nullable(),
  user: selectUserSchema.extend({
    schedules: z.object({
      schedulesDays: schedulesDaysSchema.array(),
    }),
  }),
});

/*
.instanceof(File)
    .refine((file: File) => file.size !== 0, "Image is required")
    .refine((file) => file?.size < MAX_FILE_SIZE, "Max size is 1MB")
    .refine(
      (file) => file?.type.startsWith("image/"),
      "Only images are allowed",
    ),
    */
