"use client";
import { type User } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut } from "lucide-react";
import { getS3URL, isAdmin } from "@/lib/utils";

export default function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  const profileLink = isAdmin(user) ? "/dashboard/profile" : "/admin/profile";
  return (
    <Popover open={open} onOpenChange={() => setOpen(!open)}>
      <PopoverTrigger className="flex items-center gap-4">
        <Avatar>
          {user.image && <AvatarImage src={getS3URL(user.image)} />}
          <AvatarFallback>
            {user.name?.substring(0, 2).toUpperCase() ?? "US"}
          </AvatarFallback>
        </Avatar>
        <div className="flex gap-1">
          <p className="text-sm">{user.name}</p>
          <ChevronDown
            className={`w-4 opacity-50 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="border-b border-gray-200 p-4">
          <p>{user.name}</p>
          <p className="text-sm font-light italic">
            {isAdmin(user) ? "Administrator" : "Employee"}
          </p>
        </div>
        <div className="flex flex-col gap-4 p-4">
          {/* <Link
            href={profileLink}
            className="text-sm text-primary"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link> */}
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 text-sm text-primary"
          >
            <LogOut size={16} />
            Sign Out
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
