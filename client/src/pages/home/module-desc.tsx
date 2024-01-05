import { Spinner } from "@/components/loading";
import { GameEditor } from "@/components/module/game-editor";
import { Button } from "@/components/ui/button";
import { MarkDownReader } from "@/components/ui/markdown";
import { useApi } from "@/hooks/use-api";
import { GameModuleRequest } from "@/stores/game-module";
import { Fragment, useCallback, useState } from "react";
import { useParams } from "react-router-dom";

export function ModuleDescPage() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useApi<GameModuleRequest>(
    `games/${id}`,
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handleQuit = useCallback(() => setIsPlaying(false), []);

  if (!data || isLoading) return <Spinner />;
  return (
    <Fragment>
      {!isPlaying && (
        <Fragment>
          <div className="grid lg:grid-cols-3 container py-8 ">
            <div className="grid col-span-2 gap-4">
              <h2 className="text-2xl font-bold tracking-tight">
                {data.title}
              </h2>
              <h2 className="text-base ">{data.shortDesc}</h2>
              <MarkDownReader markdown={data.desc} />
            </div>
            <div className="grid"></div>
          </div>
          <div className="fixed bottom-12 right-12 w-36">
            <Button className="w-full" onClick={handlePlay}>
              Play
            </Button>
          </div>
        </Fragment>
      )}
      {isPlaying && (
        <div className="flex flex-col p-8 shadow-lg">
          <GameEditor {...data} onQuit={handleQuit} />
        </div>
      )}
    </Fragment>
  );
}
