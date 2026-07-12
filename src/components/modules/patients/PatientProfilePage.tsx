"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Calendar,
  FileText,
  Scan,
  Wallet,
  StickyNote,
  ChevronLeft,
} from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { AIDock } from "@/components/modules/shared/ModuleShell";
import type { PatientListItem } from "@/types";
import { findDoctorByName } from "@/mock/data/doctors";
import { spring, stagger } from "@/lib/motion";
import { pageLabels, uiLabels } from "@/config/labels";

interface PatientProfilePageProps {
  patient: PatientListItem;
}

function getDoctorId(name: string): string | null {
  const doc = findDoctorByName(name);
  return doc?.id ?? null;
}

export function PatientProfilePage({ patient }: PatientProfilePageProps) {
  const doctorId = getDoctorId(patient.doctor);

  return (
    <AppShell pageTitle={patient.name}>
      <div className="h-full overflow-y-auto">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={spring.hero}
          className="border-b border-border bg-bg-elevated/40 px-6 py-10 md:px-10 md:py-14"
        >
          <Link
            href="/patients"
            className="inline-flex items-center gap-1 text-[13px] text-text-tertiary hover:text-text-secondary mb-6 transition-colors"
          >
            <ChevronLeft size={14} className="rotate-180" />
            {pageLabels.patients}
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[18px] bg-primary/10 text-[36px] font-semibold text-primary">
              {patient.name.charAt(0)}
            </div>

            <div className="flex-1">
              <h1 className="text-[40px] font-semibold text-text-primary leading-tight">
                {patient.name}
              </h1>
              <p className="mt-2 text-[16px] text-text-secondary">
                پرونده {patient.caseNumber} · {patient.age} سال · {patient.gender}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-[6px] bg-success/10 px-2.5 py-1 text-[13px] text-success">
                  {patient.status}
                </span>
                {doctorId ? (
                  <Link
                    href={`/doctors/${doctorId}`}
                    className="rounded-[6px] bg-primary/10 px-2.5 py-1 text-[13px] text-primary hover:bg-primary/15 transition-colors"
                  >
                    {patient.doctor}
                  </Link>
                ) : (
                  <span className="rounded-[6px] bg-primary/10 px-2.5 py-1 text-[13px] text-primary">
                    {patient.doctor}
                  </span>
                )}
                <span className="rounded-[6px] bg-bg-subtle px-2.5 py-1 text-[13px] text-text-secondary">
                  {patient.specialty}
                </span>
              </div>

              <div className="mt-6 rounded-[14px] border border-border bg-bg-elevated p-5 max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-accent-indigo" />
                  <span className="text-[13px] font-medium text-text-tertiary">
                    AI Summary
                  </span>
                </div>
                <p className="text-[15px] text-text-primary leading-relaxed">
                  {patient.aiSummary}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Content sections */}
        <div className="px-6 py-10 md:px-10 grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-10">
          <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-10"
          >
            {/* Timeline */}
            <Section icon={Calendar} title="Timeline">
              <div className="space-y-4">
                {patient.timeline.map((item) => (
                  <div
                    key={item.date + item.event}
                    className="flex gap-4 rounded-[10px] border border-border p-4"
                  >
                    <span className="text-[13px] text-text-tertiary w-24 shrink-0">
                      {item.date}
                    </span>
                    <span className="text-[15px] text-text-primary">{item.event}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Medical Imaging */}
            <Section icon={Scan} title="Medical Imaging">
              {patient.mri.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patient.mri.map((scan) => (
                    <div
                      key={scan.date + scan.type}
                      className="rounded-[14px] border border-border overflow-hidden"
                    >
                      <div className="aspect-video bg-bg-subtle flex items-center justify-center border-b border-border">
                        <div className="h-20 w-20 rounded-full border border-border-strong bg-gradient-to-br from-primary/5 to-primary/15" />
                      </div>
                      <div className="p-4">
                        <p className="text-[15px] font-medium">{scan.type}</p>
                        <p className="text-[13px] text-text-tertiary mt-1">
                          {scan.date} · {scan.device}
                        </p>
                        <span className="inline-block mt-2 text-[13px] rounded-[6px] bg-warning/10 text-warning px-2 py-0.5">
                          {scan.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[15px] text-text-secondary">
                  MRI ثبت نشده. AI پیشنهاد: سونوگرافی در پرونده موجود است.
                </p>
              )}
            </Section>

            {/* Reports */}
            <Section icon={FileText} title="Reports">
              <div className="space-y-3">
                {patient.reports.map((report) => (
                  <div
                    key={report.date + report.title}
                    className="flex items-center justify-between rounded-[10px] border border-border p-4"
                  >
                    <div>
                      <p className="text-[15px] font-medium">{report.title}</p>
                      <p className="text-[13px] text-text-tertiary">{report.date}</p>
                    </div>
                    <span className="text-[13px] rounded-[6px] bg-bg-subtle px-2 py-0.5">
                      {report.status}
                    </span>
                  </div>
                ))}
                {patient.reports.length === 0 && (
                  <p className="text-[15px] text-text-secondary">گزارشی ثبت نشده.</p>
                )}
              </div>
            </Section>

            {/* Financial */}
            <Section icon={Wallet} title="Financial">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Stat label="وضعیت" value={patient.financialStatus === "paid" ? "پرداخت شده" : patient.financialStatus === "pending" ? "در انتظار" : "جزئی"} />
                <Stat label="بیمه" value={patient.insurance ?? "—"} />
                <Stat label="تماس" value={patient.phone ?? "—"} />
              </div>
            </Section>

            {/* Notes */}
            <Section icon={StickyNote} title="Notes">
              <p className="text-[15px] text-text-secondary leading-relaxed">
                یادداشت پزشک: پیگیری MRI در ۲ هفته. بیمار از سابقه میگرن مطلع شده.
              </p>
            </Section>
          </motion.div>

          <AIDock
            suggestions={[
              "سوابق این بیمار",
              "آخرین MRI",
              "هزینه درمان",
              "ثبت پیگیری",
              "ارسال به AI",
            ]}
            quickActions={[
              { label: uiLabels.aiWorkspace, href: "/chat" },
              { label: "ثبت Workflow" },
            ]}
          />
        </div>
      </div>
    </AppShell>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Calendar;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section variants={stagger.item} transition={spring.soft}>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} strokeWidth={1.75} className="text-text-tertiary" />
        <h2 className="text-[20px] font-semibold text-text-primary">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-border p-4">
      <p className="text-[13px] text-text-tertiary">{label}</p>
      <p className="mt-1 text-[15px] font-medium text-text-primary">{value}</p>
    </div>
  );
}
