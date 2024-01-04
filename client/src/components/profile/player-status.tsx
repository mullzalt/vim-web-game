import { calculateLevel } from "@/lib/level-system";
import { Progress } from "../ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

export function LevelBar({
  exp = 0,
  className,
}: {
  exp: number;
  className?: string;
}) {
  const { level, exp: current_exp, required_exp } = calculateLevel(exp);

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="font-bold">Level {level}</div>
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Progress
                value={Math.floor((current_exp / required_exp) * 100)}
                max={100}
              />
            </TooltipTrigger>
            <TooltipContent>
              To next level: {current_exp}/{required_exp}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export function PlayerStatus() {
  const { level, exp, required_exp } = calculateLevel(3543);
  return (
    <div className="flex flex-col gap-2 border p-2 border-border rounded-md text-sm">
      <div>
        Level: {level} - {exp}/{required_exp}
      </div>
      <div>Grade</div>
      <div>Total Score:</div>
    </div>
  );
}
