"use server";
import { actionClient, ActionError } from "@/lib/safe-action";
import { eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { z } from "zod";
import { auth } from "../auth";
import { isAdmin } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { userSchema, type selectUserSchema } from "@/zod-schema/schema";
import { minioClient } from "../s3/config";
import { generatePresignedURL } from "./upload";

export const getUsers = actionClient.action(async () => {
  await validateAdminSession();
  const data = await db.query.users.findMany({
    where: eq(users.role, "employee"),
    columns: {
      emailVerified: false,
    },
  });

  return data;
});

export const getUser = actionClient
  .schema(z.string().min(0, "User ID is required"))
  .action(async ({ parsedInput }) => {
    await validateAdminSession();
    const user = await db.query.users.findFirst({
      where: eq(users.id, parsedInput),
      with: {
        schedules: true,
      },
    });
    if (!user) throw new ActionError("User doesn't exist");
    return user;
  });

export const createUser = actionClient
  .schema(userSchema)
  .action(async ({ parsedInput }) => {
    await validateAdminSession();
    const userExists = await db.query.users.findFirst({
      where: eq(users.email, parsedInput.email),
    });
    if (userExists) throw new ActionError("Email already in use");

    let imageUrl;
    let presignedUrl;
    if (parsedInput.image) {
      const urls = await generatePresignedURL(crypto.randomUUID(), "avatars");
      imageUrl = urls.imageUrl;
      presignedUrl = urls.presignedUrl;
    }

    console.log({ parsedInput });
    const [newUser] = await db
      .insert(users)
      .values({
        name: parsedInput.name,
        email: parsedInput.email,
        image: imageUrl,
        scheduleId: parsedInput.scheduleId,
      })
      .returning({ id: users.id });

    if (!newUser)
      throw new ActionError("Something went wrong. Please try again");

    revalidatePath("/admin/users");
    return {
      message: "User created successfully",
      data: { id: newUser.id, uploadUrl: presignedUrl },
    };
  });

export const deleteUser = actionClient
  .schema(z.string().min(0))
  .action(async ({ parsedInput }) => {
    await validateAdminSession();
    const existingUser = await userExists(parsedInput);
    const deleteAvatar = deleteUserAvatar(existingUser);
    const deleteUser = db.delete(users).where(eq(users.id, parsedInput));
    await Promise.all([deleteUser, deleteAvatar]);
    revalidatePath("/admin/users");
    return { message: "User deleted succesfully" };
  });

export const deleteUsers = actionClient
  .schema(z.array(z.string()))
  .action(async ({ parsedInput }) => {
    await validateAdminSession();
    const deletedUsers = await db
      .delete(users)
      .where(inArray(users.id, parsedInput));
    if (!deletedUsers) throw new ActionError("Users not found");
    revalidatePath("/admin/users");
    return { message: "Users deleted successfully" };
  });

export const updateUser = actionClient
  .schema(userSchema)
  .action(async ({ parsedInput }) => {
    await validateAdminSession();
    if (!parsedInput.id) throw new ActionError("User ID is required");
    const existingUser = await userExists(parsedInput.id);
    if (
      parsedInput.email === existingUser.email &&
      parsedInput.name === existingUser.name &&
      parsedInput.scheduleId === existingUser.scheduleId &&
      !parsedInput.image
    )
      throw new ActionError("No changes detected");
    let imageUrl;
    let presignedUrl;
    if (parsedInput.image) {
      const promises = [
        generatePresignedURL(crypto.randomUUID(), "avatars"),
        deleteUserAvatar(existingUser),
      ];
      const [urls] = await Promise.all(promises);
      imageUrl = urls?.imageUrl;
      presignedUrl = urls?.presignedUrl;
    }

    await db
      .update(users)
      .set({
        name: parsedInput.name,
        email: parsedInput.email,
        image: imageUrl ?? existingUser.image,
        scheduleId: parsedInput.scheduleId,
      })
      .where(eq(users.id, parsedInput.id))
      .returning({ id: users.id });
    revalidatePath("/admin/users");
    return {
      message: "User updated succesfully",
      data: { id: parsedInput.id, uploadUrl: presignedUrl },
    };
  });

async function deleteUserAvatar(user: z.infer<typeof selectUserSchema>) {
  if (user.image) {
    await minioClient.removeObject("avatars", user.image.split("/").pop()!);
  }
}

export async function validateAdminSession() {
  const session = await auth();
  if (!session || !isAdmin(session.user)) throw new ActionError("Unauthorized");
}

export async function validateUserSession() {
  const session = await auth();
  if (!session) throw new ActionError("Unauthorized");
  return session.user.id;
}

async function userExists(userId: string) {
  const userExists = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!userExists) throw new ActionError("User doesn't exist");
  return userExists;
}
