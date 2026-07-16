import { WorkflowStudioPage } from "@/components/modules/workflow-studio/WorkflowStudioPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkflowStudioPage id={id} />;
}
