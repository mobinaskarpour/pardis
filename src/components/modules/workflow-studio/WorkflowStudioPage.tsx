"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useWorkflowStudio } from "@/hooks/useWorkflowStudio";
import { StudioToolbar } from "./StudioToolbar";
import { NodeLibrary } from "./NodeLibrary";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { InspectorPanel } from "./InspectorPanel";
import { ExecutionTimeline } from "./ExecutionTimeline";
import { AIAssistant } from "./AIAssistant";
import { AIGenerateModal } from "./AIGenerateModal";

interface WorkflowStudioPageProps {
  id: string;
}

export function WorkflowStudioPage({ id }: WorkflowStudioPageProps) {
  const studio = useWorkflowStudio(id);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  if (!studio.workflow || !studio.graph) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f4f5f7]">
        <p className="text-text-secondary">Workflow یافت نشد</p>
      </div>
    );
  }

  const { graph, workflow } = studio;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f4f5f7]">
      <StudioToolbar
        name={workflow.name}
        saveStatus={studio.saveStatus}
        canUndo={studio.canUndo}
        canRedo={studio.canRedo}
        zoom={graph.viewport.zoom}
        collaborators={studio.collaborators}
        onUndo={studio.undo}
        onRedo={studio.redo}
        onSave={studio.save}
        onPublish={studio.save}
        onAIGenerate={() => setAiModalOpen(true)}
        onRunTest={studio.runTest}
        onZoomIn={() =>
          studio.setViewport({
            ...graph.viewport,
            zoom: Math.min(1.5, graph.viewport.zoom + 0.1),
          })
        }
        onZoomOut={() =>
          studio.setViewport({
            ...graph.viewport,
            zoom: Math.max(0.35, graph.viewport.zoom - 0.1),
          })
        }
        onSearchNode={() => {}}
        onOpenHistory={() => {
          studio.setBottomOpen(true);
          studio.setTimelineTab("history");
        }}
      />

      {studio.warnings.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-warning/6 border-b border-warning/12 text-[11px] text-warning shrink-0">
          <AlertTriangle size={12} />
          {studio.warnings[0].message}
          {studio.warnings.length > 1 && (
            <span className="opacity-70">
              (+{studio.warnings.length - 1})
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 min-h-0 min-w-0">
        <NodeLibrary onAddNode={(defId) => studio.addNode(defId)} />

        <WorkflowCanvas
          nodes={graph.nodes}
          edges={graph.edges}
          viewport={graph.viewport}
          selectedId={studio.selectedId}
          isRunning={studio.isRunning}
          onSelect={studio.setSelectedId}
          onMoveNode={studio.moveNode}
          onCommitMove={studio.commitMove}
          onViewportChange={studio.setViewport}
          onAddNodeFromDrop={(defId, x, y) => studio.addNode(defId, x, y)}
        />

        <InspectorPanel
          node={studio.selectedNode}
          workflow={workflow}
          nodeCount={graph.nodes.length}
          edgeCount={graph.edges.length}
          warnings={studio.warnings}
          onUpdateConfig={studio.updateNodeConfig}
          onDelete={studio.deleteNode}
        />
      </div>

      <ExecutionTimeline
        open={studio.bottomOpen}
        onToggle={() => studio.setBottomOpen(!studio.bottomOpen)}
        tab={studio.timelineTab}
        onTabChange={studio.setTimelineTab}
        logs={studio.logs}
        versions={studio.versions}
        onRestoreVersion={studio.restoreVersion}
      />

      <AIAssistant
        onCommand={() => studio.addNode("condition")}
      />

      <AIGenerateModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        isGenerating={studio.isGenerating}
        onGenerate={() => {
          setAiModalOpen(false);
          studio.generateWithAI();
        }}
      />
    </div>
  );
}
