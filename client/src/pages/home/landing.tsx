import { TooltipMain } from "@/components/tooltip-main";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  CalendarIcon,
  Code2Icon,
  PlayCircleIcon,
  StarIcon,
} from "lucide-react";
import { Fragment } from "react";

function ModuleListMinimal() {
  return (
    <div className="grid grid-cols-2 border border-border rounded-md p-4 border-l-8 border-l-accent">
      <div>
        <div className="text-lg font-bold">title</div>
        <div className="text-base text-muted-foreground">
          Learn how the basic of horizontal and vertical movements in vim.
        </div>
      </div>
      <div className="flex items-center h-full justify-end">
        <Button variant={"outline"} size={"icon"} className="rounded-full">
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}

function ModuleList() {
  return (
    <div className="flex border rounded-md group ">
      <div className="group-hover:bg-muted/20 bg-muted/40 flex items-center h-full justify-end px-4 text-lg font-bold text-muted">
        #1
      </div>
      <div className="grid rounded-lg p-4 bg-muted/30 group-hover:bg-muted/5">
        <div className="text-lg font-bold truncate w-full ">
          Really long text that should have not appear bla bla bla super super
          super longggggggggggggg
        </div>
        <div className="text-base text-muted-foreground">
          by{" "}
          <span className="text-accent hover:underline cursor-pointer">
            some user
          </span>
        </div>

        <div className="text-sm text-muted-foreground flex h-8 items-center gap-4">
          <TooltipMain tooltip="Favorites: 99">
            <span className="hidden items-center group-hover:flex">
              <StarIcon height={12} width={12} className="mr-2" /> 99
            </span>
          </TooltipMain>
          <TooltipMain tooltip="Play count: 99">
            <span className="hidden items-center group-hover:flex">
              <PlayCircleIcon height={12} width={12} className="mr-2" /> 99
            </span>
          </TooltipMain>

          <TooltipMain tooltip="Added: 99">
            <span className="hidden items-center group-hover:flex">
              <CalendarIcon height={12} width={12} className="mr-2" /> 19 Dec
              2024
            </span>
          </TooltipMain>
        </div>

        <div className="text-sm text-foreground flex items-center gap-4">
          <TooltipMain tooltip="Difficulty rating: 99">
            <span className="flex rounded-md border border-foreground px-2 items-center">
              <Code2Icon height={12} width={12} className="mr-2" />
              0.2
            </span>
          </TooltipMain>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Fragment>
      <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-b from-black/20 via-background to-black/10">
        <div className="max-w-[50rem] flex flex-col items-center text-center">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            vi-word.
          </h2>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Learn Vim the <span className="text-primary/80">fun way</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            vi-word is a gamified Vim learning environment for interactive and
            fun experience, it helps you to track your editing performances and
            compare it with other.
          </p>
        </div>
      </div>
      <div className="py-8 px-4">
        <div className="flex justify-between items-center py-2">
          <div className="text-xl font-semibold">Start from the basics</div>
          <Button
            className="text-lg flex gap-2 items-center text-foreground"
            variant={"link"}
          >
            Explore more <ArrowRightIcon height={"18px"} width={"18px"} />
          </Button>
        </div>
        <div className="border-b py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ModuleListMinimal />
          <ModuleListMinimal />
          <ModuleListMinimal />
          <ModuleListMinimal />
        </div>

        <div className="flex mt-4 justify-between items-center py-2">
          <div className="text-xl font-semibold">Most Played</div>
          <Button
            className="text-lg flex gap-2 items-center text-foreground"
            variant={"link"}
          >
            Explore more <ArrowRightIcon height={"18px"} width={"18px"} />
          </Button>
        </div>
        <div className="border-b py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ModuleList />
          <ModuleList />
          <ModuleList />
          <ModuleList />
        </div>
      </div>
    </Fragment>
  );
}
