"use client";

import { useEffect } from "react";
import { useLifeHub } from "@/store/LifeHubContext";
import { subscribeToast, type ToastKind } from "./toast";

const KIND_ICON: Record<ToastKind, string> = {
  success: "check_circle",
  error: "error",
  info: "info",
  warning: "warning",
};

export function ToastBridge() {
  const { showToast } = useLifeHub();

  useEffect(
    () =>
      subscribeToast(({ kind, message }) => {
        showToast(message, KIND_ICON[kind], kind === "error" ? "warning" : "success");
      }),
    [showToast],
  );

  return null;
}
