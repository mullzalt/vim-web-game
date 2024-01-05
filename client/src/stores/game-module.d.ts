import { GameModule } from "@/schema/game-module";

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
  rows: T[];
};
