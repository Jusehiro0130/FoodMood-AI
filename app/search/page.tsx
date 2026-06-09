import { SearchClient } from "@/app/search/search-client";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  return <SearchClient initialQuery={params.q ?? ""} />;
}
