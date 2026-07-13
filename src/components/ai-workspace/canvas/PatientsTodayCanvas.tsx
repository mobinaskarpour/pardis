"use client";

import { motion } from "framer-motion";
import { spring, stagger } from "@/lib/motion";
import { patientsToday } from "@/lib/ai-workspace-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  "در انتظار": "bg-warning/10 text-warning",
  "تأیید شده": "bg-success/10 text-success",
  "در حال انجام": "bg-primary/10 text-primary",
  "زمان‌بندی شده": "bg-bg-subtle text-text-secondary",
};

export function PatientsTodayCanvas() {
  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className="space-y-5"
    >
      {/* Narrative header — not KPI */}
      <motion.div
        variants={stagger.item}
        transition={spring.soft}
        className="rounded-[var(--radius-xl)] glass-subtle p-6"
      >
        <p className="text-[var(--text-xs)] font-medium uppercase tracking-wider text-text-muted mb-2">
          امروز
        </p>
        <p className="text-[var(--text-body-lg)] font-medium text-text-primary leading-relaxed">
          ۲۴ بیمار مراجعه کرده‌اند. ۵ نفر در انتظار و ۸ نفر منتظر تأیید پزشک
          هستند.
        </p>
      </motion.div>

      {/* Patient journey list */}
      <motion.div variants={stagger.item} transition={spring.soft}>
        <p className="text-[var(--text-sm)] font-medium text-text-muted mb-3 px-1">
          مسیر بیماران
        </p>
        <div className="space-y-2">
          {patientsToday.map((patient, i) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05, ...spring.gentle }}
            >
              <Link
                href={`/patients/${patient.id}`}
                className="flex items-center justify-between rounded-[var(--radius-lg)] glass-subtle p-4 transition-all hover:shadow-[var(--shadow-sm)] group"
              >
                <div className="flex items-center gap-3">
                  {"thumbnailUrl" in patient && patient.thumbnailUrl ? (
                    <img
                      src={patient.thumbnailUrl as string}
                      alt=""
                      className="h-11 w-11 rounded-[var(--radius-md)] object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-primary/10 text-[var(--text-body)] font-medium text-primary">
                      {patient.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-[var(--text-body)] font-medium text-text-primary group-hover:text-primary transition-colors">
                      {patient.name}
                    </p>
                    <p className="text-[var(--text-sm)] text-text-tertiary">
                      {patient.time} · {patient.type}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[var(--text-xs)] rounded-full px-2.5 py-1",
                    statusStyles[patient.status] ?? "bg-bg-subtle text-text-secondary"
                  )}
                >
                  {patient.status}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
