"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { VoiceAssistantState } from "@/mock/data/voice-assistant";

interface VoiceOrbProps {
  state: VoiceAssistantState;
  volume: number;
  onActivate?: () => void;
}

/** Visual hero — ~340px field */
const FIELD = 340;
const ORB = 268;

const ease = [0.45, 0, 0.55, 1] as const;

/** Pseudo-noise keyframe paths — irregular, non-repetitive feel */
function noisePath(seed: number, amp: number) {
  const a = amp * (0.6 + (seed % 5) * 0.08);
  return [
    0,
    a * (0.4 + (seed % 3) * 0.15),
    -a * (0.35 + (seed % 4) * 0.1),
    a * 0.25,
    -a * 0.15,
    a * 0.5,
    0,
  ];
}

const FIELD_PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  angle: (i / 22) * Math.PI * 2 + (i % 3) * 0.12,
  radius: 0.38 + (i % 7) * 0.04,
  size: 1.4 + (i % 4) * 0.7,
  delay: (i * 0.37) % 4.2,
  duration: 7 + (i % 6) * 1.4 + (i % 3) * 0.3,
  drift: 0.04 + (i % 5) * 0.015,
}));

const CORE_PARTICLES = Array.from({ length: 9 }, (_, i) => ({
  id: `c${i}`,
  x: 22 + ((i * 17) % 56),
  y: 24 + ((i * 23) % 52),
  size: 1.5 + (i % 3) * 0.8,
  delay: i * 0.48,
  duration: 5.5 + (i % 4) * 1.6,
}));

const RIBBONS = [
  { id: 1, d: "M40 170 Q100 90 180 140 T320 120", dur: 11, op: 0.22 },
  { id: 2, d: "M50 220 Q140 280 220 200 T310 240", dur: 14.5, op: 0.16 },
  { id: 3, d: "M70 100 Q160 160 240 90 T300 150", dur: 17, op: 0.14 },
];

const ARCS = [
  { id: "a1", d: "M80 100 A120 120 0 0 1 260 90", dur: 13, op: 0.2 },
  { id: "a2", d: "M70 240 A130 110 0 0 0 270 250", dur: 16, op: 0.15 },
  { id: "a3", d: "M100 60 A140 140 0 0 1 280 180", dur: 19, op: 0.12 },
];

/**
 * THEMACHINE living AI Core —
 * organic energy field, volumetric glass, no loader rings.
 */
export function VoiceOrb({ state, volume, onActivate }: VoiceOrbProps) {
  const listening = state === "listening";
  const speaking = state === "speaking";
  const thinking = state === "thinking";
  const idle = state === "idle";
  const reactive = listening || speaking;
  const energy = reactive ? Math.max(0.08, volume) : idle ? 0.1 : 0.06;

  /** Soft organic deformation while listening */
  const deform = useMemo(() => {
    if (!listening) return "50%";
    const v = 0.5 + energy * 0.5;
    return `${48 + v * 2}% ${52 - v * 1.5}% ${49 + v}% ${51 - v * 0.5}% / ${50 + v}% ${48 + v * 1.2}% ${52 - v}% ${49 + v * 0.8}%`;
  }, [listening, energy]);

  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label="هسته هوش مصنوعی THEMACHINE"
      className="relative mx-auto block cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/30 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
      style={{ width: FIELD, height: FIELD }}
    >
      {/* Layer 6 — soft volumetric glow behind orb */}
      <motion.div
        className="pointer-events-none absolute inset-[6%] rounded-full"
        animate={{
          opacity: speaking
            ? 0.45 + energy * 0.4
            : listening
              ? 0.28 + energy * 0.35
              : thinking
                ? 0.24
                : [0.16, 0.26, 0.16],
          scale: speaking ? [1, 1.06 + energy * 0.08, 1] : reactive ? 1 + energy * 0.04 : 1,
        }}
        transition={
          speaking
            ? { type: "tween", duration: 1.15, repeat: Infinity, ease }
            : idle
              ? { type: "tween", duration: 7.2, repeat: Infinity, ease }
              : { type: "spring", stiffness: 60, damping: 20 }
        }
        style={{
          background:
            "radial-gradient(circle, rgba(140,210,230,0.4) 0%, rgba(60,130,170,0.18) 40%, rgba(90,80,140,0.06) 58%, transparent 72%)",
          filter: "blur(28px)",
        }}
      />

      {/* Organic energy field — ribbons + arcs (NOT concentric rings) */}
      <svg
        className="pointer-events-none absolute inset-0"
        viewBox="0 0 340 340"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="rib" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(180,230,245,0)" />
            <stop offset="45%" stopColor="rgba(160,210,230,0.55)" />
            <stop offset="100%" stopColor="rgba(140,160,210,0)" />
          </linearGradient>
          <linearGradient id="arc" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="rgba(200,190,240,0)" />
            <stop offset="50%" stopColor="rgba(170,200,230,0.5)" />
            <stop offset="100%" stopColor="rgba(120,180,210,0)" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {RIBBONS.map((r) => (
          <motion.path
            key={r.id}
            d={r.d}
            stroke="url(#rib)"
            strokeWidth={1.4}
            strokeLinecap="round"
            fill="none"
            filter="url(#softGlow)"
            initial={{ pathLength: 0.2, opacity: 0 }}
            animate={{
              pathLength: thinking
                ? [0.15, 0.85, 0.3, 0.7, 0.15]
                : reactive
                  ? [0.25, 0.7 + energy * 0.25, 0.35, 0.8, 0.25]
                  : [0.2, 0.55, 0.35, 0.5, 0.2],
              opacity: [
                r.op * 0.4,
                r.op * (reactive ? 1.4 : 1),
                r.op * 0.5,
                r.op,
                r.op * 0.4,
              ],
              x: noisePath(r.id * 3, reactive ? 6 + energy * 8 : 3),
              y: noisePath(r.id * 5, reactive ? 5 + energy * 6 : 2.5),
            }}
            transition={{
              type: "tween",
              duration: r.dur + (reactive ? -3 : 0),
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          />
        ))}

        {ARCS.map((a, i) => (
          <motion.path
            key={a.id}
            d={a.d}
            stroke="url(#arc)"
            strokeWidth={1.1}
            strokeLinecap="round"
            fill="none"
            animate={{
              opacity: [
                a.op * 0.3,
                a.op * (speaking ? 1.5 : 1),
                a.op * 0.4,
                a.op,
                a.op * 0.3,
              ],
              x: noisePath(i * 7 + 2, thinking ? 4 : reactive ? 5 : 2),
              y: noisePath(i * 11 + 1, thinking ? 3 : reactive ? 4 : 1.5),
            }}
            transition={{
              type: "tween",
              duration: a.dur,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Magnetic field particles — drift at uneven speeds */}
      {FIELD_PARTICLES.map((p) => {
        const baseX = Math.cos(p.angle) * FIELD * p.radius;
        const baseY = Math.sin(p.angle) * FIELD * p.radius;
        const out = speaking ? 1.12 + energy * 0.15 : 1;
        return (
          <motion.span
            key={p.id}
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: p.size,
              height: p.size,
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
              background:
                p.id % 6 === 0
                  ? "rgba(180,170,220,0.7)"
                  : "rgba(220,240,250,0.65)",
            }}
            animate={{
              x: [
                baseX,
                baseX * (1 + p.drift) * out,
                baseX * (1 - p.drift * 0.6) * out,
                baseX * out,
              ],
              y: [
                baseY,
                baseY * (1 - p.drift * 0.8) * out,
                baseY * (1 + p.drift) * out,
                baseY * out,
              ],
              opacity: speaking
                ? [0.15, 0.55, 0.2, 0]
                : reactive
                  ? [0.12, 0.45 + energy * 0.3, 0.2, 0.35]
                  : [0.08, 0.22, 0.12, 0.18],
              scale: speaking ? [1, 1.2, 0.8, 0.4] : [1, 1.15, 0.95, 1],
            }}
            transition={{
              type: "tween",
              duration: speaking ? p.duration * 0.45 : p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* ——— Physical glass orb ——— */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-10 overflow-hidden"
        style={{
          width: ORB,
          height: ORB,
          marginLeft: -ORB / 2,
          marginTop: -ORB / 2,
          borderRadius: deform,
          boxShadow: [
            "0 24px 64px rgba(15,30,55,0.28)",
            "0 8px 24px rgba(15,30,55,0.12)",
            "inset 0 3px 8px rgba(255,255,255,0.55)",
            "inset 0 -16px 36px rgba(70,140,180,0.1)",
          ].join(", "),
        }}
        animate={{
          scale: listening
            ? 1 + energy * 0.035
            : speaking
              ? [1, 1.025 + energy * 0.04, 1]
              : idle
                ? [1, 1.018, 1]
                : 1,
        }}
        transition={
          speaking
            ? { type: "tween", duration: 1.05, repeat: Infinity, ease }
            : idle
              ? { type: "tween", duration: 6.8, repeat: Infinity, ease }
              : { type: "spring", stiffness: 90, damping: 22 }
        }
      >
        {/* Layer 1 — outer transparent shell */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "inherit",
            background:
              "radial-gradient(circle at 32% 24%, rgba(255,255,255,0.92) 0%, rgba(235,248,255,0.45) 20%, rgba(170,215,235,0.22) 45%, rgba(90,160,195,0.16) 70%, rgba(50,110,150,0.2) 100%)",
          }}
        />

        {/* Layer 2 — inner glass refraction */}
        <div
          className="absolute inset-[7%]"
          style={{
            borderRadius: "inherit",
            background:
              "radial-gradient(circle at 60% 70%, rgba(100,180,210,0.18) 0%, rgba(160,210,230,0.06) 40%, transparent 65%)",
            boxShadow: "inset 0 0 40px rgba(255,255,255,0.15)",
          }}
        />

        {/* Layer 3 — energy core */}
        <motion.div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: ORB * 0.42,
            height: ORB * 0.42,
            marginLeft: (-ORB * 0.42) / 2,
            marginTop: (-ORB * 0.42) / 2,
            background:
              "radial-gradient(circle at 36% 30%, #f0fafc 0%, #a8dce8 24%, #4a9db8 55%, #1e5a78 85%, #143848 100%)",
            boxShadow: speaking
              ? "0 0 48px rgba(120,200,220,0.55), 0 0 80px rgba(60,140,180,0.25)"
              : "0 0 36px rgba(120,200,220,0.38), 0 0 60px rgba(60,140,180,0.16)",
          }}
          animate={{
            scale: speaking
              ? [1, 1.12 + energy * 0.12, 0.98, 1.08, 1]
              : thinking
                ? [1, 1.04, 0.97, 1.05, 1]
                : listening
                  ? 1 + energy * 0.08
                  : [1, 1.03, 1],
            x: thinking ? noisePath(4, 3) : 0,
            y: thinking ? noisePath(7, 2.5) : 0,
            rotate: thinking ? [0, 12, -8, 18, -5, 0] : 0,
          }}
          transition={
            speaking
              ? {
                  type: "tween",
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.25, 0.5, 0.75, 1],
                }
              : thinking
                ? {
                    type: "tween",
                    duration: 9.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : idle
                  ? { type: "tween", duration: 6.5, repeat: Infinity, ease }
                  : { type: "spring", stiffness: 70, damping: 18 }
          }
        />

        {/* Thinking — soft internal current pulses */}
        {thinking && (
          <motion.div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: ORB * 0.55,
              height: ORB * 0.55,
              marginLeft: (-ORB * 0.55) / 2,
              marginTop: (-ORB * 0.55) / 2,
              background:
                "conic-gradient(from 0deg, transparent, rgba(160,210,230,0.2), transparent 40%, rgba(180,170,220,0.12), transparent 70%)",
              filter: "blur(8px)",
            }}
            animate={{ rotate: [0, 40, -20, 60, 0], opacity: [0.3, 0.55, 0.35, 0.5, 0.3] }}
            transition={{
              type: "tween",
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Layer 4 — moving light streaks */}
        <motion.div
          className="pointer-events-none absolute inset-[12%]"
          style={{
            borderRadius: "inherit",
            background:
              "linear-gradient(118deg, transparent 38%, rgba(255,255,255,0.35) 48%, transparent 58%)",
          }}
          animate={{
            x: ["-45%", "45%", "-20%", "50%", "-45%"],
            opacity: [0, 0.7, 0.2, 0.6, 0],
          }}
          transition={{
            type: "tween",
            duration: idle ? 10 : thinking ? 6.5 : speaking ? 4 : 7.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="pointer-events-none absolute inset-[22%]"
          style={{
            borderRadius: "inherit",
            background:
              "linear-gradient(70deg, transparent 42%, rgba(180,220,240,0.2) 50%, transparent 58%)",
          }}
          animate={{
            x: ["40%", "-40%", "30%", "-45%", "40%"],
            opacity: [0, 0.45, 0.1, 0.4, 0],
          }}
          transition={{
            type: "tween",
            duration: idle ? 13 : 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.8,
          }}
        />

        {/* Layer 5 — tiny floating particles inside */}
        {CORE_PARTICLES.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-white/60"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              x: noisePath(p.delay * 10, listening ? 6 + energy * 8 : thinking ? 5 : 3),
              y: noisePath(p.delay * 13, listening ? 5 + energy * 6 : thinking ? 4 : 2.5),
              opacity: speaking
                ? [0.2, 0.7, 0.3, 0.6, 0.2]
                : [0.15, 0.45, 0.2, 0.35, 0.15],
            }}
            transition={{
              type: "tween",
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Specular crystal highlight */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: "inherit",
            background:
              "linear-gradient(152deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.2) 16%, transparent 36%)",
          }}
        />

        {/* Bottom caustic */}
        <div
          className="pointer-events-none absolute inset-x-[18%] bottom-[10%] h-[26%] rounded-[100%]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />

        {/* Glass rim */}
        <div
          className="pointer-events-none absolute inset-[1px] ring-1 ring-inset ring-white/50"
          style={{ borderRadius: "inherit" }}
        />
        <div
          className="pointer-events-none absolute inset-0 border border-white/25"
          style={{ borderRadius: "inherit" }}
        />
      </motion.div>

      {/* Speaking — outward energy waves (fade, not rings) */}
      {speaking &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={`wave-${i}`}
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: ORB,
              height: ORB,
              marginLeft: -ORB / 2,
              marginTop: -ORB / 2,
              border: "1px solid rgba(160,210,230,0.35)",
              boxShadow: "0 0 20px rgba(120,190,210,0.12)",
            }}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: [0.9, 1.35 + energy * 0.15],
              opacity: [0.35, 0],
            }}
            transition={{
              type: "tween",
              duration: 2.2 + i * 0.35,
              repeat: Infinity,
              delay: i * 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
    </button>
  );
}

export const VoiceAvatar = VoiceOrb;
