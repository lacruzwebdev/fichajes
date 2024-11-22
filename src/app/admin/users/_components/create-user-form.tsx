"use client";
import AvatarUploader from "@/components/avatar-uploader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import useUserForm from "@/hooks/use-user-form";

export default function CreateUserForm({ userId }: { userId?: string }) {
  const { form, handleSubmit, onSubmit, isLoading, avatar } =
    useUserForm(userId);
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <AvatarUploader defaultImg={avatar} maxSize={4 * 1024 * 1024} />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription>This is your public email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-8">
              {userId ? "Update User" : "Create User"}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}