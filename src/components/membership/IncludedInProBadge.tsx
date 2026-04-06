export function IncludedInProBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-violet-500/40 bg-violet-500/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-violet-800 dark:text-violet-200 ${className}`.trim()}
    >
      Included in Pro
    </span>
  );
}
