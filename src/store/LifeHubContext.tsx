"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "@/components/common/toast";

type ToastType = "success" | "info" | "warning";

/**
 * Context سراسری فقط مسئول وضعیت رابط کاربری است (مودال‌ها و Toast).
 * داده‌های دامنه (وام‌ها، ردیاب‌ها، یادآورها و ...) از طریق هوک‌های
 * React-Query متصل به سرویس خوانده می‌شوند.
 */
interface LifeHubContextValue {
  // global modals
  isQuickAddOpen: boolean;
  setQuickAddOpen: (v: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  isProfileOpen: boolean;
  setProfileOpen: (v: boolean) => void;
  isOdometerOpen: boolean;
  setOdometerOpen: (v: boolean) => void;

  // toast (delegates to the centralized sonner wrapper in components/common/toast)
  showToast: (msg: string, icon?: string, type?: ToastType) => void;
}

const LifeHubContext = createContext<LifeHubContextValue | null>(null);

export function LifeHubProvider({ children }: { children: ReactNode }) {
  const [isQuickAddOpen, setQuickAddOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isOdometerOpen, setOdometerOpen] = useState(false);

  const showToast = useCallback(
    (msg: string, _icon = "check_circle", type: ToastType = "success") => {
      if (type === "warning") {
        toast.warning(msg);
      } else if (type === "info") {
        toast.info(msg);
      } else {
        toast.success(msg);
      }
    },
    [],
  );

  const value = useMemo<LifeHubContextValue>(
    () => ({
      isQuickAddOpen,
      setQuickAddOpen,
      isSearchOpen,
      setSearchOpen,
      isProfileOpen,
      setProfileOpen,
      isOdometerOpen,
      setOdometerOpen,
      showToast,
    }),
    [
      isQuickAddOpen,
      isSearchOpen,
      isProfileOpen,
      isOdometerOpen,
      showToast,
    ],
  );

  return (
    <LifeHubContext.Provider value={value}>{children}</LifeHubContext.Provider>
  );
}

export function useLifeHub(): LifeHubContextValue {
  const ctx = useContext(LifeHubContext);
  if (!ctx) throw new Error("useLifeHub باید داخل LifeHubProvider استفاده شود");
  return ctx;
}
