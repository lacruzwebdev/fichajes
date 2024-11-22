import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import DashboardNavbar from "./_components/dashboard-navbar";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (session?.user.role !== "employee") {
    redirect("/");
  }
  return (
    <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <header>
        <DashboardNavbar user={session.user} />
      </header>
      <main className="grid min-h-[93dvh] place-items-center p-4 sm:px-6">
        {children}
      </main>
    </div>
  );
}
