import * as React from "react";
import { useAuth } from "@/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import {
  CogIcon,
  Edit2Icon,
  InfoIcon,
  LogOutIcon,
  MailIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";

export function UserAvatar() {
  const { user, signOut } = useAuth();

  if (!user) return <div>loading...</div>;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Avatar className="hover:cursor-pointer hover:opacity-80">
          <AvatarImage
            src={user.Profile.photo}
            alt={`@${user.Profile.username}`}
          />
          <AvatarFallback>
            {user.Profile.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <Avatar className="h-16 w-16 border-2 border-foreground">
            <AvatarImage
              src={user.Profile.photo}
              alt={`@${user.Profile.username}`}
            />
            <AvatarFallback>
              {user.Profile.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col -space-y-1">
            <div className="text-xl font-semibold">{user.Profile.username}</div>
            <div className="text-sm text-muted">{user.email}</div>
          </div>
        </SheetHeader>
        <div className="grid gap-2 my-4">
          <Button className="justify-start text-base gap-2" variant={"ghost"}>
            <UserIcon className="w-4 h-4" /> <span>My Profile</span>
          </Button>
          <Button className="justify-start text-base gap-2" variant={"ghost"}>
            <Edit2Icon className="w-4 h-4" /> <span>Edit Profile</span>
          </Button>
          <Button className="justify-start text-base gap-2" variant={"ghost"}>
            <CogIcon className="w-4 h-4" /> <span>Settings</span>
          </Button>
          <Button
            onClick={signOut}
            className="justify-start text-base gap-2"
            variant={"ghost"}
          >
            <LogOutIcon className="w-4 h-4" /> <span>Sign out</span>
          </Button>
        </div>
        <div className="grid gap-2 py-4 border-y border-border">
          <Button className="justify-start text-base gap-2" variant={"ghost"}>
            <StarIcon className="w-4 h-4" /> <span>Leave a feedback</span>
          </Button>
          <Button className="justify-start text-base gap-2" variant={"ghost"}>
            <InfoIcon className="w-4 h-4" /> <span>About</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
