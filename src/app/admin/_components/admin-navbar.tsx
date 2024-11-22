import { SidebarTrigger } from "@/components/ui/sidebar";
import UserMenu from "@/components/user-menu";
import type { User } from "next-auth";

export default function AdminNavbar({ user }: { user: User }) {
  return (
    <header
      className={`sticky top-0 z-30 border-gray-200 before:absolute before:inset-0 before:-z-10 before:backdrop-blur-md max-lg:before:bg-white/90 dark:max-lg:before:bg-gray-800/90 md:border-b`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className={`flex h-16 items-center justify-between`}>
          {/* Header: Left side */}
          <div className="flex">
            <SidebarTrigger />
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            {/* <Notifications align="right" /> */}
            {/*  Divider */}
            <hr className="h-6 w-px border-none bg-gray-200 dark:bg-gray-700/60" />
            <UserMenu user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
