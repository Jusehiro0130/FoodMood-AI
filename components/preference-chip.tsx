type PreferenceChipProps = { label: string; active?: boolean; onClick?: () => void; type?: "button" | "static" };

export function PreferenceChip({ label, active = false, onClick, type = "button" }: PreferenceChipProps) {
  const className = `rounded-full border px-4 py-2 text-sm font-bold transition ${active ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]" : "border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-strong)] hover:border-[var(--brand)] hover:text-[var(--foreground)]"}`;
  if (type === "static") return <span className={className}>{label}</span>;
  return <button className={className} onClick={onClick} type="button">{label}</button>;
}
