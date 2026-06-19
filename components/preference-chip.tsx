type PreferenceChipProps = { label: string; active?: boolean; onClick?: () => void; type?: "button" | "static" };

export function PreferenceChip({ label, active = false, onClick, type = "button" }: PreferenceChipProps) {
  const className = `rounded-full border px-4 py-2 text-sm font-bold transition ${active ? "border-[#251611] bg-[#251611] text-white" : "border-[#ead6c4] bg-white text-[#5f463b] hover:border-[#fa5a2a] hover:text-[#251611]"}`;
  if (type === "static") return <span className={className}>{label}</span>;
  return <button className={className} onClick={onClick} type="button">{label}</button>;
}
