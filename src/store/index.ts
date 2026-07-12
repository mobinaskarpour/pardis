import { create } from "zustand";
import type { CanvasType } from "@/types";

interface NavigationState {
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
}

interface AIContextStore {
  activeConversationId: string | null;
  canvasType: CanvasType;
  isThinking: boolean;
  setActiveConversation: (id: string | null) => void;
  setCanvasType: (type: CanvasType) => void;
  setThinking: (thinking: boolean) => void;
}

interface NotificationStore {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  clearUnread: () => void;
}

export const useNavigationStore = create<NavigationState>()((set) => ({
  commandPaletteOpen: false,
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  toggleCommandPalette: () =>
    set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
}));

export const useAIContextStore = create<AIContextStore>()((set) => ({
  activeConversationId: null,
  canvasType: "welcome",
  isThinking: false,
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setCanvasType: (canvasType) => set({ canvasType }),
  setThinking: (isThinking) => set({ isThinking }),
}));

export const useNotificationStore = create<NotificationStore>()((set) => ({
  unreadCount: 12,
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  incrementUnread: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),
  clearUnread: () => set({ unreadCount: 0 }),
}));
