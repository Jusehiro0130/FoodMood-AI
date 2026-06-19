"use client";

import type { SearchRange } from "@/lib/types";

const ranges: Array<{ value: SearchRange; label: string }> = [
  { value: "2km", label: "2 km" }, { value: "5km", label: "5 km" }, { value: "10km", label: "10 km" }, { value: "city", label: "Toda" },
];

type RangeSelectorProps = { value: SearchRange; onChange: (range: SearchRange) => void };
export function RangeSelector({ value, onChange }: RangeSelectorProps) {
  return <div className="grid grid-cols-4 rounded-2xl bg-[#f1e4d7] p-1">{ranges.map((range) => <button className={`min-h-11 rounded-xl px-2 text-sm font-black transition ${value === range.value ? "bg-white text-[#251611] shadow-sm" : "text-[#7b5545]"}`} key={range.value} onClick={() => onChange(range.value)} type="button">{range.label}</button>)}</div>;
}
