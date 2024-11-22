"use client";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDialog } from "@/hooks/use-dialog";
import { deleteUser } from "@/server/actions/users";
import { Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

type Props = {
  userId: string;
};
export default function DeleteUserForm({ userId }: Props) {
  const { toggleModal } = useDialog();
  const { executeAsync, isPending } = useAction(deleteUser);
  async function handleClick() {
    const result = await executeAsync(userId);
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
          Delete account
        </>
      )}
    </Button>
  );
}
