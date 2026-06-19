import type { BudgetLevel, RecurringPreferences, SearchHistoryItem } from "@/lib/types";

function topValues(values: string[], limit = 3) {
  const counts = values.reduce<Record<string, number>>((acc, value) => { acc[value] = (acc[value] ?? 0) + 1; return acc; }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([value]) => value);
}

export function getRecurringUserPreferences(searchHistory: SearchHistoryItem[]): RecurringPreferences {
  const categories = searchHistory.flatMap((item) => item.parsedIntent.categories);
  const ambience = searchHistory.flatMap((item) => item.parsedIntent.mood);
  const budgets = searchHistory.map((item) => item.parsedIntent.budget).filter(Boolean) as BudgetLevel[];
  return { categories: topValues(categories), ambience: topValues(ambience), budget: topValues(budgets, 1)[0] as BudgetLevel | undefined };
}
