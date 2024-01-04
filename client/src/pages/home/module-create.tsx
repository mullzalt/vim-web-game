import { Fragment, useCallback, useEffect, useState } from "react";
import { SandboxPage } from "./sandbox";
import { useApi, useApiCallback } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { GameModule } from "@/schema/game-module";

export function ModuleCreatePage() {
  const [module, setModule] = useState<GameModule>();
  const { data } = useApi("games", {
    params: {
      show_archived: true,
    },
  });

  const handleWrite = useCallback(() => {}, [module]);
  const handleUpdate = useCallback((mod: GameModule) => {
    setModule(mod);
  }, []);

  useEffect(() => {}, []);

  return (
    <Fragment>
      <Button onClick={handleWrite}>Write</Button>
      {/* <SandboxPage onUpdate={handleUpdate} /> */}
    </Fragment>
  );
}
