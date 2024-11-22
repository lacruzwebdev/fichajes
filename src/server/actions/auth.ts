"use server";

import { signIn } from "../auth";
import { AuthError } from "next-auth";
import { actionClient } from "@/lib/safe-action";
import { loginSchema } from "@/zod-schema/schema";

export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email } }): Promise<ActionResponse> => {
    try {
      await signIn("nodemailer", {
        redirect: false,
        email,
      });
      return { message: "Check your email to login" };
    } catch (e) {
      if (e instanceof AuthError && e.type === "AccessDenied") {
        return { error: "Unauthorized" };
      }
      console.error(e);
      return { error: "Something went wrong" };
    }
  });
