import { ArrowRightIcon } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { GameModuleRequest } from "@/stores/game-module";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function ModuleListMinimal(
  props: GameModuleRequest & { route?: string },
) {
  const { title, id, shortDesc, route = "" } = props;
  return (
    <div className="grid grid-cols-2 border border-border rounded-md p-4 border-l-8 border-l-accent">
      <div>
        <div className="text-lg font-bold">{title}</div>
        <div className="text-base text-muted-foreground">{shortDesc}</div>
      </div>
      <div className="flex items-center h-full justify-end">
        <Link
          to={`${route}${id}`}
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
        >
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  );
}
