"use client";

import { useQuery } from "@tanstack/react-query";
import { PencilIcon, TrashIcon } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import { User, UsersResponse } from "@/types/user";

const getUsersFn = async () => {
  const {
    data: { users },
  } = await axios.get<UsersResponse>("/users");

  return users;
};

const UsersTable = () => {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await getUsersFn(),
  });

  if (isLoading)
    return (
      <>
        <Skeleton className="mt-6 h-96 w-full" />
      </>
    );

  if (error)
    return (
      <h2 className="text-2xl font-bold tracking-tight">{error.message}</h2>
    );

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-8">
              <span className="sr-only">Profile picture</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Registered at</TableHead>
            <TableHead>Updated at</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.length ? (
            users!.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className="size-8">
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${user.first_name}%20${user.last_name}&format=svg&background=d4d4d8`}
                      alt={`${user.first_name}'s profile picture`}
                    />
                  </Avatar>
                </TableCell>
                <TableCell>
                  {user.first_name}&nbsp;{user.last_name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.user_role.replace("App/", "")}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>{formatDate(user.updated_at)}</TableCell>
                <TableCell>
                  {user.deleted_at === null ? (
                    <Badge variant="secondary">Active</Badge>
                  ) : (
                    <Badge variant="destructive">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button variant={"secondary"} size={"icon"}>
                    <PencilIcon />
                  </Button>
                  <Button variant={"destructive"} size={"icon"}>
                    <TrashIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
