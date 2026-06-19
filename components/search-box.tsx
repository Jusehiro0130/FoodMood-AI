"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type SearchBoxProps = { initialValue?: string; compact?: boolean };
export function SearchBox({ initialValue = "", compact = false }: SearchBoxProps) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const trimmed = query.trim(); if (trimmed) router.push(`/search?q=${encodeURIComponent(trimmed)}`); }
  return <form className={`flex items-center gap-2 rounded-3xl border border-[#ead6c4] bg-white p-2 shadow-sm ${compact ? "" : "min-h-16"}`} onSubmit={handleSubmit}><div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#fff0df] text-[#fa5a2a]"><Search size={21} /></div><input className="min-w-0 flex-1 bg-transparent text-base font-semibold text-[#251611] outline-none placeholder:text-[#9d7d6d]" onChange={(event) => setQuery(event.target.value)} placeholder="Escribe tu antojo..." value={query} /><button className="min-h-11 rounded-2xl bg-[#fa5a2a] px-4 text-sm font-black text-white shadow-sm" type="submit">Buscar</button></form>;
}
