import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

type AppShellProps = { children?: ReactNode; withBottomPadding?: boolean };

export function AppShell({ children, withBottomPadding = false }: AppShellProps) {
  return (
    <div className="app-screen min-h-screen text-[var(--foreground)]">
      <div className="fixed right-4 top-4 z-50 pt-[var(--safe-top)]">
        <ThemeToggle />
      </div>
      <div className={`relative ${withBottomPadding ? "pb-28" : ""}`}>{children}</div>
    </div>
  );
}
