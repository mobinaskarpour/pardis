import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Workflow } from "@/types/workflow";
import { imagingWorkflowsSeed } from "@/mock/data/workflow-scenarios";

interface WorkflowState {
  workflows: Workflow[];
  addWorkflow: (wf: Workflow) => void;
  updateWorkflow: (id: string, patch: Partial<Workflow>) => void;
  hasWorkflow: (id: string) => boolean;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      workflows: imagingWorkflowsSeed,
      addWorkflow: (wf) =>
        set((state) =>
          state.workflows.some((w) => w.id === wf.id)
            ? state
            : { workflows: [wf, ...state.workflows] }
        ),
      updateWorkflow: (id, patch) =>
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id ? { ...w, ...patch } : w
          ),
        })),
      hasWorkflow: (id) => get().workflows.some((w) => w.id === id),
    }),
    {
      name: "pardis-workflows-v2",
      // Hydrated manually after mount (see Providers) to avoid an SSR
      // markup mismatch between the seeded and persisted state.
      skipHydration: true,
    }
  )
);
