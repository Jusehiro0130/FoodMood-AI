import type { ReactNode } from "react";

type EmptyStateProps = { title: string; description?: string; action?: ReactNode };
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return <div className="rounded-3xl border border-dashed border-[#e8c5a7] bg-white p-6 text-center shadow-sm"><p className="text-lg font-black text-[#251611]">{title}</p>{description ? <p className="mt-2 text-sm text-[#7b5545]">{description}</p> : null}{action ? <div className="mt-4">{action}</div> : null}</div>;
}
