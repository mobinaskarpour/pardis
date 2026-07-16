"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Save,
  Upload,
  Sparkles,
  Play,
  History,
  Search,
  ZoomIn,
  ZoomOut,
  Moon,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SaveStatus } from "@/types/workflow-studio";
import type { Collaborator } from "@/types/workflow-studio";

interface StudioToolbarProps {
  name: string;
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  collaborators: Collaborator[];
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onPublish: () => void;
  onAIGenerate: () => void;
  onRunTest: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSearchNode: () => void;
  onOpenHistory: () => void;
}

const saveLabels: Record<SaveStatus, string> = {
  saved: "ذخیره‌شده",
  saving: "در حال ذخیره...",
  unsaved: "تغییرات ذخیره نشده",
};

export function StudioToolbar({
  name,
  saveStatus,
  canUndo,
  canRedo,
  zoom,
  collaborators,
  onUndo,
  onRedo,
  onSave,
  onPublish,
  onAIGenerate,
  onRunTest,
  onZoomIn,
  onZoomOut,
  onSearchNode,
  onOpenHistory,
}: StudioToolbarProps) {
  return (
    <header className="flex h-11 shrink-0 items-center gap-2 border-b border-border/60 bg-white/95 backdrop-blur-xl px-3">
      <Link
        href="/workflows"
        className="flex h-8 w-8 items-center justify-center rounded-[10px] text-text-tertiary hover:bg-bg-subtle hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
      </Link>

      <div className="h-5 w-px bg-border mx-1" />

      <div className="min-w-0 flex-1 flex items-center gap-3">
        <h1 className="text-[14px] font-semibold text-text-primary truncate max-w-[200px]">
          {name}
        </h1>
        <span
          className={cn(
            "text-[11px] font-medium px-2 py-0.5 rounded-full",
            saveStatus === "saved" && "bg-success/10 text-success",
            saveStatus === "saving" && "bg-accent-cyan/10 text-accent-cyan",
            saveStatus === "unsaved" && "bg-warning/10 text-warning"
          )}
        >
          {saveLabels[saveStatus]}
        </span>

        {/* Collaborators */}
        <div className="hidden lg:flex items-center gap-2 mr-2">
          {collaborators.map((c) => (
            <span
              key={c.id}
              className="flex items-center gap-1 text-[11px] text-text-tertiary"
            >
              <Circle
                size={8}
                fill={c.color}
                stroke="none"
              />
              {c.name}
              {c.role === "editing" && " در حال ویرایش..."}
              {c.role === "viewing" && " مشاهده می‌کند..."}
              {c.role === "reviewing" && " بررسی می‌کند..."}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <ToolbarBtn onClick={onUndo} disabled={!canUndo} title="Undo">
          <Undo2 size={15} strokeWidth={1.75} />
        </ToolbarBtn>
        <ToolbarBtn onClick={onRedo} disabled={!canRedo} title="Redo">
          <Redo2 size={15} strokeWidth={1.75} />
        </ToolbarBtn>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarBtn onClick={onSave} title="ذخیره">
          <Save size={15} strokeWidth={1.75} />
        </ToolbarBtn>
        <ToolbarBtn onClick={onPublish} title="انتشار">
          <Upload size={15} strokeWidth={1.75} />
        </ToolbarBtn>
        <div className="w-px h-5 bg-border mx-1" />
        <motion.button
          type="button"
          onClick={onAIGenerate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 rounded-[10px] bg-accent-indigo/12 border border-accent-indigo/20 px-3 py-1.5 text-[12px] font-medium text-accent-indigo cursor-pointer hover:bg-accent-indigo/18 transition-colors"
        >
          <Sparkles size={14} strokeWidth={1.75} />
          ساخت با AI
        </motion.button>
        <motion.button
          type="button"
          onClick={onRunTest}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 rounded-[10px] bg-primary px-3 py-1.5 text-[12px] font-medium text-white cursor-pointer hover:bg-primary-muted transition-colors mr-1"
        >
          <Play size={14} strokeWidth={1.75} fill="currentColor" />
          اجرای تست
        </motion.button>
      </div>

      <div className="hidden md:flex items-center gap-0.5 mr-2">
        <ToolbarBtn onClick={onSearchNode} title="جستجوی گره">
          <Search size={15} strokeWidth={1.75} />
        </ToolbarBtn>
        <ToolbarBtn onClick={onOpenHistory} title="تاریخچه نسخه">
          <History size={15} strokeWidth={1.75} />
        </ToolbarBtn>
        <ToolbarBtn onClick={onZoomOut} title="کوچک‌نمایی">
          <ZoomOut size={15} strokeWidth={1.75} />
        </ToolbarBtn>
        <span className="text-[11px] text-text-muted w-10 text-center tabular-nums">
          {Math.round(zoom * 100)}٪
        </span>
        <ToolbarBtn onClick={onZoomIn} title="بزرگ‌نمایی">
          <ZoomIn size={15} strokeWidth={1.75} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => {}} title="حالت تاریک">
          <Moon size={15} strokeWidth={1.75} />
        </ToolbarBtn>
      </div>

      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/12 text-[11px] font-semibold text-primary">
        م
      </div>
    </header>
  );
}

function ToolbarBtn({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-[8px] text-text-secondary",
        "hover:bg-bg-subtle hover:text-text-primary transition-colors cursor-pointer",
        disabled && "opacity-30 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}
