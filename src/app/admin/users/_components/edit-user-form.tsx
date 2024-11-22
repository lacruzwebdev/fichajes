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
import { useDialog } from "@/hooks/use-dialog";
import { getS3URL, uploadFile } from "@/lib/utils";
import { createUser, getUser } from "@/server/actions/users";
import { createUserSchema, type editUserSchema } from "@/zod-schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type z } from "zod";

export default function EditUserForm({ userId }: { userId: string }) {
  const { toggleModal } = useDialog();
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] =
    useState<z.infer<typeof editUserSchema>>();

  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(createUser, zodResolver(createUserSchema), {
      actionProps: {
        onExecute: () => {
          // console.log(fileRef.current);
        },
        onSuccess: ({ data }) => {
          if (!data) return;
          const avatarFile = form.getValues("imageFile");
          if (data?.message) {
            toast.success(data.message);
          }
          if (avatarFile) {
            uploadFile(avatarFile, data.data.uploadUrl).catch((e) => {
              throw e;
            });
          }
          toggleModal();
          resetFormAndAction();
        },
        onError: ({ error }) => {
          toast.error(error.serverError);
        },
      },
      formProps: {
        defaultValues: {
          name: defaultValues?.name ?? "",
          email: defaultValues?.email ?? "",
          imageUrl: defaultValues?.imageUrl ?? "",
        },
        mode: "onBlur",
      },
    });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const user = await getUser(userId);
      if (user) {
        setDefaultValues({
          id: user.data?.id ?? "",
          name: user.data?.name ?? "",
          email: user.data?.email ?? "",
          imageUrl: user.data?.image ?? "",
        });
        form.reset({
          name: user.data?.name ?? "",
          email: user.data?.email ?? "",
          imageUrl: user.data?.image ?? "",
        });
      }
    })()
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setIsLoading(false));
  }, [userId, form]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmitWithAction}>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <AvatarUploader
                        defaultImg={getS3URL(defaultValues?.imageUrl ?? "")}
                        {...field}
                        maxSize={4 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
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
              Update User
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
