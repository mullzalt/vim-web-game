import { LanguageName } from "@uiw/codemirror-extensions-langs";

type GameSelection = { anchor: number; head: number };

type ActionSelect = {
  action: "select";
  selection: GameSelection;
  intended_keystrokes: number;
  hints?: string;
};

type ActionModify = {
  action: "modify";
  after: string;
  intended_keystrokes: number;
  hints?: string;
};

export type GameAction = ActionSelect | ActionModify;

export interface GameModule {
  title: string;
  desc: string;
  initial_code: string;
  actions: GameAction[];
  lang: LanguageName | null;
  short_desc: string;
}

export interface GameStatisticData {
  times: number[];
  time_total: number;
  time_scores: number[];
  time_scores_total: number;
  keystrokes: number[];
  keystroke_total: number;
  keystroke_scores: number[];
  keystroke_scores_total: number;
  total_score: number;
  grade_time: number;
  grade_keystroke: number;
  grade_overall: number;
}
