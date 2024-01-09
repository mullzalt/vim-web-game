import { Fragment, useCallback, useEffect } from "react";
import { useApi, useApiCallback } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/loading";
import { useNavigate } from "react-router-dom";
import { GameModuleRequest, GetManyRequest } from "@/stores/game-module";
import { PlusIcon } from "lucide-react";
import { TooltipMain } from "@/components/tooltip-main";
import { ModuleListMinimal } from "@/components/module/module-list";
import { PaginationMain } from "@/components/pagination-main";

export function ModuleAdminPage() {
  const { data, isLoading, refetch } = useApi<
    GetManyRequest<GameModuleRequest>
  >("games", {
    params: {
      show_archived: true,
    },
  });
  const navigate = useNavigate();

  const [write, { data: writeData, isLoading: isWriteLoading, isSuccess }] =
    useApiCallback<GameModuleRequest>("games");

  const handleWrite = useCallback(() => {
    write({
      method: "post",
      data: {
        title: "New Module",
        initialCode: "console.log('hello world!')",
        actions: [],
        intendedKeystrokes: 0,
        lang: null,
        desc: "new desc",
        shortDesc: "shortDesc",
      },
    });
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      refetch({
        params: {
          show_archived: true,
          page,
        },
      });
    },
    [data],
  );

  useEffect(() => {
    if (isSuccess && writeData) {
      navigate(writeData.id);
    }
  }, [isSuccess, writeData]);

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
        <PaginationMain
          totalPage={data.total_page}
          totalItems={data.total_items}
          currentPage={data.current_page}
          size={data.size}
          onChange={handlePageChange}
        />
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
