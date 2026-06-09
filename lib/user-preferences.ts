import type { BudgetLevel, RecurringUserPreferences, SearchHistoryItem } from "@/lib/types";

function topValues(values: string[], limit = 3) {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([value]) => value);
}

export function getRecurringUserPreferences(
  searchHistory: SearchHistoryItem[],
): RecurringUserPreferences {
  const categories = searchHistory.flatMap((item) => item.parsedIntent.categories);
  const moods = searchHistory.flatMap((item) => item.parsedIntent.mood);
  const budgets = searchHistory
    .map((item) => item.parsedIntent.budget)
    .filter(Boolean) as BudgetLevel[];

  return {
    frequentCategories: topValues(categories),
    frequentMoods: topValues(moods),
    usualBudget: topValues(budgets, 1)[0] as BudgetLevel | undefined,
  };
}
