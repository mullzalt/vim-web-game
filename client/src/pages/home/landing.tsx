import { VimGame } from "@/components/game/editor-game";
import { GameModule } from "@/lib/vim-game";
import { useMemo } from "react";

export default function LandingPage() {
  const TEST_MODULE = useMemo<GameModule>(
    () => ({
      title: "TEST",
      desc: "TEST",
      hints: [],
      initialCode: `console.log('hello world!')`,
      actions: [
        // {
        //   action: "select",
        //   selection: { anchor: 8, head: 8 },
        //   intendedKeystrokes: 8,
        // },
        // {
        //   action: "select",
        //   selection: { anchor: 10, head: 10 },
        //   intendedKeystrokes: 2,
        // },
        // {
        //   action: "select",
        //   selection: { anchor: 6, head: 6 },
        //   intendedKeystrokes: 2,
        // },
        {
          action: "modify",
          after: `console.log('hello world!')
console.log('hello world!')`,
          intendedKeystrokes: 4,
        },
        {
          action: "modify",
          after: `console.log('hello world!')
console.log('goodbye')`,
          intendedKeystrokes: 10,
        },
        {
          action: "modify",
          after: `console.log('hello world!')
console.log('goodby')`,
          intendedKeystrokes: 1,
        },
        {
          action: "select",
          selection: { anchor: 12, head: 12 },
          intendedKeystrokes: 2,
        },
      ],
      lang: "jsx",
    }),
    [],
  );
  return (
    <div className="py-8">
      <div className="px-4 my-8">
        <VimGame {...TEST_MODULE} />
      </div>
    </div>
  );
}
