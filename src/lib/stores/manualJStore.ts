import { create } from 'zustand';

type ProgressStatus = 'pending' | 'in_progress' | 'completed' | 'error';

type ProcessingStep = {
  fileValidation: ProgressStatus;
  pdfProcessing: ProgressStatus;
  dataExtraction: ProgressStatus;
  climateAnalysis: ProgressStatus;
  calculations: ProgressStatus;
  resultsGeneration: ProgressStatus;
};

interface ManualJState {
  progress: ProcessingStep;
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
  setProgress: (step: keyof ProcessingStep, status: ProgressStatus) => void;
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
  progress: {
    fileValidation: 'pending',
    pdfProcessing: 'pending',
    dataExtraction: 'pending',
    climateAnalysis: 'pending',
    calculations: 'pending',
    resultsGeneration: 'pending'
  },
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
  
  setProgress: (step, status) => set((state) => ({
    progress: {
      ...state.progress,
      [step]: status
    }
  })),
  
  reset: () => set(initialState),
}));
