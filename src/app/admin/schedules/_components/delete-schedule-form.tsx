"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDialog } from "@/hooks/use-dialog";
import { deleteSchedule } from "@/server/actions/schedules";
import { Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

type Props = {
  scheduleId: number;
};
export default function DeleteScheduleForm({ scheduleId }: Props) {
  const { toggleModal } = useDialog();
  const { executeAsync, isPending } = useAction(deleteSchedule);
  async function handleClick() {
    const result = await executeAsync(scheduleId);
    if (result?.serverError) {
      toast.error(result.serverError);
    }
    if (result?.data?.message) {
      toast.success(result.data.message);
      toggleModal();
    }
  }
  return (
    <Button
      type="submit"
      variant="destructive"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Spinner /> {"Deleting..."}
        </>
      ) : (
        <>
          <Trash />
          Delete Schedule
        </>
      )}
    </Button>
  );
}
