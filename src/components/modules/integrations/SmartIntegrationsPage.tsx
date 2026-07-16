"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { IntegrationCard } from "./IntegrationCard";
import {
  IntegrationsHero,
  SmartSuggestionBanner,
  IntegrationSearch,
  CategoryTabs,
  ConnectionOverview,
} from "./IntegrationsSections";
import { useIntegrationsState } from "./useIntegrationsState";
import {
  integrationCategories,
  smartSuggestions,
  recommendedIds,
  getConnectionStats,
} from "@/mock/data/integrations";
import { toPersianDigits } from "@/lib/persian";
import { pageLabels } from "@/config/labels";
import type { IntegrationCategoryId } from "@/types/integration";

export function SmartIntegrationsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [suggestionIndex] = useState(0);

  const {
    integrations,
    runtime,
    toggleIntegration,
    enableIntegration,
  } = useIntegrationsState();

  const stats = useMemo(
    () => getConnectionStats(integrations, runtime),
    [integrations, runtime]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: integrations.length };
    for (const cat of integrationCategories) {
      if (cat.id === "all") continue;
      counts[cat.id] = integrations.filter((i) => i.category === cat.id).length;
    }
    return counts;
  }, [integrations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return integrations.filter((item) => {
      const matchesCategory =
        category === "all" ||
        item.category === (category as IntegrationCategoryId);
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.includes(q) ||
        item.signals.some((s) => s.includes(q)) ||
        item.actions.some((a) => a.includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [integrations, search, category]);

  const recommended = useMemo(
    () => filtered.filter((i) => recommendedIds.includes(i.id)),
    [filtered]
  );

  const rest = useMemo(
    () => filtered.filter((i) => !recommendedIds.includes(i.id)),
    [filtered]
  );

  return (
    <AppShell pageTitle={pageLabels.integrations}>
      <div className="relative min-h-full overflow-y-auto bg-machine bg-noise">
        <div className="relative px-6 py-8 md:px-10 md:py-10 max-w-[1200px] mx-auto">
          <IntegrationsHero
            totalCount={stats.total}
            enabledCount={stats.enabled}
            connectedCount={stats.connected}
          />

          <IntegrationSearch value={search} onChange={setSearch} />

          <SmartSuggestionBanner suggestion={smartSuggestions[suggestionIndex]} />

          <CategoryTabs
            categories={integrationCategories}
            active={category}
            onChange={setCategory}
            counts={categoryCounts}
          />

          {/* Recommended row */}
          {recommended.length > 0 && category === "all" && !search && (
            <section className="mb-10">
              <h2 className="text-[16px] font-semibold text-text-primary mb-4">
                پیشنهادهای هوشمند
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommended.map((item, i) => (
                  <IntegrationCard
                    key={item.id}
                    integration={item}
                    runtime={runtime[item.id]}
                    index={i}
                    featured
                    onToggle={() => toggleIntegration(item.id)}
                    onConnect={() => enableIntegration(item.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Main grid */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-semibold text-text-primary">
                {category === "all" && !search
                  ? "سایر اتصالات"
                  : category === "all"
                    ? "همه اتصالات"
                    : integrationCategories.find((c) => c.id === category)
                        ?.label}
              </h2>
              <span className="text-[13px] text-text-tertiary">
                {toPersianDigits(
                  category === "all" && !search ? rest.length : filtered.length
                )}{" "}
                سرویس
              </span>
            </div>

            {(category === "all" && !search ? rest : filtered).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(category === "all" && !search ? rest : filtered).map(
                  (item, i) => (
                    <IntegrationCard
                      key={item.id}
                      integration={item}
                      runtime={runtime[item.id]}
                      index={i}
                      onToggle={() => toggleIntegration(item.id)}
                      onConnect={() => enableIntegration(item.id)}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="rounded-[18px] border border-border bg-bg-elevated/60 p-10 text-center">
                <p className="text-[15px] font-medium text-text-primary">
                  اتصالی یافت نشد
                </p>
                <p className="mt-1.5 text-[13px] text-text-tertiary">
                  عبارت جستجو یا دسته‌بندی را تغییر دهید
                </p>
              </div>
            )}
          </section>

          <ConnectionOverview stats={stats} />
        </div>
      </div>
    </AppShell>
  );
}
