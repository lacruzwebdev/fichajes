import { useForm } from "react-hook-form";
import { useDialog } from "./use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { type scheduleSchema, userSchema } from "@/zod-schema/schema";
import { useAction } from "next-safe-action/hooks";
import { createUser, getUser, updateUser } from "@/server/actions/users";
import { toast } from "sonner";
import { getS3URL, uploadFile } from "@/lib/utils";
import { useEffect, useState } from "react";
import { type z } from "zod";
import { getSchedules } from "@/server/actions/schedules";

export default function useUserForm(userId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState<{ id: number; name: string }[]>();
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const { toggleModal } = useDialog();
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      image: false,
      imageFile: undefined,
      scheduleId: "",
    },
  });
  const { handleSubmit } = form;

  const serverAction = userId ? updateUser : createUser;
  const { executeAsync } = useAction(serverAction);

  useEffect(() => {
    async function fetchSchedules() {
      const schedules = await getSchedules();
      if (!schedules?.data) return;
      setSchedules(schedules.data);
    }
    fetchSchedules().catch(console.error);
  }, []);

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
          scheduleId: data?.scheduleId?.toString(),
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
      scheduleId: !!form.getValues("scheduleId")
        ? Number(form.getValues("scheduleId"))
        : undefined,
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

  return { form, handleSubmit, onSubmit, isLoading, avatar, schedules };
}
