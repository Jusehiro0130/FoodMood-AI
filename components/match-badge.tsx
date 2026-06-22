type MatchBadgeProps = { score: number };
export function MatchBadge({ score }: MatchBadgeProps) { return <span className="inline-flex items-center rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-black text-white">{score}% match</span>; }
