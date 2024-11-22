import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { clockings, users } from "@/server/db/schema";

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
});

export const clockingSchema = z.object({
  id: z.number(),
  userId: z.string().min(0),
  clockIn: z.date(),
  clockOut: z.date().nullable(),
  user: selectUserSchema,
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
