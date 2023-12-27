import { cn } from "@/lib/utils";

type DividerProps = React.HTMLAttributes<HTMLDivElement>;
export function Divider({ children, className, ...other }: DividerProps) {
  return (
    <div className={cn("flex items-center", className)} {...other}>
      <hr className="flex-grow border-t border-muted" />
      <span className="px-3 text-muted">{children}</span>
      <hr className="flex-grow border-t border-muted" />
    </div>
  );
}
