import {
  createSchedule,
  getSchedule,
  updateSchedule,
} from "@/server/actions/schedules";
import { scheduleSchema } from "@/zod-schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { useDialog } from "./use-dialog";
import { toast } from "sonner";

export default function useScheduleForm(scheduleId?: number) {
  const serverAction = scheduleId ? updateSchedule : createSchedule;
  const { toggleModal } = useDialog();
  const [partida, setPartida] = useState(false);
  const form = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      name: "",
      days: Array.from({ length: 7 }, () => [
        {
          startTime: "",
          endTime: "",
        },
        {
          startTime: "",
          endTime: "",
        },
      ]),
    },
  });
  const { executeAsync, isPending } = useAction(serverAction, {
    onSuccess: ({ data }) => {
      toggleModal();
      if (data) {
        toast.success(data.message);
      }
    },
  });
  const { executeAsync: executeGetSchedule, isPending: isGetSchedulePending } =
    useAction(getSchedule);

  useEffect(() => {
    async function fetchSchedule() {
      if (!scheduleId) return;
      const schedule = await executeGetSchedule(scheduleId);
      if (!schedule?.data) return;
      const {
        data: { name, days },
      } = schedule;
      if (days.some((day) => !!day[1]?.startTime)) {
        setPartida(true);
      }
      form.reset({
        name,
        days,
      });
    }
    fetchSchedule().catch(console.error);
  }, [scheduleId, form, executeGetSchedule]);

  async function onSubmit(data: z.infer<typeof scheduleSchema>) {
    await executeAsync({ id: scheduleId, ...data });
  }

  function onCheckedChange(value: boolean) {
    form.getValues().days.map((field, index) => {
      form.setValue(`days.${index}.1`, { startTime: "", endTime: "" });
    });
    setPartida(value);
  }

  return {
    partida,
    form,
    isPending,
    isGetSchedulePending,
    onSubmit,
    onCheckedChange,
  };
}
