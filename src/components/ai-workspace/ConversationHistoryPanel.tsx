"use client";

import { useMemo } from "react";
import {
  Clock,
  Pin,
  PinOff,
  Search,
  Star,
  StarOff,
  Plus,
} from "lucide-react";
import type { Conversation } from "@/types/ai";
import {
  historyTimeGroupLabels,
  inferTimeGroup,
  pendingApprovals,
  recommendedWorkflows,
} from "@/mock/data/chat-experience";
import { cn } from "@/lib/utils";

interface ConversationHistoryPanelProps {
  conversations: Conversation[];
  activeId: string | null;
  search: string;
  onSearchChange: (v: string) => void;
  onSelect: (id: string) => void;
  onNew: () => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function ConversationHistoryPanel({
  conversations,
  activeId,
  search,
  onSearchChange,
  onSelect,
  onNew,
  onTogglePin,
  onToggleFavorite,
}: ConversationHistoryPanelProps) {
  const grouped = useMemo(() => {
    const filtered = conversations.filter(
      (c) =>
        !search ||
        c.title.includes(search) ||
        c.preview.includes(search)
    );

    const pinned = filtered.filter((c) => c.pinned);
    const rest = filtered.filter((c) => !c.pinned);

    const groups: Record<string, Conversation[]> = {
      pinned: pinned,
      today: [],
      yesterday: [],
      week: [],
      earlier: [],
    };

    for (const c of rest) {
      const g = c.timeGroup ?? inferTimeGroup(c.updatedAt);
      groups[g].push(c);
    }

    return groups;
  }, [conversations, search]);

  const renderConv = (conv: Conversation) => (
    <button
      key={conv.id}
      type="button"
      onClick={() => onSelect(conv.id)}
      className={cn(
        "group w-full rounded-[12px] px-3 py-2.5 text-start transition-colors",
        activeId === conv.id
          ? "bg-primary/10 text-primary"
          : "hover:bg-bg-subtle/80 text-text-secondary"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">{conv.title}</p>
          <p className="truncate text-[11px] text-text-muted mt-0.5">
            {conv.preview}
          </p>
        </div>
        <div className="flex shrink-0 gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(conv.id);
            }}
            className="p-1 rounded-md hover:bg-white/80"
            aria-label="سنجاق"
          >
            {conv.pinned ? (
              <PinOff size={12} className="text-primary" />
            ) : (
              <Pin size={12} className="text-text-muted" />
            )}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(conv.id);
            }}
            className="p-1 rounded-md hover:bg-white/80"
            aria-label="علاقه‌مندی"
          >
            {conv.favorite ? (
              <StarOff size={12} className="text-warning" />
            ) : (
              <Star size={12} className="text-text-muted" />
            )}
          </button>
        </div>
      </div>
    </button>
  );

  return (
    <aside className="hidden lg:flex w-[280px] shrink-0 flex-col border-s border-border/60 bg-white h-full">
      <div className="p-4 border-b border-border/50">
        <button
          type="button"
          onClick={onNew}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-[12px]",
            "bg-primary px-4 py-2.5 text-[13px] font-semibold text-white",
            "shadow-[0_4px_14px_rgba(45,90,123,0.25)] hover:bg-primary-muted transition-colors"
          )}
        >
          <Plus size={16} strokeWidth={2} />
          گفتگوی جدید
        </button>

        <div className="relative mt-3">
          <Search
            size={14}
            className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو در تاریخچه..."
            className="w-full rounded-[10px] border border-border/60 bg-[#f6f7f9] py-2.5 ps-9 pe-3 text-[12px] outline-none focus:border-primary/30 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-none">
        {grouped.pinned.length > 0 && (
          <section>
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Pin size={10} /> سنجاق‌شده
            </p>
            <div className="space-y-0.5">{grouped.pinned.map(renderConv)}</div>
          </section>
        )}

        {(["today", "yesterday", "week", "earlier"] as const).map((key) =>
          grouped[key].length > 0 ? (
            <section key={key}>
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Clock size={10} /> {historyTimeGroupLabels[key]}
              </p>
              <div className="space-y-0.5">{grouped[key].map(renderConv)}</div>
            </section>
          ) : null
        )}
      </div>

      <div className="shrink-0 border-t border-border/50 p-4">
        <div className="rounded-[14px] border border-border/60 bg-[#fafbfc] p-3.5">
          <p className="text-[10px] font-bold text-text-muted mb-2">
            تأییدهای معلق
          </p>
          {pendingApprovals.map((a) => (
            <p key={a.id} className="text-[11px] text-text-tertiary py-0.5">
              · {a.label}
            </p>
          ))}
          <p className="text-[10px] font-bold text-text-muted mt-3 mb-2">
            گردش‌کار پیشنهادی
          </p>
          {recommendedWorkflows.map((w) => (
            <p key={w.id} className="text-[11px] text-text-tertiary py-0.5">
              · {w.name}
            </p>
          ))}
        </div>
      </div>
    </aside>
  );
}
