import {
  ArrowRightIcon,
  CaseLowerIcon,
  Clock3Icon,
  CodeIcon,
  KeyboardIcon,
  TargetIcon,
} from "lucide-react";
import { buttonVariants } from "../ui/button";
import { GameModuleRequest } from "@/stores/game-module";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { TooltipMain } from "../tooltip-main";
import { useModuleCalculator } from "@/hooks/use-module-calculator";

export function ModuleListMinimal(
  props: GameModuleRequest & { route?: string; className?: string },
) {
  const { title, id, shortDesc, route = "", className = "" } = props;
  return (
    <div
      className={cn(
        "grid grid-cols-2 border border-border rounded-md p-4 border-l-8 border-l-accent",
        className,
      )}
    >
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

export function ModuleList(
  props: GameModuleRequest & {
    route?: string;
    additionalText?: React.ReactNode;
  },
) {
  const { title, id, shortDesc, route = "", additionalText } = props;
  const info = useModuleCalculator(props);
  const lengthInfo =
    info.codeLengthMin === info.codeLengthMax
      ? `${info.codeLengthMin}`
      : `${info.codeLengthMin} - ${info.codeLengthMax}`;
  return (
    <Link to={`${route}${id}`} className="flex border rounded-md group ">
      <div className="group-hover:bg-muted/20 bg-muted/40 flex items-center h-full justify-end px-4 text-lg font-bold text-muted">
        {additionalText}
      </div>
      <div className="grid w-full rounded-lg p-4 bg-muted/30 group-hover:bg-muted/5">
        <div className="text-lg font-bold truncate w-full ">{title}</div>
        <div className="text-base text-muted-foreground truncate">
          {shortDesc}
        </div>

        <div className="text-sm text-muted-foreground flex h-8 items-center gap-4">
          <TooltipMain tooltip="Keystrokes SS">
            <span className="hidden items-center group-hover:flex">
              <span className="font-black italic">SS</span>
              <KeyboardIcon height={12} width={12} className="mx-2" />

              <span>{info.ssKeystroke}</span>
            </span>
          </TooltipMain>
          <TooltipMain tooltip="Time SS">
            <span className="hidden items-center group-hover:flex">
              <span className="font-black italic">SS</span>
              <Clock3Icon height={12} width={12} className="mx-2" />

              <span>{info.ssTime}</span>
            </span>
          </TooltipMain>
        </div>

        <div className="text-sm text-foreground flex items-center gap-4">
          <TooltipMain tooltip={`Language`}>
            <span className="flex rounded-md border border-foreground px-2 items-center">
              <CodeIcon height={12} width={12} className="mr-2" />
              {info.lang}
            </span>
          </TooltipMain>
          <TooltipMain tooltip={`Actions`}>
            <span className="flex rounded-md border border-foreground px-2 items-center">
              <TargetIcon height={12} width={12} className="mr-2" />
              {props.actions.length}
            </span>
          </TooltipMain>
          <TooltipMain tooltip={`Code length`}>
            <span className="flex rounded-md border border-foreground px-2 items-center">
              <CaseLowerIcon height={12} width={12} className="mr-2" />
              {lengthInfo}
            </span>
          </TooltipMain>
        </div>
      </div>
    </Link>
  );
}
