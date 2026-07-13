import { AIWorkspacePage } from "@/components/ai-workspace/AIWorkspacePage";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <AIWorkspacePage initialQuery={q} />;
}
