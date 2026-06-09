import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#fff0d8] text-[#fa5a2a]">
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-black text-[#251611]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#7b5545]">{description}</p>
    </div>
  );
}
