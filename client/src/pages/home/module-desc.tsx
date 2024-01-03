import { Button } from "@/components/ui/button";
import { MarkDownReader } from "@/components/ui/markdown";
import { Fragment } from "react";
import { useParams } from "react-router-dom";

const TEST_DESC: string = `
### Sticking our gyatt for nerizzler 
### you're so bau bau

|  Key  | Action |
| :---------: | :------------ |
|  <kbd>j</kbd> | Move left   |
| Content Cell  | Move down  |

`;

function ModuleLeaderboard() {
  return (
    <div className="text-sm">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th></th>
            <th>Time</th>
            <th>Keystrokes</th>
            <th>Score</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>user</td>
            <td>user</td>
            <td>user</td>
            <td>user</td>
            <td>user</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function ModuleDescPage() {
  const { id } = useParams();
  return (
    <div className="grid lg:grid-cols-3 px-4 py-8 w-full">
      <div className="grid col-span-2 gap-4">
        <h2 className="text-2xl font-bold tracking-tight">TITLE</h2>
        <MarkDownReader markdown={TEST_DESC} />
      </div>
      <div className="grid">
        <ModuleLeaderboard />
      </div>
    </div>
  );
}
