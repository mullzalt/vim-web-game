import { Spinner } from "@/components/loading";
import { ModuleListMinimal } from "@/components/module/module-list";
import { PaginationMain } from "@/components/pagination-main";
import { useApi } from "@/hooks/use-api";
import { GameCollectionRequest, GetManyRequest } from "@/stores/game-module";
import { useCallback } from "react";

function GameCollection(props: GameCollectionRequest) {
  const { title, Games } = props;
  return (
    <div className="flex flex-col gap-4 bg-foreground/10  border-2 rounded-lg">
      <div className=" flex gap-2 items-center text-lg font-semibold bg-accent text-accent-foreground p-4 rounded-lg">
        {props.title}
        <div className="text-xs rounded-lg text-muted italic truncate font-normal">
          {props.desc}
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {Games.map((game) => (
          <ModuleListMinimal
            {...game}
            className="bg-background"
            route="/modules/"
          />
        ))}
      </div>
    </div>
  );
}
export function LearnPage() {
  const { data, isLoading, refetch } = useApi<
    GetManyRequest<GameCollectionRequest>
  >("learns", {
    params: {
      size: 1,
    },
  });

  if (!data || isLoading) {
    return <Spinner />;
  }

  const handlePageChange = (page: number) => {
    refetch({
      params: {
        size: 1,
        page,
      },
    });
  };
  return (
    <div className="px-4 py-8 flex flex-col gap-8 min-h-[80vh]">
      <div className="text-2xl font-bold tracking-tight">Start From Here</div>
      {data.rows.map((collection) => (
        <GameCollection {...collection} />
      ))}

      <PaginationMain
        totalPage={data.total_page}
        totalItems={data.total_items}
        currentPage={data.current_page}
        size={data.size}
        onChange={handlePageChange}
      />
    </div>
  );
}
