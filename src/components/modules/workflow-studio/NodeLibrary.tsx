"use client";

import { useMemo, useState } from "react";
import { Search, GripVertical } from "lucide-react";
import { nodeCategories, nodeDefinitions } from "@/config/workflow-nodes";
import { cn } from "@/lib/utils";
import type { NodeCategory } from "@/types/workflow-studio";

interface NodeLibraryProps {
  onAddNode: (defId: string) => void;
}

export function NodeLibrary({ onAddNode }: NodeLibraryProps) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<NodeCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = search.trim();
    return nodeDefinitions.filter((n) => {
      const matchSearch =
        !q || n.title.includes(q) || n.description.includes(q);
      const matchCat = expanded === "all" || n.category === expanded;
      return matchSearch && matchCat;
    });
  }, [search, expanded]);

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-l border-border/60 bg-white/95 backdrop-blur-xl">
      <div className="px-3 py-3 border-b border-border/50">
        <p className="text-[12px] font-semibold text-text-primary mb-2">
          کتابخانه گره‌ها
        </p>
        <div className="relative">
          <Search
            size={13}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو..."
            className="w-full rounded-[10px] border border-border/80 bg-[#f8f9fa] py-1.5 pr-8 pl-2.5 text-[11px] focus:outline-none focus:border-primary/30"
          />
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto p-2 scrollbar-none border-b border-border/40">
        <CatPill active={expanded === "all"} onClick={() => setExpanded("all")} label="همه" />
        {nodeCategories.map((c) => (
          <CatPill
            key={c.id}
            active={expanded === c.id}
            onClick={() => setExpanded(c.id)}
            label={c.emoji}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 scrollbar-none">
        {filtered.map((node) => (
          <div
            key={node.id}
            draggable
            onClick={() => onAddNode(node.id)}
            onDragStart={(e) => e.dataTransfer.setData("node-def", node.id)}
            className="group flex items-center gap-2 rounded-[10px] p-2 hover:bg-[#f4f5f7] transition-colors cursor-grab active:cursor-grabbing"
          >
            <GripVertical
              size={11}
              className="text-text-muted/0 group-hover:text-text-muted shrink-0 transition-colors"
            />
            <div
              className="h-7 w-7 shrink-0 rounded-[8px] flex items-center justify-center text-[12px]"
              style={{ background: `${node.color}14` }}
            >
              {nodeCategories.find((c) => c.id === node.category)?.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-text-primary truncate">
                {node.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function CatPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors cursor-pointer",
        active
          ? "bg-primary text-white"
          : "bg-[#f4f5f7] text-text-secondary hover:bg-bg-subtle"
      )}
    >
      {label}
    </button>
  );
}
