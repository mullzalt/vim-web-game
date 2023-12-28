import { LanguageName } from "@uiw/codemirror-extensions-langs";

type GameSelection = { anchor: number; head: number };

type ActionSelect = {
  action: "select";
  selection: GameSelection;
};

type ActionModify = {
  action: "modify";
  after: string;
  diffBy: "any" | "word" | "line";
};

export type GameAction = ActionSelect | ActionModify;

export interface GameModule {
  title: string;
  desc: string;
  hints: string[];
  initialCode: string;
  actions: GameAction[];
  lang: LanguageName | null;
}
