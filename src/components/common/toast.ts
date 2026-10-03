export type ToastKind = "success" | "error" | "info" | "warning";

export interface ToastEvent {
  kind: ToastKind;
  message: string;
}

type ToastListener = (event: ToastEvent) => void;

const listeners = new Set<ToastListener>();

function emit(kind: ToastKind, message: string): void {
  listeners.forEach((listener) => listener({ kind, message }));
}

export function subscribeToast(listener: ToastListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const toast = {
  success(message: string): void {
    emit("success", message);
  },
  error(message: string): void {
    emit("error", message);
  },
  info(message: string): void {
    emit("info", message);
  },
  warning(message: string): void {
    emit("warning", message);
  },
};
