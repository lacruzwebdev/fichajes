import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./_components/admin-sidebar";
import AdminNavbar from "./_components/admin-navbar";
import { Modal } from "@/components/modal";

export default async function AdminLayout({
  children,
  modal,
}: {
  modal: React.ReactNode;
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect("/");
  }
  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <header>
          <AdminNavbar user={session.user} />
        </header>
        <main className="p-4 sm:px-6">
          {modal}
          {children}
        </main>
      </div>
      <Toaster />
      <Modal />
    </SidebarProvider>
  );
}
