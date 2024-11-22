import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { deleteClockings } from "@/server/actions/clockings";
import { clockingSchema } from "@/zod-schema/schema";
import { Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { z } from "zod";

type Props = {
  clockings: z.infer<typeof clockingSchema>[];
  setRowSelection: ({}) => void;
};
export default function DeleteBulkClockings({
  clockings,
  setRowSelection,
}: Props) {
  const clockingsIds = clockings.map((clocking) => clocking.id);
  const { executeAsync, isPending } = useAction(deleteClockings);
  return (
    <Button
      size="sm"
      variant="destructive"
      className="mt-2"
      disabled={isPending}
      onClick={async () => {
        await executeAsync(clockingsIds);
        setRowSelection({});
      }}
    >
      {isPending ? (
        <>
          <Spinner />
          Deleting...
        </>
      ) : (
        <>
          <Trash />
          Delete in bulk
        </>
      )}
    </Button>
  );
}
