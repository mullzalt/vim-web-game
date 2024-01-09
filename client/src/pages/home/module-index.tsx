import { Spinner } from "@/components/loading";
import { ModuleList } from "@/components/module/module-list";
import { PaginationMain } from "@/components/pagination-main";
import { useApi } from "@/hooks/use-api";
import { GameModuleRequest, GetManyRequest } from "@/stores/game-module";
import { Link } from "react-router-dom";

export function ModuleMainPage() {
  const { data, isLoading, refetch } = useApi<
    GetManyRequest<GameModuleRequest>
  >("games", {});

  if (isLoading || !data) {
    return <Spinner />;
  }
  const handlePageChange = (page: number) => {
    refetch({
      params: {
        page,
      },
    });
  };
  return (
    <div className="container py-8 flex flex-col min-h-[80vh]">
      <h1 className="text-xl font-semibold leading-4 tracking-tight mb-4">
        Discover more Challenges
      </h1>
      <div className="grid grid-cols-2 gap-4 py-8">
        {data.rows &&
          data.rows.map((mod) => <ModuleList {...mod} key={mod.id} />)}
      </div>

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
