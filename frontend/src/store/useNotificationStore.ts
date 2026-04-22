import { create } from "zustand";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationState {
  isOpen: boolean;
  message: string;
  type: NotificationType;
  showNotification: (message: string, type?: NotificationType) => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  isOpen: false,
  message: "",
  type: "info",
  showNotification: (message, type = "info") =>
    set({
      isOpen: true,
      message,
      type,
    }),
  hideNotification: () => set({ isOpen: false }),
}));
