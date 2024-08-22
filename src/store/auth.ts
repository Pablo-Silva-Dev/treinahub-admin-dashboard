import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  name: string;
  email: string;
  token: string;
};

type State = {
  isAuthenticated: boolean;
  user: User;
};

type Actions = {
  signIn: (user: User) => void;
  signOut: () => void;
};

export const useAuthenticationStore = create(
  persist<State & Actions>(
    (set) => ({
      isAuthenticated: false,
      user: null as never,
      signIn: (user: User) => {
        set({ isAuthenticated: true, user });
      },
      signOut: () => {
        set({ isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
