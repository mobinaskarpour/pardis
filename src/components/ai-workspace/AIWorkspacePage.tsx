"use client";

import { AppShell } from "@/components/shell/AppShell";
import { ConversationPanel } from "./ConversationPanel";
import { AICanvas } from "./canvas/AICanvas";
import { ContextPanel } from "./ContextPanel";
import { PromptBar } from "./PromptBar";
import { useAIWorkspace } from "@/hooks/useAIWorkspace";
import { pageLabels } from "@/config/labels";
import { Reveal } from "@/components/motion";

interface AIWorkspacePageProps {
  /** Query handed off from the dashboard chat box — submitted on mount */
  initialQuery?: string;
}

export function AIWorkspacePage({ initialQuery }: AIWorkspacePageProps) {
  const {
    conversations,
    activeId,
    messages,
    canvas,
    thinking,
    streamingMessageId,
    activeCategory,
    context,
    submitQuery,
    selectConversation,
    newConversation,
    setActiveCategory,
    onThinkingComplete,
    acceptWorkflowSuggestion,
    dismissWorkflowSuggestion,
  } = useAIWorkspace(initialQuery);

  return (
    <AppShell pageTitle={pageLabels.chat} hideFloatingAI>
      <div className="flex h-[calc(100vh-65px)] overflow-hidden">
        <Reveal delay={0} className="contents">
          <ContextPanel
            reasoning={context.reasoning}
            citations={context.citations}
            actions={context.actions}
            contextPage={pageLabels.chat}
          />
        </Reveal>

        <Reveal delay={0.12} className="flex flex-1 flex-col min-w-0">
          <AICanvas canvas={canvas} onSuggestionClick={submitQuery} />
          <PromptBar onSubmit={submitQuery} disabled={thinking} />
        </Reveal>

        <Reveal delay={0.24} className="contents">
          <ConversationPanel
            conversations={conversations}
            activeId={activeId}
            messages={messages}
            thinking={thinking}
            streamingMessageId={streamingMessageId}
            activeCategory={activeCategory}
            onSelectConversation={selectConversation}
            onNewConversation={newConversation}
            onCategoryChange={setActiveCategory}
            onSuggestionClick={submitQuery}
            onThinkingComplete={onThinkingComplete}
            onAcceptWorkflowSuggestion={acceptWorkflowSuggestion}
            onDismissWorkflowSuggestion={dismissWorkflowSuggestion}
          />
        </Reveal>
      </div>
    </AppShell>
  );
}
