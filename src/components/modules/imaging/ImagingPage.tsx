"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import {
  ModuleHero,
  AIDock,
  SmartFilter,
} from "@/components/modules/shared/ModuleShell";
import { ImagingStudyCard } from "./ImagingStudyCard";
import { AIAnalysisPanel } from "./AIAnalysisPanel";
import { DeviceStatusBar } from "./DeviceStatusBar";
import { EmptyState, Skeleton } from "@/components/core";
import { useImagingStudies, useImagingDevices } from "@/features/imaging";
import { useModuleMeta } from "@/features/modules";
import { QueryState } from "@/shared/components/QueryState";
import { pageLabels, uiLabels } from "@/config/labels";

const ImagingViewer = dynamic(
  () => import("./ImagingViewer").then((m) => m.ImagingViewer),
  {
    loading: () => <Skeleton variant="chart" className="aspect-[4/3]" />,
    ssr: false,
  }
);

export function ImagingPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const metaQuery = useModuleMeta("imaging");
  const studiesQuery = useImagingStudies(filter);
  const devicesQuery = useImagingDevices();

  const studies = studiesQuery.data ?? [];
  const selectedStudy = useMemo(() => {
    if (selectedId) return studies.find((s) => s.id === selectedId);
    return studies.find((s) => s.status === "آماده بررسی") ?? studies[0];
  }, [studies, selectedId]);

  const handleSuggestion = (s: string) => {
    if (s.includes("AI") || s.toLowerCase().includes("viewer")) {
      router.push("/chat");
      return;
    }
    setFilter(s);
  };

  const isLoading =
    metaQuery.isLoading || studiesQuery.isLoading || devicesQuery.isLoading;
  const isError =
    metaQuery.isError || studiesQuery.isError || devicesQuery.isError;
  const error = metaQuery.error ?? studiesQuery.error ?? devicesQuery.error;

  return (
    <AppShell pageTitle={pageLabels.imaging}>
      <div className="h-full overflow-y-auto px-6 py-8 md:px-10 md:py-10">
        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => {
            metaQuery.refetch();
            studiesQuery.refetch();
            devicesQuery.refetch();
          }}
          loadingFallback={<ImagingPageSkeleton />}
        >
          {metaQuery.data && (
            <>
              <ModuleHero
                title={pageLabels.imaging}
                subtitle={metaQuery.data.subtitle}
                aiSummary={metaQuery.data.aiSummary}
              />

              {devicesQuery.data && <DeviceStatusBar devices={devicesQuery.data} />}

              <div className="mt-8 grid grid-cols-1 xl:grid-cols-[320px_1fr_280px] gap-6">
                {/* Study list */}
                <div className="space-y-4">
                  <SmartFilter
                    value={filter}
                    onChange={setFilter}
                    placeholder="MRI، CT، آماده بررسی، امروز..."
                  />
                  <p className="text-[13px] text-text-tertiary">
                    {uiLabels.todayStudies} · {studies.length} مورد
                  </p>
                  <div className="space-y-3 max-h-[520px] overflow-y-auto pe-1">
                    {studies.length > 0 ? (
                      studies.map((study, i) => (
                        <ImagingStudyCard
                          key={study.id}
                          study={study}
                          selected={selectedStudy?.id === study.id}
                          onSelect={() => setSelectedId(study.id)}
                          index={i}
                        />
                      ))
                    ) : (
                      <EmptyState
                        title="مطالعه‌ای یافت نشد"
                        description="فیلتر را تغییر دهید یا از AI Dock استفاده کنید."
                        suggestions={metaQuery.data.suggestions}
                        onSuggestionClick={handleSuggestion}
                      />
                    )}
                  </div>
                </div>

                {/* Viewer */}
                <div className="space-y-4 min-w-0">
                  {selectedStudy ? (
                    <>
                      <ImagingViewer study={selectedStudy} />
                      <AIAnalysisPanel study={selectedStudy} />
                    </>
                  ) : (
                    <EmptyState
                      title="مطالعه‌ای انتخاب نشده"
                      description="یک مطالعه از لیست انتخاب کنید."
                    />
                  )}
                </div>

                <AIDock
                  suggestions={metaQuery.data.suggestions}
                  quickActions={metaQuery.data.quickActions}
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

function ImagingPageSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <Skeleton className="h-24 w-full max-w-2xl" variant="card" />
      <Skeleton variant="chart" className="h-24" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Skeleton variant="card" className="h-96" />
        <Skeleton variant="chart" className="h-96 xl:col-span-2" />
      </div>
    </div>
  );
}
