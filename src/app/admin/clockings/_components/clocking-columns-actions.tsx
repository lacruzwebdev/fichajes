import { Edit, Trash } from "lucide-react";
import ModalTrigger from "@/components/modal-trigger";
import EditClockingForm from "./edit-clocking-form";
import DeleteClockingForm from "./delete-clocking-form";
import { clockingSchema } from "@/zod-schema/schema";
import { z } from "zod";

type Props = {
  clocking: z.infer<typeof clockingSchema>;
};
export default function ClockingColumnsActions({ clocking }: Props) {
  return (
    <div className="flex gap-2">
      <ModalTrigger
        trigger={<Edit />}
        title="Edit Clocking"
        description="Edit Clocking"
      >
        <EditClockingForm clocking={clocking} />
      </ModalTrigger>
      <ModalTrigger
        trigger={<Trash />}
        title="Delete Clocking"
        description="Are you sure?"
      >
        <DeleteClockingForm clockingId={clocking.id} />
      </ModalTrigger>
    </div>
  );
}
