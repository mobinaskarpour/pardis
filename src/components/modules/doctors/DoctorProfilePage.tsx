"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { AIDock } from "@/components/modules/shared/ModuleShell";
import type { Doctor } from "@/types";
import { spring } from "@/lib/motion";
import { pageLabels, uiLabels } from "@/config/labels";

interface DoctorProfilePageProps {
  doctor: Doctor;
}

export function DoctorProfilePage({ doctor }: DoctorProfilePageProps) {
  return (
    <AppShell pageTitle={doctor.name}>
      <div className="h-full overflow-y-auto">
        <motion.section
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={spring.soft}
          className="border-b border-border px-6 py-10 md:px-10"
        >
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1 text-[13px] text-text-tertiary hover:text-text-secondary mb-6"
          >
            <ChevronLeft size={14} className="rotate-180" />
            {pageLabels.doctors}
          </Link>

          <h1 className="text-[36px] font-semibold text-text-primary">{doctor.name}</h1>
          <p className="text-[16px] text-text-secondary mt-1">{doctor.specialty}</p>
          <p className="text-[13px] text-text-tertiary mt-2">{doctor.schedule}</p>
        </motion.section>

        <div className="px-6 py-10 md:px-10 grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-10">
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "میانگین زمان گزارش", value: doctor.avgReportTime },
                { label: "رضایت", value: `${doctor.satisfaction}٪` },
                { label: "بار کاری", value: doctor.workload === "critical" ? "بحرانی" : doctor.workload === "busy" ? "فشرده" : "عادی" },
                { label: "بیماران", value: String(doctor.patients) },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[14px] border border-border p-4"
                >
                  <p className="text-[13px] text-text-tertiary">{stat.label}</p>
                  <p className="mt-1 text-[20px] font-semibold text-text-primary">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[14px] border border-border bg-bg-elevated p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-accent-indigo" />
                <span className="text-[13px] font-medium text-text-tertiary">
                  AI Analysis
                </span>
              </div>
              <p className="text-[15px] text-text-primary leading-relaxed">
                {doctor.aiInsight}
              </p>
            </div>

            <div>
              <h2 className="text-[20px] font-semibold mb-4">Performance</h2>
              <div className="h-24 rounded-[14px] border border-border bg-bg-subtle flex items-end justify-around px-4 pb-4 gap-2">
                {[72, 85, 78, 91, 88, 94, 90].map((v, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-[6px] bg-primary/30"
                    initial={{ height: 0 }}
                    animate={{ height: `${v}%` }}
                    transition={{ delay: 0.1 + i * 0.05, ...spring.soft }}
                  />
                ))}
              </div>
            </div>
          </div>

          <AIDock
            suggestions={[
              "توزیع بیماران",
              "برنامه فردا",
              "گزارش‌های اخیر",
              "مقایسه با میانگین",
            ]}
            quickActions={[{ label: uiLabels.aiWorkspace, href: "/chat" }]}
          />
        </div>
      </div>
    </AppShell>
  );
}
