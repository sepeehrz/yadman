import { useCallback } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDialog } from "./use-dialog";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export function useConfirm() {
  const { openDialog, closeDialog } = useDialog();

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        let settled = false;

        const decide = (value: boolean): void => {
          if (settled) {
            return;
          }
          settled = true;
          closeDialog();
          resolve(value);
        };

        openDialog(ConfirmDialog, {
          title: options.title,
          message: options.message,
          confirmLabel: options.confirmLabel,
          cancelLabel: options.cancelLabel,
          danger: options.danger,
          onConfirm: () => decide(true),
          closeDialog: () => decide(false),
        });
      });
    },
    [openDialog, closeDialog],
  );

  return confirm;
}
