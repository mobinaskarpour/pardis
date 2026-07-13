"use client";

import { motion } from "framer-motion";
import { AppShell } from "@/components/shell/AppShell";
import { Card } from "@/components/core";
import { spring } from "@/lib/motion";
import {
  dashboardStats,
  centerFacts,
} from "@/mock/data/dashboard";
import { StatTile } from "./StatTile";
import { DashboardChatBox } from "./DashboardChatBox";
import { WeeklyPatientsChart } from "./charts/WeeklyPatientsChart";
import { RevenueTrendChart } from "./charts/RevenueTrendChart";
import { ModalityDonut } from "./charts/ModalityDonut";

const sectionMotion = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, ...spring.soft },
});

export function DashboardPage() {
  return (
    <AppShell>
      <div className="h-full overflow-y-auto px-6 py-8 md:px-10 md:py-10">
        {/* Header */}
        <motion.header {...sectionMotion(0)} className="mb-8">
          <p className="text-[13px] font-medium text-text-tertiary">
            مرکز تصویربرداری پردیس نور
          </p>
          <h1 className="mt-1 text-[36px] font-semibold leading-tight text-text-primary">
            نمای کلی مرکز
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
            وضعیت امروز مرکز در یک نگاه — بیماران، اسکن‌ها، درآمد و دستگاه‌ها.
          </p>
        </motion.header>

        {/* Stat tiles */}
        <motion.section
          {...sectionMotion(0.08)}
          className="grid grid-cols-2 gap-4 xl:grid-cols-4"
        >
          {dashboardStats.map((stat) => (
            <StatTile key={stat.id} stat={stat} />
          ))}
        </motion.section>

        {/* Charts */}
        <motion.section
          {...sectionMotion(0.16)}
          className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"
        >
          <Card
            hover={false}
            hero="روند درآمد ماهانه"
            subtitle="شش ماه اخیر — میلیون تومان"
          >
            <RevenueTrendChart />
          </Card>
          <Card
            hover={false}
            hero="بیماران هفته اخیر"
            subtitle="تعداد مراجعه به تفکیک روز"
          >
            <WeeklyPatientsChart />
          </Card>
        </motion.section>

        <motion.section
          {...sectionMotion(0.24)}
          className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2"
        >
          <Card
            hover={false}
            hero="سهم روش‌های تصویربرداری"
            subtitle="اسکن‌های ثبت‌شده در این ماه"
          >
            <ModalityDonut />
          </Card>
          <Card hover={false} hero="اطلاعات مرکز" subtitle="مشخصات ثابت مرکز">
            <ul className="space-y-3.5">
              {centerFacts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <li key={fact.id} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-bg-subtle text-text-secondary">
                      <Icon size={16} strokeWidth={1.75} />
                    </span>
                    <span className="w-28 shrink-0 text-[13px] text-text-tertiary">
                      {fact.label}
                    </span>
                    <span className="text-[14px] font-medium text-text-primary">
                      {fact.value}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </motion.section>

        {/* Chat entry — redirects to the AI workspace */}
        <motion.div {...sectionMotion(0.32)} className="mt-10 pb-6">
          <DashboardChatBox />
        </motion.div>
      </div>
    </AppShell>
  );
}
