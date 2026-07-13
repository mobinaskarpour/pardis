"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { spring, stagger } from "@/lib/motion";
import { mriReady } from "@/lib/ai-workspace-data";
import { MediaPreview } from "@/components/core/MediaPreview";
import { cn } from "@/lib/utils";

export function MriReadyCanvas() {
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
        className="rounded-[var(--radius-xl)] glass-subtle p-6"
      >
        <p className="text-[var(--text-xs)] font-medium uppercase tracking-wider text-text-muted mb-2">
          آماده بررسی
        </p>
        <p className="text-[var(--text-body-lg)] font-medium text-text-primary leading-relaxed">
          {mriReady.length} تصویربرداری آماده بررسی هستند. پرونده ۲۱۴ — MRI مغز —
          اولویت فوری.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mriReady.map((item, i) => (
          <motion.div
            key={item.id}
            variants={stagger.item}
            transition={{ ...spring.soft, delay: i * 0.06 }}
            whileHover={{ y: -3, transition: spring.gentle }}
            className={cn(
              "rounded-[var(--radius-xl)] glass overflow-hidden transition-shadow hover:shadow-[var(--shadow-md)]",
              item.status === "آماده بررسی" && "ring-1 ring-warning/20"
            )}
          >
            <Link href={`/patients/${item.patientId}`}>
              <MediaPreview
                src={item.previewUrl ?? item.thumbnailUrl ?? "/media/imaging/mri-brain.svg"}
                alt={item.type}
                videoUrl={item.videoUrl}
                aspect="scan"
              />
              <div className="p-4">
                <p className="text-[var(--text-body)] font-medium text-text-primary">
                  {item.type}
                </p>
                <p className="text-[var(--text-sm)] text-text-tertiary mt-1">
                  {item.patient} · پرونده {item.caseNumber}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[var(--text-xs)] text-text-muted">
                    {item.time} · {item.device}
                  </span>
                  <span
                    className={cn(
                      "text-[var(--text-xs)] rounded-full px-2.5 py-1",
                      item.status === "آماده بررسی"
                        ? "bg-warning/10 text-warning"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
