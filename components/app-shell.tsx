import type { ReactNode } from "react";

type AppShellProps = { children?: ReactNode; withBottomPadding?: boolean };

export function AppShell({ children, withBottomPadding = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#fff8f0] text-[#251611]">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_20%_0%,rgba(250,90,42,0.18),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(47,125,98,0.14),transparent_30%)]" />
      <div className={`relative ${withBottomPadding ? "pb-28" : ""}`}>{children}</div>
    </div>
  );
}
