import { GameModule } from "@/schema/game-module";
import { UserData } from "./user-types";

export interface GameModuleRequest extends GameModule {
  id: string;
  intendedKeystrokes: number;
  creator: {
    role: "user" | "admin";
    Profile: {
      username: string;
      photo: string;
      exp: number;
    };
  };
  favoriteCount: number;
  playCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameCollectionRequest {
  id: string;
  title: string;
  desc: string;
  isTutorial: boolean;
  Games: GameModuleRequest[];
  createdAt: Date;
  updatedAt: Date;
}

export type GetManyRequest<T> = {
  current_page: number;
  total_page: number;
  total_items: number;
  size: number;
  rows: T[];
};

export type ScoreRequest = {
  id: string;
  totalScore: number;
  grade: number;
  user: UserData;
  times: number[];
  keystrokes: number[];
};

export type ScoreResult = {
  prevBest: {
    times: number[];
    keystrokes: number[];
    totalScore: number;
    grade: number;
  };
  current: {
    times: number[];
    keystrokes: number[];
    totalScore: number;
    grade: number;
  };
  statsIncrease: {
    exp: number;
    totalScore: number;
    totalGrade: number;
  };
  isPersonalBest: boolean;
  isNew: boolean;
};

export type Leaderboard = UserData["Profile"] & {
  rank: number;
};
