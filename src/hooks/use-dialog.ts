import { useContext } from "react";
import { DialogContext } from "@/providers/dialog-provider";

export function useDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used within DialogProvider");
  }

  return context;
}
