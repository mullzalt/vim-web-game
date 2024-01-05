import { LanguageName } from "@uiw/codemirror-extensions-langs";

type GameSelection = { anchor: number; head: number };

type ActionSelect = {
  action: "select";
  selection: GameSelection;
  intendedKeystrokes: number;
  hints?: string;
};

type ActionModify = {
  action: "modify";
  after: string;
  intendedKeystrokes: number;
  hints?: string;
};

export type GameAction = ActionSelect | ActionModify;

export interface GameModule {
  title: string;
  desc: string;
  initialCode: string;
  actions: GameAction[];
  lang: LanguageName | null;
  shortDesc: string;
  intendedKeystrokes: number;
}

export interface GameStatisticData {
  times: number[];
  timeTotal: number;
  timeScores: number[];
  timeScoreTotal: number;
  keystrokes: number[];
  keystrokeTotal: number;
  keystrokeScores: number[];
  keystrokeScoreTotal: number;
  totalScore: number;
  gradeTime: number;
  gradeKeystroke: number;
  gradeOverall: number;
}
