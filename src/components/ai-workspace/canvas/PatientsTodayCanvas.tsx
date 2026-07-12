"use client";

import { motion } from "framer-motion";
import { spring, stagger } from "@/lib/motion";
import { patientsToday } from "@/lib/ai-workspace-data";
import { cn } from "@/lib/utils";

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
      className="space-y-6"
    >
      <motion.div
        variants={stagger.item}
        transition={spring.soft}
        className="rounded-[14px] border border-border bg-bg-elevated p-6"
      >
        <p className="text-[13px] font-medium text-text-tertiary">بیماران امروز</p>
        <div className="mt-2 flex items-end gap-4">
          <span className="text-[40px] font-semibold leading-none text-text-primary">
            ۲۴
          </span>
          <div className="mb-1 space-y-0.5">
            <p className="text-[13px] text-text-secondary">۵ نفر در انتظار</p>
            <p className="text-[13px] text-text-secondary">۸ نفر منتظر تأیید</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={stagger.item}
        transition={spring.soft}
        className="rounded-[14px] border border-border bg-bg-elevated p-4"
      >
        <p className="text-[13px] font-medium text-text-tertiary mb-4 px-2">
          Patient Explorer
        </p>
        <div className="space-y-2">
          {patientsToday.map((patient, i) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06, ...spring.gentle }}
              whileHover={{ x: -2, transition: spring.gentle }}
              className="flex items-center justify-between rounded-[10px] border border-border p-4 transition-colors duration-[120ms] hover:border-border-hover cursor-default"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/10 text-[15px] font-medium text-primary">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[15px] font-medium text-text-primary">
                    {patient.name}
                  </p>
                  <p className="text-[13px] text-text-tertiary">
                    {patient.time} · {patient.type}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "text-[13px] rounded-[6px] px-2 py-0.5",
                  statusStyles[patient.status] ?? "bg-bg-subtle text-text-secondary"
                )}
              >
                {patient.status}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
