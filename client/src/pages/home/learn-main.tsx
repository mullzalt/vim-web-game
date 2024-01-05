import { Spinner } from "@/components/loading";
import { ModuleListMinimal } from "@/components/module/module-list";
import { useApi } from "@/hooks/use-api";
import { GameCollectionRequest, GetManyRequest } from "@/stores/game-module";

function GameCollection(props: GameCollectionRequest) {
  const { title, Games } = props;
  return (
    <div className="flex flex-col gap-4  border rounded-lg">
      <div className="text-lg font-semibold bg-accent text-accent-foreground p-4 rounded-lg">
        {props.title}
      </div>
      <div className="flex flex-col gap-4 my-4 p-4">
        {Games.map((game) => (
          <ModuleListMinimal {...game} route="/modules/" />
        ))}
      </div>
    </div>
  );
}
export function LearnPage() {
  const { data, isLoading } =
    useApi<GetManyRequest<GameCollectionRequest>>("/learns");

  if (!data || isLoading) {
    return <Spinner />;
  }
  return (
    <div className="px-4 py-8">
      {data.rows.map((collection) => (
        <GameCollection {...collection} />
      ))}
    </div>
  );
}
