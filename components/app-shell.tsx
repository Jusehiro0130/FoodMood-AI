import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ffe4c4_0,#fff8f0_34%,#f8f7f2_100%)] text-[#251611]">
      {children}
    </div>
  );
}
