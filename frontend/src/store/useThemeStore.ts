import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PaletteMode } from "@mui/material";

interface ThemeState {
  mode: PaletteMode;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "dark",
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "theme-storage", // name of the item in the storage (must be unique)
    },
  ),
);
