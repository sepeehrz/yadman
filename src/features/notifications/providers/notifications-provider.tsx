"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  useBrowserNotifications,
  requestBrowserNotificationPermission,
} from "../hooks/use-browser-notifications";
import { useNotifications } from "../hooks/use-notifications";
import type { StoredNotification } from "../types";

interface NotificationsContextValue {
  notifications: StoredNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  /** زمان آخرین بازکردن اعلان‌سنتر را ثبت می‌کند */
  registerOpened: () => void;
  /** اجازه‌ی نوتیفیکیشن مرورگر را می‌پرسد و وضعیت را برمی‌گرداند */
  enableBrowserNotifications: () => Promise<boolean>;
  isLoading: boolean;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null,
);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    clearAll,
    registerOpened,
    isLoading,
  } = useNotifications();

  const [browserEnabled, setBrowserEnabled] = useState(false);
  useBrowserNotifications(notifications, browserEnabled);

  const value = useMemo<NotificationsContextValue>(
    () => ({
      notifications,
      unreadCount,
      markRead,
      markAllRead,
      clearAll,
      registerOpened,
      enableBrowserNotifications: async () => {
        const granted = await requestBrowserNotificationPermission();
        setBrowserEnabled(granted);
        return granted;
      },
      isLoading,
    }),
    [
      notifications,
      unreadCount,
      markRead,
      markAllRead,
      clearAll,
      registerOpened,
      isLoading,
    ],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      "useNotificationsContext باید داخل NotificationsProvider استفاده شود",
    );
  }
  return ctx;
}