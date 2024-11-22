import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDialog } from "@/hooks/use-dialog";
import { deleteClocking } from "@/server/actions/clockings";
import { Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

type Props = {};
export default function DeleteClockingForm({
  clockingId,
}: {
  clockingId: number;
}) {
  const { toggleModal } = useDialog();
  const { executeAsync, isPending } = useAction(deleteClocking);

  async function handleClick() {
    const result = await executeAsync(clockingId);
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
          Delete clocking
        </>
      )}
    </Button>
  );
}
