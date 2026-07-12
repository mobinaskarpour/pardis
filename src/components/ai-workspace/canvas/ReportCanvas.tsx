"use client";

import { motion } from "framer-motion";
import { spring, stagger } from "@/lib/motion";

const openReports = [
  { id: "1", title: "گزارش MRI مغز", patient: "محمد احمدی", case: "۲۱۴", priority: "فوری" },
  { id: "2", title: "گزارش CT شکم", patient: "علی محمدی", case: "۱۹۸", priority: "عادی" },
  { id: "3", title: "گزارش سونوگرافی", patient: "مریم کریمی", case: "۱۷۶", priority: "فوری" },
];

export function ReportCanvas() {
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
        <p className="text-[13px] font-medium text-text-tertiary">پرونده‌های باز</p>
        <div className="mt-2 flex items-end gap-4">
          <span className="text-[40px] font-semibold leading-none text-text-primary">
            ۷
          </span>
          <p className="mb-1 text-[13px] text-warning">۳ گزارش فوری</p>
        </div>
      </motion.div>

      <motion.div
        variants={stagger.item}
        transition={spring.soft}
        className="space-y-2"
      >
        {openReports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, ...spring.gentle }}
            whileHover={{ y: -2, transition: spring.gentle }}
            className="rounded-[10px] border border-border bg-bg-elevated p-4 transition-colors duration-[120ms] hover:border-border-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] font-medium text-text-primary">
                  {report.title}
                </p>
                <p className="text-[13px] text-text-tertiary mt-0.5">
                  {report.patient} · پرونده {report.case}
                </p>
              </div>
              <span
                className={`text-[13px] rounded-[6px] px-2 py-0.5 ${
                  report.priority === "فوری"
                    ? "bg-warning/10 text-warning"
                    : "bg-bg-subtle text-text-secondary"
                }`}
              >
                {report.priority}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
