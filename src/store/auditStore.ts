import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuditFormData, ToolEntry, UseCase } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface AuditStore {
  formData: AuditFormData;
  addTool: () => void;
  removeTool: (id: string) => void;
  updateTool: (id: string, updates: Partial<ToolEntry>) => void;
  setTeamSize: (size: number) => void;
  setUseCase: (useCase: UseCase) => void;
  resetForm: () => void;
}

const defaultFormData: AuditFormData = {
  tools: [],
  teamSize: 1,
  useCase: 'mixed',
};

export const useAuditStore = create<AuditStore>()(
  persist(
    (set) => ({
      formData: defaultFormData,
      addTool: () =>
        set((state) => ({
          formData: {
            ...state.formData,
            tools: [
              ...state.formData.tools,
              {
                id: uuidv4(),
                tool: 'cursor',
                plan: 'pro',
                monthlySpend: 20,
                seats: 1,
              },
            ],
          },
        })),
      removeTool: (id) =>
        set((state) => ({
          formData: {
            ...state.formData,
            tools: state.formData.tools.filter((t) => t.id !== id),
          },
        })),
      updateTool: (id, updates) =>
        set((state) => ({
          formData: {
            ...state.formData,
            tools: state.formData.tools.map((t) =>
              t.id === id ? { ...t, ...updates } : t
            ),
          },
        })),
      setTeamSize: (size) =>
        set((state) => ({
          formData: { ...state.formData, teamSize: size },
        })),
      setUseCase: (useCase) =>
        set((state) => ({
          formData: { ...state.formData, useCase },
        })),
      resetForm: () => set({ formData: defaultFormData }),
    }),
    { name: 'audit-form-storage' }
  )
);
