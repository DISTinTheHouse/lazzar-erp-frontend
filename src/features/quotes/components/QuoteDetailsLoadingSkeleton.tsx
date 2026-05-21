import { LoadingSkeleton } from "@/src/components/LoadingSkeleton";

interface QuoteDetailsLoadingSkeletonProps {
  ariaLabel: string;
}

export function QuoteDetailsLoadingSkeleton({
  ariaLabel,
}: QuoteDetailsLoadingSkeletonProps) {
  return (
    <div
      className="space-y-4 min-h-104"
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <LoadingSkeleton className="h-24 rounded-2xl" />
      <LoadingSkeleton className="h-56 rounded-2xl" />
      <LoadingSkeleton className="h-48 rounded-2xl" />
    </div>
  );
}