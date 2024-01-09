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
import { Button, buttonVariants } from "../ui/button";
import {
  CogIcon,
  Edit2Icon,
  InfoIcon,
  LogOutIcon,
  MailIcon,
  SaveIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import { LevelBar, PlayerStatus } from "../profile/player-status";
import { Input } from "../ui/input";
import { useApiCallback } from "@/hooks/use-api";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function UserAvatar() {
  const [isEditting, setIsEditting] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { user, signOut, refetch } = useAuth();
  const [update, { isLoading, isError, error, isSuccess }] =
    useApiCallback("me");

  if (!user) return <div>loading...</div>;

  const handleSave = React.useCallback(() => {
    const username = inputRef.current?.value;

    if (!username || username === user.Profile.username) {
      setIsEditting(false);
      return;
    }

    update({
      method: "put",
      data: {
        username: username.trim(),
      },
    });
  }, []);

  React.useEffect(() => {
    inputRef.current?.focus();
    return () => {};
  }, [isError]);

  React.useEffect(() => {
    setIsEditting(false);
    refetch();
    return () => {};
  }, [isSuccess]);

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
          <div className="flex flex-col gap-2 ">
            {isEditting ? (
              <div className="flex flex-col gap-2">
                <Input
                  ref={inputRef}
                  autoFocus
                  defaultValue={user.Profile.username}
                />
                {error && (
                  <div className="text-destructive text-sm">{error}</div>
                )}
              </div>
            ) : (
              <div className="text-xl font-semibold">
                {user.Profile.username}
              </div>
            )}
            <div className="text-sm text-muted">{user.email}</div>
          </div>
          <div className="my-2 border-y py-2">
            <LevelBar exp={user.Profile.exp} />
          </div>
        </SheetHeader>
        <div className="grid gap-2 my-4">
          {isEditting ? (
            <div className="grid grid-cols-4 gap-4">
              <Button
                className="justify-center text-base gap-2 col-span-3"
                variant={"secondary"}
                onClick={handleSave}
                disabled={isLoading}
              >
                <SaveIcon className="w-4 h-4" /> <span>Save</span>
              </Button>

              <Button
                className="text-base gap-2 hover:bg-destructive hover:text-destructive-foreground"
                variant={"ghost"}
                onClick={() => setIsEditting(false)}
              >
                <span>Cancel</span>
              </Button>
            </div>
          ) : (
            <Button
              className="justify-start text-base gap-2"
              variant={"ghost"}
              onClick={() => setIsEditting(true)}
            >
              <Edit2Icon className="w-4 h-4" /> <span>Edit Profile</span>
            </Button>
          )}
          <Button
            onClick={signOut}
            className="justify-start text-base gap-2"
            variant={"ghost"}
          >
            <LogOutIcon className="w-4 h-4" /> <span>Sign out</span>
          </Button>
        </div>
        <div className="grid gap-2 py-4 border-y border-border">
          <Link target="_blank" to={import.meta.env.VITE_FEEDBACK_URL}  className={cn(buttonVariants({variant: "ghost"}),"justify-start text-base gap-2" )}>
            <StarIcon className="w-4 h-4" /> <span>Leave a feedback</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
