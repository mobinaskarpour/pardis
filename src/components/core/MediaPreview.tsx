"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MediaPreviewProps {
  src: string;
  alt: string;
  videoUrl?: string;
  className?: string;
  aspect?: "video" | "square" | "scan";
}

export function MediaPreview({
  src,
  alt,
  videoUrl,
  className,
  aspect = "scan",
}: MediaPreviewProps) {
  const [playing, setPlaying] = useState(false);

  const aspectClass =
    aspect === "video"
      ? "aspect-video"
      : aspect === "square"
        ? "aspect-square"
        : "aspect-[4/3]";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] bg-bg-dark",
        aspectClass,
        className
      )}
    >
      {playing && videoUrl ? (
        <video
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      )}

      {videoUrl && !playing && (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30 cursor-pointer group"
          aria-label="پخش ویدیو"
        >
          <motion.span
            whileHover={{ scale: 1.08, transition: spring.gentle }}
            className="flex h-12 w-12 items-center justify-center rounded-full glass"
          >
            <Play size={20} className="text-text-primary mr-[-2px]" fill="currentColor" />
          </motion.span>
        </button>
      )}

      {/* Scan overlay effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(45,90,123,0.15) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
