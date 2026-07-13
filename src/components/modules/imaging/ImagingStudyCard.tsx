"use client";

import { motion } from "framer-motion";
import { Scan, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, Status } from "@/components/core";
import type { ImagingStudy } from "@/types/imaging";
import { spring, cardHover } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/persian";

interface ImagingStudyCardProps {
  study: ImagingStudy;
  selected?: boolean;
  onSelect: () => void;
  index?: number;
}

const urgencyTone = {
  normal: "neutral" as const,
  attention: "warning" as const,
  urgent: "error" as const,
};

const urgencyLabel = {
  normal: "عادی",
  attention: "نیاز به توجه",
  urgent: "فوری",
};

export function ImagingStudyCard({
  study,
  selected,
  onSelect,
  index = 0,
}: ImagingStudyCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: index * 0.05, ...spring.soft }}
      whileHover={cardHover}
      className={cn(
        "w-full text-right cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-muted",
        selected && "ring-2 ring-primary/30 rounded-[14px]"
      )}
    >
      <Card
        variant="medical"
        hover={false}
        className={cn(
          "transition-colors duration-[120ms] overflow-hidden",
          selected ? "border-border-hover bg-bg-elevated" : ""
        )}
      >
        {study.thumbnailUrl && (
          <div className="relative h-24 -mx-5 -mt-5 mb-4 overflow-hidden">
            <Image
              src={study.thumbnailUrl}
              alt={study.bodyPart}
              fill
              className="object-cover opacity-90"
              sizes="300px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated to-transparent" />
          </div>
        )}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Scan size={16} strokeWidth={1.75} className="text-primary shrink-0" />
              <span className="text-[15px] font-semibold text-text-primary truncate">
                {study.modality} — {study.bodyPart}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-text-secondary">{study.patientName}</p>
            <p className="text-[13px] text-text-tertiary">
              پرونده {study.caseNumber} · {study.physician}
            </p>
          </div>
          <Status label={study.status} tone={study.status === "آماده بررسی" ? "info" : "neutral"} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-text-tertiary">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {study.acquiredAt}
          </span>
          {study.waitMinutes != null && (
            <span>انتظار: {toPersianDigits(study.waitMinutes)} دقیقه</span>
          )}
          <Status
            label={urgencyLabel[study.aiAnalysis.urgency]}
            tone={urgencyTone[study.aiAnalysis.urgency]}
          />
        </div>

        <Link
          href={`/patients/${study.patientId}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-3 inline-flex items-center gap-1 text-[13px] text-primary hover:underline"
        >
          <User size={12} />
          مشاهده پرونده
        </Link>
      </Card>
    </motion.button>
  );
}
