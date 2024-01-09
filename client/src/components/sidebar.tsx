import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import {
  BarChartHorizontalIcon,
  HomeIcon,
  KeyboardIcon,
  MessageSquareReply,
  ShieldHalfIcon,
  WalletCardsIcon,
  ZapIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label?: React.ReactNode;
  open?: boolean;
  className?: string;
  hidden?: boolean;
}

const items: SidebarItemProps[] = [
  {
    to: "/",
    icon: <HomeIcon width={"20px"} height={"20px"} />,
    label: "Home",
  },
  {
    to: "/learn",
    icon: <KeyboardIcon width={"20px"} height={"20px"} />,
    label: "Learn",
  },
  {
    to: "/modules",
    icon: <ZapIcon width={"20px"} height={"20px"} />,
    label: "Challenge",
  },
  // {
  //   to: "/test",
  //   icon: <StarIcon width={"20px"} height={"20px"} />,
  //   label: "Favorite",
  // },
  {
    to: "/leaderboard",
    icon: <BarChartHorizontalIcon width={"20px"} height={"20px"} />,
    label: "Leaderboard",
  },
];

const items_action: SidebarItemProps[] = [
  {
    to: "/sandbox",
    icon: <WalletCardsIcon width={"20px"} height={"20px"} />,
    label: "Sandbox",
  },
  {
    to: "/feedback",
    icon: <MessageSquareReply width={"20px"} height={"20px"} />,
    label: "Leave a Feedback",
  },
];

function SidebarItem({
  to,
  icon,
  label,
  className,
  open = false,
  hidden = false,
}: SidebarItemProps) {
  const { pathname } = useLocation();

  return (
    <Link
      to={to}
      className={cn(
        "flex transition-all h-10 items-center",
        "text-muted-foreground/80 hover:text-primary border-l-4 border-transparent",
        pathname === to &&
          "text-primary/80  pointer-events-none outline-primary/80 border-primary/80",
        className,
        hidden && "hidden",
      )}
    >
      <span className="ml-4">{icon}</span>
      <span className={cn(!open && "hidden", "ml-2 mr-4")}>{label}</span>
    </Link>
  );
}

export function Sidebar({
  className,
  mobileOpen = true,
}: {
  className?: string;
  mobileOpen?: boolean;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleMouseEnter = useCallback(() => setOpen(true), []);
  const handleMouseLeave = useCallback(() => setOpen(false), []);

  return (
    <aside
      className={cn(
        "fixed top-0 w-fit left-0 z-40 h-full transition-transform bg-background",
        className,
        !mobileOpen && "hidden",
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn("flex py-4 gap-2 h-full flex-col w-16 ", open && "w-fit")}
      >
        <ul>
          {items.map((item, i) => (
            <li key={i}>
              <SidebarItem {...item} open={open} />
            </li>
          ))}
        </ul>
        <ul className="border-t border-border">
          {items_action.map((item, i) => (
            <li key={i}>
              <SidebarItem {...item} open={open} />
            </li>
          ))}
        </ul>
        {user && user.role === "admin" ? (
          <ul className="border-t border-border">
            <li>
              <SidebarItem
                to="/admin/modules"
                icon={<ShieldHalfIcon width={"20px"} height={"20px"} />}
                open={open}
                label="Admin"
              />
            </li>
          </ul>
        ) : (
          ""
        )}
      </div>
    </aside>
  );
}
