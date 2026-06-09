type MatchBadgeProps = {
  score: number;
};

export function MatchBadge({ score }: MatchBadgeProps) {
  return (
    <span className="rounded-full bg-[#1f7a4d] px-3 py-1 text-xs font-black text-white shadow-sm">
      {score}% match
    </span>
  );
}
