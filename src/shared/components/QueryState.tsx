"use client";

import { Skeleton, EmptyState, Button } from "@/components/core";
import { cn } from "@/lib/utils";

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  onRetry?: () => void;
  loadingFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Loading / Error / Empty wrapper — every feature action needs states */
export function QueryState({
  isLoading,
  isError,
  error,
  isEmpty,
  onRetry,
  loadingFallback,
  emptyFallback,
  children,
  className,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <div className={className} role="status" aria-live="polite">
        {loadingFallback ?? <DefaultLoadingSkeleton />}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}
        role="alert"
      >
        <p className="text-[15px] font-medium text-text-primary">خطا در بارگذاری</p>
        <p className="mt-2 max-w-sm text-[13px] text-text-secondary">
          {error?.message ?? "مشکلی پیش آمد. لطفاً دوباره تلاش کنید."}
        </p>
        {onRetry && (
          <Button className="mt-4" size="sm" onClick={onRetry}>
            تلاش مجدد
          </Button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={className}>
        {emptyFallback ?? (
          <EmptyState
            title="داده‌ای یافت نشد"
            description="AI پیشنهاد می‌کند فیلتر را تغییر دهید."
          />
        )}
      </div>
    );
  }

  return <>{children}</>;
}

function DefaultLoadingSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-md" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" variant="card" />
        ))}
      </div>
    </div>
  );
}
