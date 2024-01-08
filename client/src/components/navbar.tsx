import { useAuth } from "@/providers/auth-provider";
import { SignInAction } from "./auth/sign-in";
import { Avatar } from "./ui/avatar";
import { UserAvatar } from "./auth/user-avatar";
import { LevelBar } from "./profile/player-status";

export function Navbar({ action }: { action?: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <nav className="w-full z-50 backdrop-blur sticky top-0 h-16 bg-border/80 flex items-center px-4 justify-between">
      <div className="flex items-center">
        {action}
        <span>vi-word.</span>
      </div>
      <div className="flex gap-2 items-center">
        {user ? <UserAvatar /> : <SignInAction />}
      </div>
    </nav>
  );
}
