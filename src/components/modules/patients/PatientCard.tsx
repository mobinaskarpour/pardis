"use client";

import Link from "next/link";
import { Card, Status, Avatar } from "@/components/core";
import { ParallaxLayer } from "@/components/motion";
import type { PatientListItem } from "@/types";
import { spring } from "@/lib/motion";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

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
    <ParallaxLayer strength={0.8}>
      <Link href={`/patients/${patient.id}`}>
      <Card
        variant="patient"
        hero={patient.name}
        subtitle={`${patient.age} سال · ${patient.gender} · پرونده ${patient.caseNumber}`}
        action={
          <Status label={patient.status} tone={statusTone(patient.status)} />
        }
        className="group relative cursor-pointer"
      >
        <motion.div
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.05 * index, ...spring.soft }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={patient.name} src={patient.avatarUrl} size="md" status="online" />
            <div className="text-[13px] text-text-secondary">
              <p>{patient.doctor}</p>
              <p className="text-text-tertiary">{patient.specialty}</p>
            </div>
          </div>

          <p className="text-[13px] text-text-tertiary">آخرین: {patient.lastVisit}</p>

          <div className="mt-3 max-h-0 overflow-hidden opacity-0 transition-all duration-[180ms] group-hover:max-h-24 group-hover:opacity-100 border-t border-border pt-3">
            <p className="text-[13px] text-text-secondary leading-relaxed">
              {patient.aiSummary}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-[10px] bg-bg-subtle/80 px-3 py-2">
            <span className="text-[13px] text-text-tertiary">AI Health</span>
            <span className="text-[13px] font-medium text-text-primary">
              {patient.healthScore ?? "—"}٪
            </span>
          </div>

          <span className="absolute top-5 left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-[120ms]">
            <ArrowLeft size={16} strokeWidth={1.75} className="text-text-tertiary" />
          </span>
        </motion.div>
      </Card>
      </Link>
    </ParallaxLayer>
  );
}
