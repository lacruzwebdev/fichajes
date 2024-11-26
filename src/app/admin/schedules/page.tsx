import { getSchedules } from "@/server/actions/schedules";
import CreateScheduleForm from "./_components/create-schedule-form";
import { DataTable } from "@/components/data-table";
import { columns } from "./_components/schedules-columns";
import ModalTrigger from "@/components/modal-trigger";
import { Plus } from "lucide-react";

export default async function SchedulesPage() {
  const data = await getSchedules();
  const schedules = data?.data ?? [];
  return (
    <div className="max-w-9xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="py-2 text-2xl font-bold text-gray-800 md:text-3xl">
          Schedules
        </h1>
        <ModalTrigger
          trigger={
            <Plus className="h-10 w-10 cursor-pointer rounded-full bg-primary p-1 text-white" />
          }
          title="Create User"
          description="Create User"
        >
          <CreateScheduleForm />
        </ModalTrigger>
      </div>
      <DataTable type="users" columns={columns} data={schedules} />
    </div>
  );
}
