import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { SearchClient } from "@/app/search/search-client";

export default function SearchPage() {
  return <Suspense fallback={<AppShell />}><SearchClient /></Suspense>;
}
