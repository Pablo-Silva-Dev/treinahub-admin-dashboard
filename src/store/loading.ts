import { create } from "zustand";

type State = {
  isLoading: boolean
}

type Actions = {
  setIsLoading: (isLoading: boolean) => void
}

export const useLoading = create<State & Actions>((set) => ({
  isLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
}));
