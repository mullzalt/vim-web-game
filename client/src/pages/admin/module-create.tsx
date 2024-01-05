import { Fragment, useCallback, useEffect, useState } from "react";
import { useApi, useApiCallback } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { GameModule } from "@/schema/game-module";
import { Spinner } from "@/components/loading";
import { Link } from "react-router-dom";
import { GameModuleRequest, GetManyRequest } from "@/stores/game-module";
import { PlusIcon } from "lucide-react";
import { TooltipMain } from "@/components/tooltip-main";
import { ModuleListMinimal } from "@/components/module/module-list";

export function ModuleAdminPage() {
  const [module, setModule] = useState<GameModule>();
  const { data, isLoading } = useApi<GetManyRequest<GameModuleRequest>>(
    "games",
    {
      params: {
        show_archived: true,
      },
    },
  );

  const [
    write,
    { isLoading: isWriteLoading, isError: isWriteError, error: writeError },
  ] = useApiCallback<GameModuleRequest>("games");

  const handleWrite = useCallback(() => {}, [module]);
  const handleUpdate = useCallback((mod: GameModule) => {
    setModule(mod);
  }, []);

  if (isLoading || !data) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <div className="flex flex-col gap-4 py-8 px-4">
        <h1 className="text-xl font-semibold leading-4 tracking-tight mb-4">
          Module List
        </h1>
        {data.rows &&
          data.rows.map((mod) => <ModuleListMinimal {...mod} key={mod.id} />)}
      </div>
      <div className="fixed bottom-12 right-8">
        <TooltipMain tooltip="Create new module">
          <Button
            size={"icon"}
            disabled={isWriteLoading}
            className="rounded-full"
            onClick={handleWrite}
          >
            <PlusIcon />
          </Button>
        </TooltipMain>
      </div>
    </Fragment>
  );
}
