import { create } from "zustand";
import { type ConfirmSeverity } from "../components/ConfirmationDialog";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: ConfirmSeverity;
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions;
  loading: boolean;
  resolve: ((value: boolean) => void) | null;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  setLoading: (loading: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  loading: false,
  resolve: null,
  options: {
    title: "",
    message: "",
  },
  confirm: (options) => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        options: {
          ...options,
          confirmText: options.confirmText || "Confirm",
          cancelText: options.cancelText || "Cancel",
          severity: options.severity || "info",
        },
        resolve,
      });
    });
  },
  setLoading: (loading) => set({ loading }),
  onConfirm: () => {
    const { resolve } = get();
    if (resolve) resolve(true);
  },
  onCancel: () => {
    const { resolve } = get();
    if (resolve) resolve(false);
    set({ isOpen: false, loading: false, resolve: null });
  },
}));
