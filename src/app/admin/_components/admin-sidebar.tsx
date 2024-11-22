import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { isAdmin } from "@/lib/utils";
import { auth } from "@/server/auth";
import { Clock, User } from "lucide-react";
import Link from "next/link";

export default async function AdminSidebar() {
  const user = (await auth())?.user;

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/admin">Logo</Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {user && isAdmin(user) && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/admins">
                      <User />
                      Admins
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/users">
                    <User />
                    Users
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/clockings">
                    <Clock />
                    Clockings
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
