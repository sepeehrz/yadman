"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  CircleCheckIcon,
  TriangleAlertIcon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // Lift toasts clear of the fixed bottom dock (h-16 + sm:mb-5 + safe-area).
      // Only `bottom` is set on purpose: a bare string offset would apply to all
      // four sides, and on mobile sonner derives toast width from the left/right
      // offsets, which would squash the toast.
      offset={{ bottom: "calc(env(safe-area-inset-bottom) + 96px)" }}
      mobileOffset={{ bottom: "calc(env(safe-area-inset-bottom) + 96px)" }}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          fontFamily: "Shabnam, sans-serif",
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
