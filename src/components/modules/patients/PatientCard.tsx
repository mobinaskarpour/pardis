"use client";

import Link from "next/link";
import { Card, Status, Avatar } from "@/components/core";
import { ParallaxLayer } from "@/components/motion";
import type { PatientListItem } from "@/types";
import { spring } from "@/lib/motion";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toPersianDigits } from "@/lib/persian";

interface PatientCardProps {
  patient: PatientListItem;
  index?: number;
}

const statusTone = (status: string) => {
  if (status === "فعال") return "success" as const;
  if (status === "در انتظار") return "warning" as const;
  if (status === "پیگیری") return "info" as const;
  return "neutral" as const;
};

export function PatientCard({ patient, index = 0 }: PatientCardProps) {
  return (
    <ParallaxLayer strength={0.6}>
      <Link href={`/patients/${patient.id}`} className="block">
        <Card
          variant="patient"
          hero={patient.name}
          subtitle={`${toPersianDigits(patient.age)} سال · ${patient.gender} · پرونده ${patient.caseNumber}`}
          action={
            <Status label={patient.status} tone={statusTone(patient.status)} />
          }
          className="group relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * index, ...spring.soft }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={patient.name} src={patient.avatarUrl} size="md" status="online" />
              <div className="text-[12px] text-text-secondary min-w-0">
                <p className="truncate font-medium text-text-primary">{patient.doctor}</p>
                <p className="text-text-tertiary truncate">{patient.specialty}</p>
              </div>
            </div>

            <p className="text-[12px] text-text-tertiary">آخرین مراجعه: {patient.lastVisit}</p>

            <div className="mt-2.5 max-h-0 overflow-hidden opacity-0 transition-all duration-[180ms] group-hover:max-h-24 group-hover:opacity-100 border-t border-border pt-2.5">
              <p className="text-[12px] text-text-secondary leading-relaxed">
                {patient.aiSummary}
              </p>
            </div>

            <div className="mt-3.5 flex items-center justify-between rounded-[10px] bg-bg-layer-1 px-3 py-2">
              <span className="text-[11px] text-text-tertiary">شاخص سلامت</span>
              <span className="text-[13px] font-semibold tabular-nums text-text-primary">
                {patient.healthScore != null
                  ? `${toPersianDigits(patient.healthScore)}٪`
                  : "—"}
              </span>
            </div>

            <span className="absolute top-5 start-5 opacity-0 group-hover:opacity-100 transition-opacity duration-[120ms]">
              <ArrowLeft size={15} strokeWidth={1.75} className="text-text-tertiary" />
            </span>
          </motion.div>
        </Card>
      </Link>
    </ParallaxLayer>
  );
}
