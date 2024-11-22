import { DataTable } from "@/components/data-table";
import { isAdmin } from "@/lib/utils";
import { getUsers } from "@/server/actions/users";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { columns } from "./_components/user-columns";
import ModalTrigger from "@/components/modal-trigger";
import CreateUserForm from "./_components/create-user-form";
import { Plus } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await auth();
  const isAuthorized = session && isAdmin(session.user);
  if (!session || !isAuthorized) {
    redirect("/");
  }

  const data = await getUsers();
  const users = data?.data ?? [];
  return (
    <div className="max-w-9xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
          Employees
        </h1>
        <ModalTrigger
          trigger={
            <Plus className="h-10 w-10 cursor-pointer rounded-full bg-primary p-1 text-white" />
          }
          title="Create User"
          description="Create User"
        >
          <CreateUserForm />
        </ModalTrigger>
      </div>
      <DataTable type="users" columns={columns} data={users} />
    </div>
  );
}
