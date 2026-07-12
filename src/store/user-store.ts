import { create } from "zustand";
import type { User } from "@/types";
import { currentUserMock } from "@/mock/data/user";

interface UserState {
  user: User;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: currentUserMock,
  setUser: (user) => set({ user }),
}));
