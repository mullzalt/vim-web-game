import { LanguageName } from "@uiw/codemirror-extensions-langs";

type GameSelection = { anchor: number; head: number };

type ActionSelect = {
  action: "select";
  selection: GameSelection;
  intendedKeystrokes: number;
};

type ActionModify = {
  action: "modify";
  after: string;
  intendedKeystrokes: number;
};

export type GameAction = ActionSelect | ActionModify;

export interface GameModule {
  title: string;
  desc: string;
  // hints: string[];
  initialCode: string;
  actions: GameAction[];
  lang: LanguageName | null;
  shortDesc: string;
}

export interface GameStatisticData {
  times: number[];
  keystrokes: number[];
  ksScores: number[];
  timeScores: number[];
  totalScore: number;
  totalKsScore: number;
  totalTimeScore: number;
  totalTime: number;
  totalKeystrokes: number;
  timeGrade: number;
  keyStrokeGrade: number;
  overallGrade: number;
}
