"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { deleteUsers } from "@/server/actions/users";
import { selectUserSchema } from "@/zod-schema/schema";
import { Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { z } from "zod";

type Props = {
  users: z.infer<typeof selectUserSchema>[];
  setRowSelection: ({}) => void;
};
export default function DeleteBulkUsers({ users, setRowSelection }: Props) {
  const { executeAsync, isPending } = useAction(deleteUsers);
  const usersIds = users.map((user) => user.id);
  return (
    <Button
      disabled={isPending}
      size="sm"
      variant="destructive"
      className="mt-2"
      onClick={async () => {
        await executeAsync(usersIds);
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
