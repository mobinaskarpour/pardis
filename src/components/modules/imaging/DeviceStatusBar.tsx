"use client";

import { motion } from "framer-motion";
import type { ImagingDevice } from "@/types/imaging";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { uiLabels } from "@/config/labels";
import { cn } from "@/lib/utils";

interface DeviceStatusBarProps {
  devices: ImagingDevice[];
}

export function DeviceStatusBar({ devices }: DeviceStatusBarProps) {
  return (
    <div className="rounded-[14px] border border-border bg-bg-elevated/60 p-4">
      <p className="text-[13px] font-medium text-text-tertiary mb-3">{uiLabels.devices}</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {devices.map((device, i) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, ...spring.gentle }}
            className="rounded-[10px] border border-border bg-bg-elevated p-3"
          >
            <p className="text-[13px] font-medium text-text-primary truncate">{device.name}</p>
            <p className="text-[11px] text-text-tertiary mt-0.5">{device.modality}</p>
            <div className="mt-2 h-1 rounded-full bg-bg-subtle overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-[300ms]",
                  device.utilization > 85 ? "bg-error/60" : "bg-primary/50"
                )}
                style={{ width: `${device.utilization}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-text-tertiary">
              <span>{toPersianDigits(device.utilization)}٪</span>
              <span>صف: {toPersianDigits(device.queue)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
