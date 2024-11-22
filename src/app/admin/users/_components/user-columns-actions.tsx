import { Edit, Trash } from "lucide-react";
import EditUserForm from "./edit-user-form";
import DeleteUserForm from "./delete-user-form";
import ModalTrigger from "@/components/modal-trigger";
import CreateUserForm from "./create-user-form";

type Props = {
  userId: string;
};
export default function UserColumnsActions({ userId }: Props) {
  return (
    <div className="flex gap-2">
      <ModalTrigger
        trigger={<Edit />}
        title="Edit User"
        description="Edit User"
      >
        <CreateUserForm userId={userId} />
      </ModalTrigger>
      <ModalTrigger
        trigger={<Trash />}
        title="Delete User"
        description="Delete User"
      >
        <DeleteUserForm userId={userId} />
      </ModalTrigger>
    </div>
  );
}
