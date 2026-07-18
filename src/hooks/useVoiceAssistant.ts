"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  VOICE_STATE_LABELS,
  voiceDemoTurns,
  type VoiceAssistantState,
} from "@/mock/data/voice-assistant";

interface UseVoiceAssistantOptions {
  open: boolean;
  onSubmitQuery: (query: string) => void;
  onClose: () => void;
  onSwitchToText: () => void;
}

export function useVoiceAssistant({
  open,
  onSubmitQuery,
  onClose,
  onSwitchToText,
}: UseVoiceAssistantOptions) {
  const [state, setState] = useState<VoiceAssistantState>("idle");
  const [volume, setVolume] = useState(0.15);
  const [muted, setMuted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiSpeech, setAiSpeech] = useState("");
  const turnRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const submittedRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const stopMic = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const typeText = useCallback(
    (full: string, onDone?: () => void, speed = 38) => {
      let i = 0;
      setTranscript("");
      const tick = () => {
        i += 1;
        setTranscript(full.slice(0, i));
        if (i < full.length) {
          schedule(tick, speed + Math.random() * 18);
        } else {
          onDone?.();
        }
      };
      schedule(tick, 120);
    },
    [schedule]
  );

  const typeAiSpeech = useCallback(
    (full: string, onDone?: () => void) => {
      let i = 0;
      setAiSpeech("");
      const tick = () => {
        i += 1;
        setAiSpeech(full.slice(0, i));
        if (i < full.length) {
          schedule(tick, 22 + Math.random() * 12);
        } else {
          onDone?.();
        }
      };
      schedule(tick, 200);
    },
    [schedule]
  );

  const runSimulatedVolume = useCallback(
    (active: boolean) => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (!active) {
        setVolume(0.12);
        return;
      }
      const start = performance.now();
      const loop = (now: number) => {
        const t = (now - start) / 1000;
        const base = 0.22 + Math.sin(t * 3.2) * 0.12;
        const pulse = Math.abs(Math.sin(t * 7.5)) * 0.35;
        const noise = Math.random() * 0.12;
        setVolume(Math.min(1, base + pulse + noise));
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    },
    []
  );

  const runAnalyserVolume = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.fftSize);
    const loop = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i]! - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      setVolume(Math.min(1, 0.12 + rms * 3.2));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const startMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      runAnalyserVolume();
    } catch {
      runSimulatedVolume(true);
    }
  }, [runAnalyserVolume, runSimulatedVolume]);

  const runDemoTurn = useCallback(() => {
    clearTimers();
    submittedRef.current = false;
    setAiSpeech("");
    setTranscript("");
    setState("idle");
    setVolume(0.14);

    const turn = voiceDemoTurns[turnRef.current % voiceDemoTurns.length]!;
    turnRef.current += 1;

    schedule(() => {
      setState("listening");
      void startMic();
      typeText(turn.transcript, () => {
        schedule(() => {
          stopMic();
          runSimulatedVolume(false);
          setState("thinking");
          setVolume(0.08);

          schedule(() => {
            setState("speaking");
            runSimulatedVolume(true);

            typeAiSpeech(turn.responsePreview, () => {
              if (!submittedRef.current) {
                submittedRef.current = true;
                onSubmitQuery(turn.transcript);
              }
              schedule(() => {
                runSimulatedVolume(false);
                setState("idle");
                setVolume(0.12);
              }, 1800);
            });
          }, 1800);
        }, 700);
      });
    }, 900);
  }, [
    clearTimers,
    onSubmitQuery,
    runSimulatedVolume,
    schedule,
    startMic,
    stopMic,
    typeAiSpeech,
    typeText,
  ]);

  useEffect(() => {
    if (!open) {
      clearTimers();
      stopMic();
      setState("idle");
      setTranscript("");
      setAiSpeech("");
      setMuted(false);
      setVolume(0.12);
      return;
    }
    runDemoTurn();
    return () => {
      clearTimers();
      stopMic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- start session once on open
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (next) {
        clearTimers();
        stopMic();
        runSimulatedVolume(false);
        setState("idle");
      } else {
        schedule(() => runDemoTurn(), 200);
      }
      return next;
    });
  }, [clearTimers, runDemoTurn, runSimulatedVolume, schedule, stopMic]);

  const endConversation = useCallback(() => {
    clearTimers();
    stopMic();
    onClose();
  }, [clearTimers, onClose, stopMic]);

  const switchToText = useCallback(() => {
    clearTimers();
    stopMic();
    onSwitchToText();
  }, [clearTimers, onSwitchToText, stopMic]);

  return {
    state,
    volume: muted ? 0 : volume,
    muted,
    transcript,
    aiSpeech,
    statusLabel: VOICE_STATE_LABELS[state],
    toggleMute,
    endConversation,
    switchToText,
    restartListening: () => {
      if ((state === "idle" || state === "listening") && !muted) runDemoTurn();
    },
  };
}
