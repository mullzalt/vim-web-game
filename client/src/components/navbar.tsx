import { useAuth } from "@/providers/auth-provider";
import { SignInAction } from "./auth/sign-in";
import { Avatar } from "./ui/avatar";
import { UserAvatar } from "./auth/user-avatar";

export function Navbar() {
  const { user } = useAuth();
  return (
    <nav className="w-full sticky top-0 h-16 bg-background/80 flex items-center px-4 justify-between">
      <div className="grow">vi-word.</div>
      <div className="flex gap-2 items-center">
        {!user && <SignInAction />}
        {user ? <UserAvatar /> : "not loggen in"}
      </div>
    </nav>
  );
}
