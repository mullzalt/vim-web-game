import { GameModule } from "./vim-game";

export const TEST_MODULE: GameModule = {
  title: "TEST MODULE",
  desc: "TEST MODULE",
  shortDesc: "this is a test module",
  initialCode: `console.log("hello world!")`,
  actions: [
    {
      action: "select",
      selection: { anchor: 5, head: 5 },
      intendedKeystrokes: 4,
    },
    {
      action: "select",
      selection: { anchor: 12, head: 12 },
      intendedKeystrokes: 4,
    },
    {
      action: "select",
      selection: { anchor: 8, head: 8 },
      intendedKeystrokes: 4,
    },
    {
      action: "select",
      selection: { anchor: 17, head: 17 },
      intendedKeystrokes: 4,
    },
    {
      action: "select",
      selection: { anchor: 10, head: 10 },
      intendedKeystrokes: 4,
    },
  ],
  lang: "jsx",
};
