import type { ReactNode } from "react";
import { BottomNav } from "@/components/bottom-nav";

type AppShellProps = {
  children: ReactNode;
  showNav?: boolean;
};

export function AppShell({ children, showNav = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f8f0e7] text-[#251611]">
      <div className="mx-auto min-h-screen w-full max-w-md bg-[radial-gradient(circle_at_top_left,#ffe0bd_0,#fff8f0_35%,#f8f0e7_100%)] shadow-2xl shadow-black/10 lg:my-6 lg:min-h-[calc(100vh-3rem)] lg:overflow-hidden lg:rounded-[36px]">
        <div className={showNav ? "pb-24" : ""}>{children}</div>
        {showNav ? <BottomNav /> : null}
      </div>
    </div>
  );
}
