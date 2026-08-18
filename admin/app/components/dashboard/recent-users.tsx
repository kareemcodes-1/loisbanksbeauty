"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UsersIcon } from "lucide-react";
import type { User } from "@/types";

interface RecentUsersProps {
  users: User[];
}

function getInitials(name?: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function RecentUsers({ users }: RecentUsersProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Users</CardTitle>
          <p className="text-sm text-muted-foreground">
            Recently registered customers
          </p>
        </div>

        <UsersIcon className="size-5 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        {users.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
            No users yet.
          </div>
        ) : (
          <div className="space-y-5">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3"
              >
                <Avatar className="size-9">
                  <AvatarFallback>
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>

                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(user.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}