import { getTodaysClockings } from "@/server/actions/clockings";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function UserTodayClockingsList() {
  const session = await auth();
  if (!session) redirect("/");
  const data = await getTodaysClockings();
  const clockings = data?.data;
  return (
    <>
      {clockings && clockings.length < 1 ? (
        <p className="text-center text-sm">Aún no has fichado</p>
      ) : (
        <Table>
          <TableCaption>Una lista de tus fichajes de hoy.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Hora de entrada</TableHead>
              <TableHead>Hora de salida</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clockings?.map((clocking) => (
              <TableRow key={clocking.id}>
                <TableCell className="text-center">
                  {format(new Date(clocking.clockIn), "HH:mm")}
                </TableCell>
                <TableCell className="text-center">
                  {clocking.clockOut
                    ? format(new Date(clocking.clockOut), "HH:mm")
                    : "---"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
