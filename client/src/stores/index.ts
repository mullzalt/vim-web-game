import { create } from "zustand";
import { UserData } from "./user-types";

type Store = {
  user: UserData | null;
  isLoading: boolean;
  setUser: (user: UserData | null) => void;
  setLoading: (isLoading: boolean) => void;
};

const useStore = create<Store>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set((state) => ({ ...state, user: user })),
  setLoading: (isLoading) => set((state) => ({ ...state, isLoading })),
}));

export { useStore };
