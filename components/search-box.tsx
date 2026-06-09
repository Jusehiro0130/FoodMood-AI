"use client";

import { FormEvent, useState } from "react";
import { Search, Send } from "lucide-react";

type SearchBoxProps = {
  initialValue?: string;
  placeholder?: string;
  onSearch: (query: string) => void;
};

export function SearchBox({
  initialValue = "",
  placeholder = "Ej: salchipapa barata cerca",
  onSearch,
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = query.trim();
    if (clean) onSearch(clean);
  }

  return (
    <form
      className="flex items-center gap-2 rounded-[26px] bg-white p-2 shadow-lg shadow-[#ca5b2817] ring-1 ring-black/5"
      onSubmit={handleSubmit}
    >
      <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#fff0d8] text-[#fa5a2a]">
        <Search size={20} />
      </div>
      <input
        className="min-w-0 flex-1 bg-transparent text-base font-semibold text-[#251611] outline-none placeholder:text-[#a98b7c]"
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        value={query}
      />
      <button
        className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#251611] text-white transition hover:bg-[#3b241b]"
        type="submit"
      >
        <Send size={18} />
      </button>
    </form>
  );
}
