import { WorkflowEditorPage } from "@/components/modules/workflows/WorkflowEditorPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkflowEditorPage id={id} />;
}
