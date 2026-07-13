"use client";

import { useState, useCallback } from "react";
import type { CanvasType } from "@/lib/ai-workspace-data";
import { processAIQuery } from "@/lib/ai-engine";
import {
  defaultCommandSuggestions,
  queriesToSuggestions,
  type CommandSuggestion,
} from "@/mock/data/command-suggestions";

export type CommandCenterMode = "idle" | "thinking" | "active";

export interface CommandCenterState {
  mode: CommandCenterMode;
  query: string | null;
  response: string | null;
  canvas: CanvasType;
  suggestedQuestions: CommandSuggestion[];
  thinking: boolean;
}

export function useCommandCenter() {
  const [mode, setMode] = useState<CommandCenterMode>("idle");
  const [query, setQuery] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [canvas, setCanvas] = useState<CanvasType>("welcome");
  const [suggestedQuestions, setSuggestedQuestions] = useState<
    CommandSuggestion[]
  >(defaultCommandSuggestions);
  const [thinking, setThinking] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  const submitQuery = useCallback(
    (content: string) => {
      if (thinking) return;
      const trimmed = content.trim();
      if (!trimmed) return;

      setQuery(trimmed);
      setThinking(true);
      setMode("thinking");
      setPendingQuery(trimmed);
    },
    [thinking]
  );

  const onThinkingComplete = useCallback(() => {
    if (!pendingQuery) return;

    const result = processAIQuery(pendingQuery);
    setResponse(result.content);
    setCanvas(result.canvas);
    setSuggestedQuestions(queriesToSuggestions(result.suggestedQuestions));
    setMode("active");
    setThinking(false);
    setPendingQuery(null);
  }, [pendingQuery]);

  const reset = useCallback(() => {
    setMode("idle");
    setQuery(null);
    setResponse(null);
    setCanvas("welcome");
    setThinking(false);
    setPendingQuery(null);
  }, []);

  return {
    mode,
    query,
    response,
    canvas,
    suggestedQuestions,
    thinking,
    submitQuery,
    onThinkingComplete,
    reset,
  };
}
