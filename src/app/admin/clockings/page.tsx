import { DataTable } from "@/components/data-table";
import { getClockings } from "@/server/actions/clockings";
import { columns } from "./_components/clocking-columns";

export default async function ClockingsPage() {
  const data = await getClockings();
  const clockings = data?.data ?? [];
  console.log(clockings[0]);
  return (
    <div className="max-w-9xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="py-2 text-2xl font-bold text-gray-800 md:text-3xl">
          Clockings
        </h1>
      </div>
      <DataTable
        type="clockings"
        columns={columns}
        data={clockings.map((clock) => ({
          ...clock,
          user: {
            ...clock.user,
            schedules: clock.user.schedules || { schedulesDays: [] },
          },
        }))}
      />
    </div>
  );
}
