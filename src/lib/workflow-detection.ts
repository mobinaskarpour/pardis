import type { Conversation, WorkflowSuggestion } from "@/types";
import type { Workflow } from "@/types/workflow";
import { buildOperationalSummaryDraft } from "@/mock/data/workflow-scenarios";
import {
  actionTypes,
  optionLabel,
  scheduleFrequencies,
} from "@/config/workflow-options";
import { toPersianDigits } from "@/lib/persian";

/** How many similar requests before the AI proposes a workflow */
const REPEAT_THRESHOLD = 3;

type PatternMatcher = {
  id: string;
  test: (text: string) => boolean;
  buildDraft: () => Workflow;
  reasonTemplate: (count: number) => string;
};

const patterns: PatternMatcher[] = [
  {
    id: "operational-summary",
    test: (t) =>
      /گزارش.*آماده|بیمار.*منتظر|درآمد.*امروز|پزشک.*تأخیر|تاخیر.*دارد/.test(t),
    buildDraft: buildOperationalSummaryDraft,
    reasonTemplate: (n) =>
      `این ${toPersianDigits(n)}مین بار در روزهای اخیر است که سوالات عملیاتی روزانه را می‌پرسید.`,
  },
  {
    id: "dose-report",
    test: (t) => {
      const s = t.trim().toLowerCase();
      return s.includes("دوز") && /گزارش|فیزیک|ارسال|بفرست/.test(s);
    },
    buildDraft: buildOperationalSummaryDraft,
    reasonTemplate: (n) =>
      `این ${toPersianDigits(n)}مین بار در روزهای اخیر است که گزارش عملیاتی را درخواست می‌کنید.`,
  },
];

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

function countPreviousMatches(
  conversations: Conversation[],
  test: (text: string) => boolean
): number {
  return conversations
    .flatMap((c) => c.messages)
    .filter((m) => m.role === "user" && test(m.content)).length;
}

/**
 * Detects whether the just-submitted query is a repeated task the user has
 * asked for several times before. Returns a suggestion payload or null.
 */
export function detectRepeatedTask(
  content: string,
  conversations: Conversation[],
  hasWorkflow: (id: string) => boolean
): { suggestion: WorkflowSuggestion; draft: Workflow } | null {
  for (const pattern of patterns) {
    if (!pattern.test(content)) continue;

    const draft = pattern.buildDraft();
    if (hasWorkflow(draft.id) && hasWorkflow("wf-ai-detected")) continue;

    const previous = countPreviousMatches(conversations, pattern.test);
    const total = previous + 1;
    if (total < REPEAT_THRESHOLD) continue;

    return {
      draft,
      suggestion: {
        status: "pending",
        reason:
          total >= 10
            ? `شما این فرآیند را ${toPersianDigits(total)} بار در ۱۰ روز گذشته تکرار کرده‌اید. آیا می‌خواهید THE MACHINE آن را خودکار کند؟`
            : pattern.reasonTemplate(total),
        workflowId: draft.id,
        workflowName: draft.name,
        dashboardName: `داشبورد ${draft.name}`,
        dashboardWidgets: draft.dashboardWidgets.map((w) => w.label),
        connectedSystems: draft.connectedSystems,
        triggerLabel: triggerLabelFor(draft),
        actionLabels: draft.actions.map((a) => optionLabel(actionTypes, a.type)),
        repeatCount: total,
      },
    };
  }

  return null;
}
