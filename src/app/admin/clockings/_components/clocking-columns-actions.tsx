import { Edit, Trash } from "lucide-react";
import ModalTrigger from "@/components/modal-trigger";
import EditClockingForm from "./edit-clocking-form";
import DeleteClockingForm from "./delete-clocking-form";
import { type clockingSchema } from "@/zod-schema/schema";
import { type z } from "zod";

type Props = {
  clocking: z.infer<typeof clockingSchema>;
};
export default function ClockingColumnsActions({ clocking }: Props) {
  return (
    <div className="flex gap-2">
      <ModalTrigger
        trigger={<Edit size={18} />}
        title="Edit Clocking"
        description="Edit Clocking"
      >
        <EditClockingForm clocking={clocking} />
      </ModalTrigger>
      <ModalTrigger
        trigger={<Trash size={18} />}
        title="Delete Clocking"
        description="Are you sure?"
      >
        <DeleteClockingForm clockingId={clocking.id} />
      </ModalTrigger>
    </div>
  );
}
