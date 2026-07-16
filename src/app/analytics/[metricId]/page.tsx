import { AnalyticsDetailPage } from "@/components/modules/analytics/AnalyticsDetailPage";

interface PageProps {
  params: Promise<{ metricId: string }>;
}

export default async function AnalyticsMetricPage({ params }: PageProps) {
  const { metricId } = await params;
  return <AnalyticsDetailPage metricId={metricId} />;
}
