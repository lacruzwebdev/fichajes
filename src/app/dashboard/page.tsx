import { hasOpenedClocking } from "@/server/actions/clockings";
import AddClockingForm from "./_components/add-clocking-form";
import UserTodayClockingList from "./_components/user-today-clockings-list";
import Clock from "@/components/clock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const openedClocking = await hasOpenedClocking();
  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader className="space-y-2 text-center">
        <Clock />
        <CardTitle className="mb-8 text-center text-2xl font-bold">
          <h1>Tus fichajes de hoy</h1>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid space-y-6">
        <UserTodayClockingList />
        <AddClockingForm openedClocking={openedClocking?.data ?? false} />
      </CardContent>
    </Card>
  );
}
