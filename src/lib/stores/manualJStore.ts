import { create } from 'zustand';

interface ManualJState {
  pdfFile: File | null;
  location: string;
  isLoading: boolean;
  error: string;
  projectId: string | null;
  assumptions: Record<string, any> | null;
  results: Record<string, any> | null;
}

interface ManualJStore extends ManualJState {
  setPdfFile: (file: File | null) => void;
  setLocation: (location: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  setProjectId: (projectId: string | null) => void;
  setAssumptions: (assumptions: Record<string, any> | null) => void;
  setResults: (results: Record<string, any> | null) => void;
  reset: () => void;
}

const initialState: ManualJState = {
  pdfFile: null,
  location: '',
  isLoading: false,
  error: '',
  projectId: null,
  assumptions: null,
  results: null,
};

export const useManualJStore = create<ManualJStore>((set) => ({
  ...initialState,

  setPdfFile: (file) => set({ pdfFile: file }),
  
  setLocation: (location) => set({ location }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setProjectId: (projectId) => set({ projectId }),
  
  setAssumptions: (assumptions) => set({ assumptions }),
  
  setResults: (results) => set({ results }),
  
  reset: () => set(initialState),
}));