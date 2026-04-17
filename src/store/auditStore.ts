import { create } from 'zustand';
import { Audit } from '../types';

interface AuditState {
  audits: Audit[];
  currentAudit: Audit | null;
  setAudits: (audits: Audit[]) => void;
  setCurrentAudit: (audit: Audit | null) => void;
  addAudit: (audit: Audit) => void;
  updateAudit: (id: string, data: Partial<Audit>) => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  audits: [],
  currentAudit: null,
  setAudits: (audits) => set({ audits }),
  setCurrentAudit: (audit) => set({ currentAudit: audit }),
  addAudit: (audit) => set((state) => ({ audits: [audit, ...state.audits] })),
  updateAudit: (id, data) => set((state) => ({
    audits: state.audits.map((a) => (a.id === id ? { ...a, ...data } : a)),
    currentAudit: state.currentAudit?.id === id ? { ...state.currentAudit, ...data } : state.currentAudit,
  })),
}));
