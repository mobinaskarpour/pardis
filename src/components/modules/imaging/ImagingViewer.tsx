"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw, Layers } from "lucide-react";
import type { ImagingStudy } from "@/types/imaging";
import { spring, chartForm } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";
import { uiLabels } from "@/config/labels";

interface ImagingViewerProps {
  study: ImagingStudy;
}

/** Mock DICOM viewer — lazy-loaded in parent */
export function ImagingViewer({ study }: ImagingViewerProps) {
  const [activeSeries, setActiveSeries] = useState(study.series[0]?.id ?? "");
  const [slice, setSlice] = useState(12);
  const active = study.series.find((s) => s.id === activeSeries) ?? study.series[0];
  const maxSlice = active?.sliceCount ?? 24;

  return (
    <div className="rounded-[14px] border border-border bg-bg-dark overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-border-strong px-4 py-2.5 bg-bg-dark-elevated">
        <p className="text-[13px] font-medium text-text-inverse truncate">
          {uiLabels.imagingViewer} · {study.modality} {study.bodyPart}
        </p>
        <div className="flex items-center gap-1">
          {[ZoomIn, ZoomOut, RotateCcw, Layers].map((Icon, i) => (
            <button
              key={i}
              type="button"
              aria-label="ابزار نمایشگر"
              className="flex h-8 w-8 items-center justify-center rounded-[6px] text-text-tertiary hover:text-text-inverse hover:bg-bg-subtle/20 transition-colors duration-[120ms] cursor-pointer"
            >
              <Icon size={16} strokeWidth={1.75} />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_120px]">
        {/* Viewport */}
        <div className="relative aspect-[4/3] bg-[#080a0c]">
          <motion.div
            key={`${study.id}-${activeSeries}-${slice}`}
            initial={{ opacity: 0.5, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={chartForm(0.1)}
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_45%,#3d4f5c_0%,#1a2228_45%,#080a0c_100%)]"
          />
          {/* Crosshair */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/20" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20" />
          </div>
          {/* AI overlay marker */}
          {study.aiAnalysis.urgency !== "normal" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={spring.soft}
              className="absolute top-[38%] right-[42%] h-10 w-10 rounded-full border-2 border-warning/60 bg-warning/10"
            />
          )}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-[11px] text-text-tertiary font-mono">
            <span>{active?.label}</span>
            <span>
              {toPersianDigits(slice)} / {toPersianDigits(maxSlice)}
            </span>
          </div>
        </div>

        {/* Series thumbnails */}
        <div className="border-t lg:border-t-0 lg:border-r border-border-strong p-2 space-y-2 bg-bg-dark-elevated">
          <p className="text-[11px] text-text-tertiary px-1">{uiLabels.series}</p>
          {study.series.map((series) => (
            <button
              key={series.id}
              type="button"
              onClick={() => {
                setActiveSeries(series.id);
                setSlice(Math.floor(series.sliceCount / 2));
              }}
              className={cn(
                "w-full rounded-[6px] border p-1.5 text-right transition-colors duration-[120ms] cursor-pointer",
                activeSeries === series.id
                  ? "border-primary/50 bg-primary/10"
                  : "border-border-strong hover:border-border-hover"
              )}
            >
              <div className="aspect-square rounded-[4px] bg-[radial-gradient(circle_at_center,#2a3540,#0a0c0e)] mb-1" />
              <p className="text-[10px] text-text-tertiary truncate">{series.label}</p>
              <p className="text-[10px] text-text-tertiary">
                {toPersianDigits(series.sliceCount)} برش
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Slice scrubber */}
      <div className="px-4 py-3 border-t border-border-strong bg-bg-dark-elevated">
        <label className="text-[11px] text-text-tertiary mb-1 block">
          برش {toPersianDigits(slice)}
        </label>
        <input
          type="range"
          min={1}
          max={maxSlice}
          value={slice}
          onChange={(e) => setSlice(Number(e.target.value))}
          className="w-full accent-primary h-1 cursor-pointer"
          aria-label="انتخاب برش تصویر"
        />
      </div>
    </div>
  );
}
