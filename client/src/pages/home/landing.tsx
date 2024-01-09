import { Spinner } from "@/components/loading";
import { ModuleList, ModuleListMinimal } from "@/components/module/module-list";
import { TooltipMain } from "@/components/tooltip-main";
import { Button, buttonVariants } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import {
  GameCollectionRequest,
  GameModuleRequest,
  GetManyRequest,
} from "@/stores/game-module";
import { ArrowRightIcon } from "lucide-react";
import { Fragment } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const { data, isLoading, refetch } = useApi<
    GetManyRequest<GameCollectionRequest>
  >("learns", {
    params: {
      size: 1,
    },
  });
  const { data: game, isLoading: gameLoading } = useApi<
    GetManyRequest<GameModuleRequest>
  >("games", {
    params: {
      size: 4,
    },
  });

  if (gameLoading || !game) {
    return <Spinner />;
  }

  if (!data || isLoading) {
    return <Spinner />;
  }
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
          <Link
            to={"/learn"}
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-lg flex gap-2 items-center text-foreground",
            )}
          >
            Explore more <ArrowRightIcon height={"18px"} width={"18px"} />
          </Link>
        </div>
        <div className="border-b py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.rows.map((collection) => {
            return (
              <Fragment key={collection.id}>
                {collection.Games.map((game) => (
                  <ModuleListMinimal
                    key={game.id}
                    {...game}
                    route="/modules/"
                  />
                ))}
              </Fragment>
            );
          })}
        </div>

        <div className="flex mt-4 justify-between items-center py-2">
          <div className="text-xl font-semibold">Challenge Yourself</div>
          <Button
            className="text-lg flex gap-2 items-center text-foreground"
            variant={"link"}
          >
            Explore more <ArrowRightIcon height={"18px"} width={"18px"} />
          </Button>
        </div>
        <div className="border-b py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {game.rows &&
            game.rows.map((mod) => (
              <ModuleList {...mod} key={mod.id} route="/modules/" />
            ))}
        </div>
      </div>
    </Fragment>
  );
}
