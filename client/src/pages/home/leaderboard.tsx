import { Spinner } from "@/components/loading";
import { useApi } from "@/hooks/use-api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetManyRequest } from "@/stores/game-module";
import { UserData } from "@/stores/user-types";
import { Fragment } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { calculateLevel } from "@/lib/level-system";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { PaginationMain } from "@/components/pagination-main";

export function LeaderBoardPage() {
  const { user } = useAuth();
  const { data, isLoading, refetch } =
    useApi<GetManyRequest<UserData["Profile"]>>("leaderboards");

  if (!data || isLoading) {
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
    <div className="container py-8 flex flex-col items-center min-h-[80vh]">
      <div className="text-2xl font-bold tracking-tight">Leaderboard</div>
      <Table className="my-8">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Total Score</TableHead>
            <TableHead>Grade Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.map((stats, i) => (
            <TableRow
              key={stats.id}
              className={cn(
                user && user.Profile.id === stats.id
                  ? "bg-yellow-400/80 text-background hover:text-foreground"
                  : "",
              )}
            >
              <TableCell className="font-black text-muted italic">
                #{i + 1}
              </TableCell>
              <TableCell className="flex gap-2 items-center">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={stats.photo} />
                  <AvatarFallback>{stats.username[0]}</AvatarFallback>
                </Avatar>
                {stats.username}
              </TableCell>
              <TableCell>{calculateLevel(stats.exp).level}</TableCell>
              <TableCell>{stats.totalScore}</TableCell>
              <TableCell>{stats.totalGrade}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
