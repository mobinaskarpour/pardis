"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import {
  ModuleHero,
  AIDock,
  SmartFilter,
} from "@/components/modules/shared/ModuleShell";
import { PatientCard } from "@/components/modules/patients/PatientCard";
import { EmptyState, Skeleton } from "@/components/core";
import { pageLabels, uiLabels } from "@/config/labels";
import { usePatients } from "@/features/patients";
import { useModuleMeta } from "@/features/modules";
import { QueryState } from "@/shared/components/QueryState";

export function PatientsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("");

  const {
    data: meta,
    isLoading: metaLoading,
    isError: metaError,
    error: metaErr,
    refetch: refetchMeta,
  } = useModuleMeta("patients");

  const {
    data: patients,
    isLoading: patientsLoading,
    isError: patientsError,
    error: patientsErr,
    refetch: refetchPatients,
  } = usePatients(filter);

  const handleSuggestion = (s: string) => {
    if (s.includes("AI") || s.includes("ثبت")) {
      router.push("/chat");
      return;
    }
    setFilter(s);
  };

  const isLoading = metaLoading || patientsLoading;
  const isError = metaError || patientsError;
  const error = metaErr ?? patientsErr;

  return (
    <AppShell pageTitle={pageLabels.patients}>
      <div className="h-full overflow-y-auto px-6 py-8 md:px-10 md:py-10">
        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => {
            refetchMeta();
            refetchPatients();
          }}
          loadingFallback={<PatientsPageSkeleton />}
        >
          {meta && (
            <>
              <ModuleHero
                title={pageLabels.patients}
                subtitle={meta.subtitle}
                aiSummary={meta.aiSummary}
              />

              <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-8">
                <div>
                  <SmartFilter value={filter} onChange={setFilter} />

                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[13px] text-text-tertiary">
                      {uiLabels.patientExplorer} · {patients?.length ?? 0} بیمار
                    </p>
                  </div>

                  {patients && patients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {patients.map((patient, i) => (
                        <PatientCard
                          key={patient.id}
                          patient={patient}
                          index={i}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="بیماری یافت نشد"
                      description="AI پیشنهاد می‌کند فیلتر را تغییر دهید یا جستجوی جدید انجام دهید."
                      suggestions={["MRI", "فعال", "در انتظار", "ثبت بیمار جدید"]}
                      onSuggestionClick={handleSuggestion}
                    />
                  )}
                </div>

                <AIDock
                  suggestions={meta.suggestions}
                  quickActions={meta.quickActions}
                  onSuggestionClick={handleSuggestion}
                />
              </div>
            </>
          )}
        </QueryState>
      </div>
    </AppShell>
  );
}

function PatientsPageSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <div className="space-y-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <Skeleton className="h-20 w-full max-w-2xl" variant="card" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-44" />
        ))}
      </div>
    </div>
  );
}
