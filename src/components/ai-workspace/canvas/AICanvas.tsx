"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CanvasType } from "@/lib/ai-workspace-data";
import { spring } from "@/lib/motion";
import { PatientCanvas } from "./PatientCanvas";
import { RevenueCanvas } from "./RevenueCanvas";
import { PatientsTodayCanvas } from "./PatientsTodayCanvas";
import { MriReadyCanvas } from "./MriReadyCanvas";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { ReportCanvas } from "./ReportCanvas";
import { WelcomeCanvas } from "./WelcomeCanvas";

interface AICanvasProps {
  canvas: CanvasType;
  onSuggestionClick: (suggestion: string) => void;
}

export function AICanvas({ canvas, onSuggestionClick }: AICanvasProps) {
  return (
    <div className="overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={canvas}
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={spring.soft}
        >
          {canvas === "welcome" && (
            <WelcomeCanvas onSuggestionClick={onSuggestionClick} />
          )}
          {canvas === "patient" && <PatientCanvas />}
          {canvas === "revenue" && <RevenueCanvas />}
          {canvas === "patients-today" && <PatientsTodayCanvas />}
          {canvas === "mri-ready" && <MriReadyCanvas />}
          {canvas === "workflow" && <WorkflowCanvas />}
          {canvas === "report" && <ReportCanvas />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
