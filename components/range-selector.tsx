import { RANGE_OPTIONS } from "@/lib/constants";
import type { SearchRange } from "@/lib/types";

type RangeSelectorProps = {
  value: SearchRange;
  onChange: (range: SearchRange) => void;
};

export function RangeSelector({ value, onChange }: RangeSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2 rounded-3xl bg-white p-2 shadow-sm ring-1 ring-black/5">
      {RANGE_OPTIONS.map((option) => (
        <button
          className={`min-h-11 rounded-2xl text-xs font-black transition ${
            value === option.value
              ? "bg-[#fa5a2a] text-white"
              : "bg-[#fff8f0] text-[#7b5545]"
          }`}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
