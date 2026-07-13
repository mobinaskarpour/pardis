"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Calendar,
  FileText,
  Scan,
  Wallet,
  ChevronLeft,
  ArrowUpRight,
  Clock,
  Heart,
} from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { CommandInput } from "@/components/command-center/CommandInput";
import { MediaPreview } from "@/components/core/MediaPreview";
import type { PatientListItem } from "@/types";
import { findDoctorByName } from "@/mock/data/doctors";
import { spring, stagger } from "@/lib/motion";
import { pageLabels } from "@/config/labels";
import { getSuggestionsByCategory } from "@/mock/data/command-suggestions";
import { cn } from "@/lib/utils";

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
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={spring.hero}
        className="relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 0%, var(--primary-glow) 0%, transparent 60%)",
          }}
        />

        <div className="relative px-6 py-10 md:px-12 md:py-16">
          <Link
            href="/patients"
            className="inline-flex items-center gap-1 text-[var(--text-sm)] text-text-tertiary hover:text-text-secondary mb-8 transition-colors"
          >
            <ChevronLeft size={14} className="rotate-180" />
            {pageLabels.patients}
          </Link>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, ...spring.hero }}
              className="relative"
            >
              {patient.avatarUrl ? (
                <img
                  src={patient.avatarUrl}
                  alt={patient.name}
                  className="h-28 w-28 rounded-[var(--radius-2xl)] object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-[var(--radius-2xl)] bg-primary/10 text-[48px] font-semibold text-primary">
                  {patient.name.charAt(0)}
                </div>
              )}
              <div className="absolute -bottom-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full glass">
                <Heart size={14} className="text-success" />
              </div>
            </motion.div>

            <div className="flex-1 min-w-0">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, ...spring.hero }}
                className="text-heading-xl md:text-hero text-text-primary"
              >
                {patient.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, ...spring.soft }}
                className="mt-3 text-[var(--text-body-lg)] text-text-secondary"
              >
                پرونده {patient.caseNumber} · {patient.age} سال · {patient.gender}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, ...spring.soft }}
                className="mt-5 flex flex-wrap gap-2"
              >
                <StatusPill tone="success">{patient.status}</StatusPill>
                {doctorId ? (
                  <Link href={`/doctors/${doctorId}`}>
                    <StatusPill tone="primary" interactive>
                      {patient.doctor}
                    </StatusPill>
                  </Link>
                ) : (
                  <StatusPill tone="primary">{patient.doctor}</StatusPill>
                )}
                <StatusPill tone="neutral">{patient.specialty}</StatusPill>
              </motion.div>
            </div>
          </div>

          {/* AI Summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, ...spring.soft }}
            className="mt-10 rounded-[var(--radius-2xl)] glass p-6 md:p-8 max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-accent-indigo" />
              <span className="text-[var(--text-sm)] font-medium text-text-muted">
                خلاصه هوش مصنوعی
              </span>
            </div>
            <p className="text-[var(--text-body-lg)] text-text-primary leading-relaxed">
              {patient.aiSummary}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Content */}
      <div className="px-6 py-10 md:px-12 md:py-14">
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-5xl space-y-10"
        >
          {/* Medical Timeline */}
          <Section variants={stagger.item} icon={Calendar} title="مسیر درمانی">
            <div className="relative">
              <div className="absolute top-3 bottom-3 right-[19px] w-px bg-border-strong" />
              <div className="space-y-1">
                {patient.timeline.map((item, i) => (
                  <motion.div
                    key={item.date + item.event}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, ...spring.gentle }}
                    className="flex gap-4 py-3 group"
                  >
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary/10">
                      <Clock size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 rounded-[var(--radius-lg)] glass-subtle p-4 transition-shadow group-hover:shadow-[var(--shadow-sm)]">
                      <div className="flex items-baseline gap-3">
                        <span className="text-[var(--text-sm)] text-text-muted tabular-nums">
                          {item.date}
                        </span>
                        <span className="text-[var(--text-body)] font-medium text-text-primary">
                          {item.event}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>

          {/* Imaging */}
          <Section variants={stagger.item} icon={Scan} title="تصویربرداری">
            {patient.mri.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patient.mri.map((scan) => (
                  <div
                    key={scan.date + scan.type}
                    className="group rounded-[var(--radius-xl)] glass overflow-hidden transition-shadow hover:shadow-[var(--shadow-md)]"
                  >
                    <MediaPreview
                      src={scan.previewUrl ?? scan.thumbnailUrl ?? "/media/imaging/mri-brain.svg"}
                      alt={scan.type}
                      videoUrl={scan.videoUrl}
                      aspect="scan"
                    />
                    <div className="p-5">
                      <p className="text-[var(--text-body-lg)] font-medium text-text-primary">
                        {scan.type}
                      </p>
                      <p className="mt-1 text-[var(--text-sm)] text-text-tertiary">
                        {scan.date} · {scan.device}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--text-body)] text-text-secondary rounded-[var(--radius-xl)] glass-subtle p-6">
                MRI ثبت نشده — سونوگرافی در پرونده موجود است.
              </p>
            )}
          </Section>

          {/* Reports + Financial row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section variants={stagger.item} icon={FileText} title="گزارش‌ها">
              <div className="space-y-2">
                {patient.reports.map((report) => (
                  <div
                    key={report.date + report.title}
                    className="flex items-center justify-between rounded-[var(--radius-lg)] glass-subtle p-4 group hover:shadow-[var(--shadow-sm)] transition-shadow"
                  >
                    <div>
                      <p className="text-[var(--text-body)] font-medium text-text-primary">
                        {report.title}
                      </p>
                      <p className="text-[var(--text-sm)] text-text-tertiary">
                        {report.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-xs)] rounded-full bg-bg-subtle px-2.5 py-1 text-text-secondary">
                        {report.status}
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                ))}
                {patient.reports.length === 0 && (
                  <p className="text-[var(--text-body)] text-text-secondary">
                    گزارشی ثبت نشده.
                  </p>
                )}
              </div>
            </Section>

            <Section variants={stagger.item} icon={Wallet} title="مالی">
              <div className="rounded-[var(--radius-xl)] glass-subtle p-6 space-y-4">
                <FinancialRow
                  label="وضعیت پرداخت"
                  value={
                    patient.financialStatus === "paid"
                      ? "پرداخت شده"
                      : patient.financialStatus === "pending"
                        ? "در انتظار"
                        : "جزئی"
                  }
                  highlight
                />
                <FinancialRow label="بیمه" value={patient.insurance ?? "—"} />
                <FinancialRow label="تماس" value={patient.phone ?? "—"} />
              </div>
            </Section>
          </div>

          {/* Documents */}
          {patient.documents && patient.documents.length > 0 && (
            <Section variants={stagger.item} icon={FileText} title="اسناد و مدارک">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {patient.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 rounded-[var(--radius-lg)] glass-subtle p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-primary/10">
                      <FileText size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[var(--text-body)] font-medium text-text-primary">
                        {doc.title}
                      </p>
                      <p className="text-[var(--text-sm)] text-text-tertiary">
                        {doc.date} · {doc.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Suggested actions */}
          <motion.div variants={stagger.item} transition={spring.soft}>
            <p className="text-[var(--text-sm)] font-medium text-text-muted mb-4">
              اقدامات پیشنهادی
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "سوابق این بیمار",
                "آخرین MRI",
                "هزینه درمان",
                "ثبت پیگیری",
                "ساخت گزارش",
              ].map((action) => (
                <button
                  key={action}
                  type="button"
                  className="rounded-full glass-subtle px-4 py-2.5 text-[var(--text-sm)] text-text-secondary hover:text-text-primary transition-all hover:shadow-[var(--shadow-sm)] cursor-pointer"
                >
                  {action}
                </button>
              ))}
            </div>
          </motion.div>

          {/* AI command */}
          <motion.div variants={stagger.item} transition={spring.soft}>
            <CommandInput
              onSubmit={() => {}}
              suggestions={[
                ...getSuggestionsByCategory("clinical").slice(0, 2),
                ...getSuggestionsByCategory("imaging").slice(0, 2),
                ...getSuggestionsByCategory("ai").slice(0, 2),
              ]}
              autoFocus={false}
            />
          </motion.div>
        </motion.div>
      </div>
    </AppShell>
  );
}

function Section({
  icon: Icon,
  title,
  children,
  variants,
}: {
  icon: typeof Calendar;
  title: string;
  children: React.ReactNode;
  variants?: typeof stagger.item;
}) {
  return (
    <motion.section variants={variants} transition={spring.soft}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-bg-subtle">
          <Icon size={16} strokeWidth={1.75} className="text-text-tertiary" />
        </div>
        <h2 className="text-[var(--text-heading-sm)] font-semibold text-text-primary">
          {title}
        </h2>
      </div>
      {children}
    </motion.section>
  );
}

function StatusPill({
  children,
  tone,
  interactive,
}: {
  children: React.ReactNode;
  tone: "success" | "primary" | "neutral";
  interactive?: boolean;
}) {
  const styles = {
    success: "bg-success/10 text-success",
    primary: "bg-primary/10 text-primary",
    neutral: "bg-bg-subtle text-text-secondary",
  };

  const Tag = interactive ? "span" : "span";
  return (
    <Tag
      className={cn(
        "inline-flex rounded-full px-3.5 py-1.5 text-[var(--text-sm)] font-medium transition-colors",
        styles[tone],
        interactive && "hover:bg-primary/15 cursor-pointer"
      )}
    >
      {children}
    </Tag>
  );
}

function FinancialRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--text-sm)] text-text-tertiary">{label}</span>
      <span
        className={cn(
          "text-[var(--text-body)]",
          highlight ? "font-semibold text-text-primary" : "text-text-secondary"
        )}
      >
        {value}
      </span>
    </div>
  );
}
