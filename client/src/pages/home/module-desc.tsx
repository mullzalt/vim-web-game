import { Spinner } from "@/components/loading";
import { GameEditor } from "@/components/module/game-editor";
import { TooltipMain } from "@/components/tooltip-main";
import { Button } from "@/components/ui/button";
import { MarkDownReader } from "@/components/ui/markdown";
import { useApi, useApiCallback } from "@/hooks/use-api";
import { useModuleCalculator } from "@/hooks/use-module-calculator";
import {
  GameModuleRequest,
  GetManyRequest,
  ScoreRequest,
  ScoreResult,
} from "@/stores/game-module";
import {
  CaseLowerIcon,
  Clock3Icon,
  CodeIcon,
  KeyboardIcon,
  TargetIcon,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../not-found";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { GameStatisticData } from "@/schema/game-module";

function ModuleInfo(props: GameModuleRequest) {
  const info = useModuleCalculator(props);
  const lengthInfo =
    info.codeLengthMin === info.codeLengthMax
      ? `${info.codeLengthMin} chars`
      : `${info.codeLengthMin} - ${info.codeLengthMax} chars`;
  return (
    <div className="flex flex-col text-sm gap-2 h-fit border rounded-lg p-4">
      <div className="grid items-center grid-cols-2">
        <div className="flex items-center">
          <CodeIcon className="w-4 h-4 mr-2" />
          Language
        </div>
        <div>: {info.lang}</div>
      </div>
      <div className="grid items-center grid-cols-2">
        <div className="flex items-center">
          <TargetIcon className="w-4 h-4 mr-2" />
          Actions
        </div>
        <div>: {info.length} actions</div>
      </div>

      <div className="grid items-center grid-cols-2">
        <div className="flex items-center">
          <CaseLowerIcon className="w-4 h-4 mr-2" />
          Code Length
        </div>
        <div>: {lengthInfo}</div>
      </div>

      <div className="flex items-center font-black italic">SS</div>
      <div className="grid items-center grid-cols-2">
        <div className="flex items-center">
          <KeyboardIcon className="w-4 h-4 mr-2" />
          Keystroke
        </div>
        <div>: {info.ssKeystroke} key pressed</div>
      </div>
      <div className="grid items-center grid-cols-2">
        <div className="flex items-center">
          <Clock3Icon className="w-4 h-4 mr-2" />
          Time
        </div>
        <div>: {info.ssTime} seconds</div>
      </div>
    </div>
  );
}

function ModuleScores({ id }: { id: string }) {
  const { user } = useAuth();
  const { data, isLoading, isError, error, status } = useApi<
    GetManyRequest<ScoreRequest>
  >(`games/${id}/scores`);

  if (isError) {
    return (
      <div className="p-4 border rounded-md flex flex-col">
        Something went wrong while loading the scores
      </div>
    );
  }

  if (!data || isLoading) return <Spinner className="h-64" />;

  return (
    <div className="p-4 border gap-2 rounded-md flex flex-col max-h-64 overflow-y-auto">
      <div className="flex gap-2 font-bold border-b py-2">Leaderboard</div>
      <ul className="text-sm flex flex-col gap-2">
        {data.rows.map((a, i) => (
          <li
            className={cn(
              "grid grid-cols-2 items-center border-y p-2",
              user && user.id === a.user.id
                ? "bg-yellow-400/90 text-background"
                : "",
            )}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-muted">#{i + 1}</span>
              <Avatar className="w-8 h-8">
                <AvatarImage src={a.user.Profile.photo} />
                <AvatarFallback>{a.user.Profile.username[0]}</AvatarFallback>
              </Avatar>
              <span className="text-ellipsis">{a.user.Profile.username}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="font-bold italic">{a.totalScore}</span>
              <span>{a.grade}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScoreDiff(props: ScoreResult) {
  const { current, prevBest } = props;
  return (
    <div className="grid text-xs">
      <div className="grid grid-cols-5">
        <div className={cn(
          "flex p-4 items-center justify-center border", 
          current.totalScore > prevBest.totalScore && "bg-green-400/40")
        }>
          Current Stats
        </div>
        <div className="flex p-4 items-center justify-center border">
          Score: {current.totalScore}
        </div>
        <div className="flex p-4 items-center justify-center border">
          Keystrokes: {current.keystrokes.reduce((a, b) => a + b, 0)}
        </div>
        <div className="flex p-4 items-center justify-center border">
          Times: {(current.times.reduce((a, b) => a + b, 0) / 100).toFixed(2)}{" "}
          seconds
        </div>
        <div className="flex p-4 items-center justify-center border">
          Grade: {current.grade}
        </div>
      </div>
      <div className="grid grid-cols-5">
        <div className="flex p-4 items-center justify-center border">
          Personal Best
        </div>
        <div className="flex p-4 items-center justify-center border">
          Score: {prevBest.totalScore}
        </div>
        <div className="flex p-4 items-center justify-center border">
          Keystrokes: {prevBest.keystrokes.reduce((a, b) => a + b, 0)}
        </div>
        <div className="flex p-4 items-center justify-center border">
          Times: {(prevBest.times.reduce((a, b) => a + b, 0) / 100).toFixed(2)}
        </div>
        <div className="flex p-4 items-center justify-center border">
          Grade: {prevBest.grade}
        </div>
      </div>
    </div>
  );
}

export function ModuleDescPage() {
  const { id } = useParams();
  const { user, refetch } = useAuth();
  const { data, isLoading, isError, error, status } = useApi<GameModuleRequest>(
    `games/${id}`,
  );
  const [
    winApi,
    {
      data: scoreData,
      isLoading: winLoading,
      isSuccess: winSuccess,
      isError: winError,
    },
  ] = useApiCallback<ScoreResult>(`games/${id}/scores`);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayDiff, setDisplayDiff] = useState(false);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setDisplayDiff(false);
  }, []);
  const handleRestart = useCallback(() => setDisplayDiff(false), []);
  const handleQuit = useCallback(() => setIsPlaying(false), []);

  if (isError && status === 404) {
    return <NotFound message={error || "Module not found"} />;
  }

  const handleWin = useCallback(
    (data: GameStatisticData) => {
      if (!user) {
        return;
      }

      const { times, keystrokes, totalScore, gradeOverall: grade } = data;

      winApi({
        method: "post",
        data: {
          times,
          keystrokes,
          totalScore,
          grade,
        },
      });
      setDisplayDiff(true);
    },
    [user],
  );

  useEffect(() => {
    refetch();
  }, [winSuccess]);

  if (!data || isLoading) return <Spinner />;
  return (
    <Fragment>
      {!isPlaying && (
        <Fragment>
          <div className="grid lg:grid-cols-3 gap-4 container py-8 ">
            <div className="grid col-span-2 gap-4">
              <h2 className="text-2xl font-bold tracking-tight">
                {data.title}
              </h2>
              <h2 className="text-base ">{data.shortDesc}</h2>
              <MarkDownReader markdown={data.desc} />
            </div>
            <div className="flex flex-col gap-4">
              <ModuleInfo {...data} />
              <ModuleScores id={data.id} />
            </div>
          </div>
          <div className="fixed bottom-12 right-12  w-36 z-50">
            <Button className="w-full" onClick={handlePlay}>
              Play
            </Button>
          </div>
        </Fragment>
      )}
      {isPlaying && (
        <div className="flex flex-col p-8">
          <GameEditor
            {...data}
            onRestart={handleRestart}
            onQuit={handleQuit}
            onWinning={handleWin}
          >
            {scoreData && displayDiff && <ScoreDiff {...scoreData} />}
          </GameEditor>
        </div>
      )}
    </Fragment>
  );
}
