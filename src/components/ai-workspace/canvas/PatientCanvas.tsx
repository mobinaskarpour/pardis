"use client";

import { motion } from "framer-motion";
import { spring, stagger } from "@/lib/motion";
import { patientAhmadi } from "@/lib/ai-workspace-data";
import { cn } from "@/lib/utils";

export function PatientCanvas() {
  const patient = patientAhmadi;

  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Patient Header */}
      <motion.div
        variants={stagger.item}
        transition={spring.soft}
        className="rounded-[14px] border border-border bg-bg-elevated p-6"
      >
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-primary/10 text-[24px] font-semibold text-primary">
            {patient.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[28px] font-semibold text-text-primary">
              {patient.name}
            </h2>
            <p className="mt-1 text-[15px] text-text-secondary">
              پرونده {patient.caseNumber} · {patient.age} سال · {patient.gender}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-[6px] bg-success/10 px-2 py-0.5 text-[13px] text-success">
                {patient.status}
              </span>
              <span className="rounded-[6px] bg-primary/10 px-2 py-0.5 text-[13px] text-primary">
                {patient.doctor}
              </span>
              <span className="rounded-[6px] bg-bg-subtle px-2 py-0.5 text-[13px] text-text-secondary">
                {patient.specialty}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Summary */}
      <motion.div
        variants={stagger.item}
        transition={spring.soft}
        className="rounded-[14px] border border-border bg-bg-elevated p-5"
      >
        <p className="text-[13px] font-medium text-text-tertiary mb-2">
          AI Summary
        </p>
        <p className="text-[15px] text-text-primary leading-relaxed">
          {patient.aiSummary}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Timeline */}
        <motion.div
          variants={stagger.item}
          transition={spring.soft}
          className="rounded-[14px] border border-border bg-bg-elevated p-5"
        >
          <p className="text-[13px] font-medium text-text-tertiary mb-4">
            Medical Timeline
          </p>
          <div className="space-y-3">
            {patient.timeline.map((item) => (
              <div key={item.date + item.event} className="flex gap-3">
                <span className="text-[13px] text-text-tertiary shrink-0 w-20">
                  {item.date}
                </span>
                <span className="text-[15px] text-text-primary">{item.event}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* MRI Preview */}
        <motion.div
          variants={stagger.item}
          transition={spring.soft}
          className="rounded-[14px] border border-border bg-bg-elevated p-5"
        >
          <p className="text-[13px] font-medium text-text-tertiary mb-4">
            MRI Preview
          </p>
          <div className="space-y-3">
            {patient.mri.map((scan) => (
              <div
                key={scan.date + scan.type}
                className="flex items-center justify-between rounded-[10px] border border-border p-3"
              >
                <div>
                  <p className="text-[15px] font-medium text-text-primary">
                    {scan.type}
                  </p>
                  <p className="text-[13px] text-text-tertiary">
                    {scan.date} · {scan.device}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[13px] rounded-[6px] px-2 py-0.5",
                    scan.status === "نیاز به بررسی"
                      ? "bg-warning/10 text-warning"
                      : "bg-success/10 text-success"
                  )}
                >
                  {scan.status}
                </span>
              </div>
            ))}
          </div>
          {/* MRI visual placeholder */}
          <div className="mt-4 aspect-video rounded-[10px] bg-bg-subtle border border-border flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full border border-border-strong bg-gradient-to-br from-primary/5 to-primary/15" />
              <p className="mt-3 text-[13px] text-text-tertiary">MRI مغز — Preview</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Latest Report */}
      <motion.div
        variants={stagger.item}
        transition={spring.soft}
        className="rounded-[14px] border border-border bg-bg-elevated p-5"
      >
        <p className="text-[13px] font-medium text-text-tertiary mb-3">
          آخرین گزارش
        </p>
        {patient.reports[0] && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-medium text-text-primary">
                {patient.reports[0].title}
              </p>
              <p className="text-[13px] text-text-tertiary">
                {patient.reports[0].date}
              </p>
            </div>
            <span className="rounded-[6px] bg-warning/10 px-2 py-0.5 text-[13px] text-warning">
              {patient.reports[0].status}
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
