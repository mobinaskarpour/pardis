"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AppShell } from "@/components/shell/AppShell";
import { ModuleHero, AIDock } from "@/components/modules/shared/ModuleShell";
import { Skeleton } from "@/components/core";
import { pageLabels } from "@/config/labels";
import { useDoctors } from "@/features/doctors";
import { useModuleMeta } from "@/features/modules";
import { QueryState } from "@/shared/components/QueryState";
import { spring, cardHover } from "@/lib/motion";
import { cn } from "@/lib/utils";

const workloadStyles = {
  normal: "bg-success/10 text-success",
  busy: "bg-warning/10 text-warning",
  critical: "bg-error/10 text-error",
};

export function DoctorsPage() {
  const { data: meta, isLoading: metaLoading, isError: metaError, error: metaErr, refetch: refetchMeta } =
    useModuleMeta("doctors");
  const { data: doctors, isLoading: doctorsLoading, isError: doctorsError, error: doctorsErr, refetch: refetchDoctors } =
    useDoctors();

  return (
    <AppShell pageTitle={pageLabels.doctors}>
      <div className="h-full overflow-y-auto px-6 py-8 md:px-10 md:py-10">
        <QueryState
          isLoading={metaLoading || doctorsLoading}
          isError={metaError || doctorsError}
          error={metaErr ?? doctorsErr}
          onRetry={() => {
            refetchMeta();
            refetchDoctors();
          }}
          loadingFallback={<DoctorsPageSkeleton />}
        >
          {meta && doctors && (
            <>
              <ModuleHero
                title={pageLabels.doctors}
                subtitle={meta.subtitle}
                aiSummary={meta.aiSummary}
              />

              <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctors.map((doctor, i) => (
                    <Link key={doctor.id} href={`/doctors/${doctor.id}`}>
                      <motion.article
                        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ delay: i * 0.06, ...spring.soft }}
                        whileHover={cardHover}
                        className="rounded-[14px] border border-border bg-bg-elevated p-5 h-full transition-colors hover:border-border-hover cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-[18px] font-semibold text-text-primary">
                              {doctor.name}
                            </h3>
                            <p className="text-[13px] text-text-tertiary mt-0.5">
                              {doctor.specialty}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "text-[11px] rounded-[6px] px-2 py-0.5",
                              workloadStyles[doctor.workload]
                            )}
                          >
                            {doctor.workload === "critical"
                              ? "بحرانی"
                              : doctor.workload === "busy"
                                ? "فشرده"
                                : "عادی"}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
                          <div>
                            <p className="text-text-tertiary">بیماران</p>
                            <p className="font-medium text-text-primary tabular-nums">
                              {doctor.patients}
                            </p>
                          </div>
                          <div>
                            <p className="text-text-tertiary">درآمد</p>
                            <p className="font-medium text-text-primary">{doctor.revenue}</p>
                          </div>
                          <div>
                            <p className="text-text-tertiary">رضایت</p>
                            <p className="font-medium text-text-primary tabular-nums">
                              {doctor.satisfaction}٪
                            </p>
                          </div>
                          <div>
                            <p className="text-text-tertiary">زمان گزارش</p>
                            <p className="font-medium text-text-primary">{doctor.avgReportTime}</p>
                          </div>
                        </div>

                        <p className="mt-4 text-[13px] text-text-secondary leading-relaxed border-t border-border pt-3">
                          {doctor.aiInsight}
                        </p>
                      </motion.article>
                    </Link>
                  ))}
                </div>

                <AIDock
                  suggestions={meta.suggestions}
                  quickActions={meta.quickActions}
                />
              </div>
            </>
          )}
        </QueryState>
      </div>
    </AppShell>
  );
}

function DoctorsPageSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-52" />
        ))}
      </div>
    </div>
  );
}
