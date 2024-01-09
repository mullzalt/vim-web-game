import { Fragment, useCallback, useEffect, useState } from "react";
import { SandboxPage } from "../home/sandbox";
import { useNavigate, useParams } from "react-router-dom";
import { useApi, useApiCallback } from "@/hooks/use-api";
import { GameModuleRequest } from "@/stores/game-module";
import { GameModule } from "@/schema/game-module";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { toast } from "sonner";

export function ModuleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useApi<GameModuleRequest>(
    `games/${id}`,
  );
  const [write, writeStatus] = useApiCallback<GameModuleRequest>(`games/${id}`);

  const [gameModule, setGameModule] = useState<GameModule>();
  const [hasChange, setHasChange] = useState<boolean>(false);

  const handleUpdate = useCallback((mod: GameModule) => {
    setHasChange(true);
    setGameModule(mod);
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, []);

  const handleSave = useCallback(() => {
    write({ method: "put", data: { ...gameModule } });
  }, [gameModule]);

  useEffect(() => {
    if (writeStatus.isSuccess) {
      setHasChange(false);
      toast("Module updated");
    }
  }, [writeStatus.isSuccess]);

  useEffect(() => {
    if (writeStatus.isError && writeStatus.error) {
      toast(error || "Failed to save");
    }
  }, [writeStatus.isError, writeStatus.error]);

  return (
    <Fragment>
      <div className="my-4 px-4 flex justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            className="rounded-full"
            size={"icon"}
            onClick={handleBack}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="font-semibold text-lg">{data && data.title}</span>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChange || isLoading || writeStatus.isLoading}
        >
          {writeStatus.isLoading ? "writing..." : "Save Changes"}
        </Button>
      </div>
      {data && <SandboxPage modules={data} onUpdate={handleUpdate} />}
    </Fragment>
  );
}
