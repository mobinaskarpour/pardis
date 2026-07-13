import type { Conversation, WorkflowSuggestion } from "@/types";
import type { Workflow } from "@/types/workflow";
import { buildDoseReportDraft } from "@/mock/data/workflows";
import {
  actionTypes,
  optionLabel,
  scheduleFrequencies,
} from "@/config/workflow-options";
import { toPersianDigits } from "@/lib/persian";

/** How many similar requests before the AI proposes a workflow */
const REPEAT_THRESHOLD = 3;

function isDoseReportRequest(text: string): boolean {
  const t = text.trim().toLowerCase();
  return t.includes("دوز") && /گزارش|فیزیک|ارسال|بفرست/.test(t);
}

export function triggerLabelFor(wf: Workflow): string {
  if (wf.trigger.type === "schedule") {
    const freq = optionLabel(scheduleFrequencies, wf.trigger.frequency);
    return wf.trigger.time
      ? `${freq} — ساعت ${toPersianDigits(wf.trigger.time)}`
      : freq;
  }
  if (wf.trigger.type === "event") return "با وقوع رویداد";
  return "اجرای دستی";
}

/**
 * Detects whether the just-submitted query is a repeated task the user has
 * asked for several times before. Returns a suggestion payload (with the
 * draft workflow registered under `workflowId`) or null.
 */
export function detectRepeatedTask(
  content: string,
  conversations: Conversation[],
  hasWorkflow: (id: string) => boolean
): { suggestion: WorkflowSuggestion; draft: Workflow } | null {
  if (!isDoseReportRequest(content)) return null;

  const draft = buildDoseReportDraft();
  if (hasWorkflow(draft.id)) return null;

  const previous = conversations
    .flatMap((c) => c.messages)
    .filter((m) => m.role === "user" && isDoseReportRequest(m.content)).length;

  const total = previous + 1;
  if (total < REPEAT_THRESHOLD) return null;

  return {
    draft,
    suggestion: {
      status: "pending",
      reason: `این ${toPersianDigits(total)}مین بار در روزهای اخیر است که ارسال گزارش دوز را درخواست می‌کنید.`,
      workflowId: draft.id,
      workflowName: draft.name,
      triggerLabel: triggerLabelFor(draft),
      actionLabels: draft.actions.map((a) => optionLabel(actionTypes, a.type)),
    },
  };
}
