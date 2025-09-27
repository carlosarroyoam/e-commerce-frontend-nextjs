"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import axios from "@/lib/axios";
import { getDevicefingerprint } from "@/lib/device-fingerprint";

const logOutFn = async () => {
  const deviceFingerprint = getDevicefingerprint();

  await axios.post("/auth/logout", {
    device_fingerprint: deviceFingerprint,
  });
};

const UserNav = () => {
  const router = useRouter();
  const { session, destroySession } = useAuth();
  const { mutate: logOut } = useMutation({
    mutationFn: logOutFn,
    onSuccess: () => {
      destroySession();
      router.push("/auth/login");
      router.refresh();
    },
  });

  if (!session.isAuth) return <Skeleton className="size-10 rounded-full" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-10 rounded-full">
          <Avatar className="size-10">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${session.first_name}%20${session.last_name}&format=svg&background=d4d4d8`}
              alt={`${session.first_name}'s profile picture`}
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2.5">
        <DropdownMenuLabel>
          <p className="text-sm leading-none">
            {session.first_name}&nbsp;{session.last_name}
          </p>
          <p className="mt-1 text-sm font-normal leading-none text-muted-foreground">
            {session.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Account</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={() => logOut()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
