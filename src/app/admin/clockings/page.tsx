import { DataTable } from "@/components/data-table";
import { getClockings } from "@/server/actions/clockings";
import { columns } from "./_components/clocking-columns";

export default async function ClockingsPage() {
  const data = await getClockings();
  const clockings = data?.data ?? [];
  return <DataTable type="clockings" columns={columns} data={clockings} />;
}
