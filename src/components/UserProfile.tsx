"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/app-icon";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { useConfirm } from "@/hooks/use-confirm";
import { ProfileEditForm } from "@/features/profile/components/profile-edit-form";
import { ChangePasswordForm } from "@/features/profile/components/change-password-form";

type Tab = "info" | "security";
interface IProps {
  closeDialog: () => void;
}
export function UserProfileComponent({ closeDialog }: IProps) {
  const { data: profile } = useProfile();
  const logoutMutation = useLogout();
  const confirm = useConfirm();
  const [tab, setTab] = useState<Tab>("info");

  const initials = profile
    ? `${profile.name[0] ?? ""}${profile.lastName[0] ?? ""}`.trim()
    : "؟";

  async function logout() {
    const ok = await confirm({
      title: "خروج از حساب؟",
      message:
        "از پنل خارج شوید. اگر داده‌ای ذخیره نکرده‌اید ممکن است از بین برود.",
      confirmLabel: "خروج",
      danger: true,
    });
    if (ok) {
      logoutMutation.mutate();
    }
  }
  return (
    <div>
      <div className="bg-card rounded-t-[28px] sm:rounded-3xl border border-border overflow-hidden flex flex-col">
        <div className="bg-linear-to-l from-primary to-chart-4 p-5 text-primary-foreground relative">
          <button
            onClick={closeDialog}
            aria-label="بستن"
            className="absolute top-4 left-4 w-7 h-7 rounded-full bg-primary-foreground/20 text-primary-foreground flex items-center justify-center hover:bg-primary-foreground/30"
          >
            <AppIcon name="close" className="size-4" />
          </button>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-14 h-14 rounded-full border-2 border-primary-foreground/50 bg-primary-foreground/20 flex items-center justify-center text-lg font-bold shadow-md">
              {initials}
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary-foreground">
                {profile
                  ? `${profile.name} ${profile.lastName}`
                  : "در حال بارگذاری…"}
              </h3>
              <p className="text-xs text-primary-foreground/80" dir="ltr">
                @{profile?.username ?? "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex border-b border-border">
          {(
            [
              { id: "info", label: "اطلاعات پروفایل", icon: "person" },
              { id: "security", label: "امنیت", icon: "lock" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                tab === item.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <AppIcon name={item.icon} className="size-3.75" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4 text-xs">
          {tab === "info" ? (
            profile ? (
              <ProfileEditForm profile={profile} onDone={closeDialog} />
            ) : (
              <p className="py-6 text-center text-muted-foreground">
                در حال دریافت پروفایل…
              </p>
            )
          ) : (
            <ChangePasswordForm />
          )}

          <div className="pt-2 border-t border-border">
            <button
              onClick={logout}
              disabled={logoutMutation.isPending}
              className="w-full py-2.5 rounded-xl bg-destructive/10 text-destructive font-bold text-xs hover:bg-destructive/20 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <AppIcon name="logout" className="size-4" />
              <span>خروج از حساب</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
