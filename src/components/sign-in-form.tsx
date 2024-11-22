"use client";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { loginAction } from "@/server/actions/auth";
import { loginSchema } from "@/zod-schema/schema";
import Alert from "./ui/alert";

export default function SignInForm() {
  const { executeAsync, result } = useAction(loginAction);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    const res = await executeAsync(data);
    console.log(res);
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <Form {...form}>
        <form
          className="w-full space-y-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Form>
      {/* Warning */}
      {result.data && (
        <Alert
          type={"error" in result.data ? "error" : "success"}
          message={
            "error" in result.data ? result.data.error : result.data.message
          }
        />
      )}
    </div>
  );
}
