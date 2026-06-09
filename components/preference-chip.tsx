type PreferenceChipProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export function PreferenceChip({ label, active = false, onClick }: PreferenceChipProps) {
  const Component = onClick ? "button" : "span";

  return (
    <Component
      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
        active
          ? "bg-[#251611] text-white shadow-sm"
          : "bg-white text-[#5f463b] ring-1 ring-black/5"
      }`}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      {label}
    </Component>
  );
}
