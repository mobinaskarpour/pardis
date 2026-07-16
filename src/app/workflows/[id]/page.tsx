import { Suspense } from "react";
import { WorkflowDetailPage } from "@/components/modules/workflows/WorkflowDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">در حال بارگذاری…</div>}>
      <WorkflowDetailPage id={id} />
    </Suspense>
  );
}
