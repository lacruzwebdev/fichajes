import { Edit, Trash } from "lucide-react";
import ModalTrigger from "@/components/modal-trigger";
import CreateScheduleForm from "./create-schedule-form";
import DeleteScheduleForm from "./delete-schedule-form";

type Props = {
  scheduleId: number;
};
export default function SchedulesColumnsActions({ scheduleId }: Props) {
  return (
    <div className="flex gap-2">
      <ModalTrigger
        trigger={<Edit size={18} />}
        title="Edit Schedule"
        description="Edit Schedule"
      >
        <CreateScheduleForm scheduleId={scheduleId} />
      </ModalTrigger>
      <ModalTrigger
        trigger={<Trash size={18} />}
        title="Delete Schedule"
        description="Delete Schedule"
      >
        <DeleteScheduleForm scheduleId={scheduleId} />
      </ModalTrigger>
    </div>
  );
}
