import type { ReactNode } from "react";

type AppShellProps = { children?: ReactNode; withBottomPadding?: boolean };

export function AppShell({ children, withBottomPadding = false }: AppShellProps) {
  return <div className="min-h-screen bg-[#fff8f0] text-[#251611]"><div className={withBottomPadding ? "pb-24" : undefined}>{children}</div></div>;
}
