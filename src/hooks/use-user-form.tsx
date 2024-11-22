import { useForm } from "react-hook-form";
import { useDialog } from "./use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/zod-schema/schema";
import { useAction } from "next-safe-action/hooks";
import { createUser, getUser, updateUser } from "@/server/actions/users";
import { toast } from "sonner";
import { getS3URL, uploadFile } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function useUserForm(userId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const { toggleModal } = useDialog();
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", image: false, imageFile: undefined },
  });
  const { handleSubmit } = form;

  const serverAction = userId ? updateUser : createUser;
  const { executeAsync } = useAction(serverAction);

  useEffect(() => {
    async function fetchUser() {
      if (!userId) return;
      setIsLoading(true);
      try {
        const user = await getUser(userId);
        if (!user) return;
        const { data } = user;
        if (data?.image) {
          setAvatar(getS3URL(data?.image));
        }
        form.reset({
          name: data?.name ?? "",
          email: data?.email,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser().catch(console.error);
  }, [userId, form]);

  async function onSubmit() {
    const file = form.getValues("imageFile");
    const result = await executeAsync({
      id: userId,
      name: form.getValues("name"),
      email: form.getValues("email"),
      image: form.getValues("image"),
    });
    if (!result) {
      toast.error("Something went wrong. Please try again");
    }
    if (result?.serverError) {
      toast.error(result.serverError);
    }
    if (result?.data?.message) {
      if (file && result.data.data.uploadUrl) {
        await uploadFile(file, result.data.data.uploadUrl);
      }
      toggleModal();
      form.reset();
      toast.success(result.data.message);
    }
  }

  return { form, handleSubmit, onSubmit, isLoading, avatar };
}
