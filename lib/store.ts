import { create } from 'zustand';
import { SimulationState, CharacterRole, Character, Message, Evaluation, CompensationPackage, SimulationStage } from './types';

interface SimulationStore extends SimulationState {
  // Actions
  setCharacter: (role: CharacterRole, character: Character) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setStage: (stage: SimulationStage) => void;
  addEvaluation: (evaluation: Evaluation) => void;
  setCompensationPackage: (compensation: CompensationPackage) => void;
  setFinalDecision: (decision: 'approved' | 'rejected') => void;
  setAppointmentLetter: (letter: string) => void;
  nextQuestion: () => void;
  resetSimulation: () => void;
}

const initialState: SimulationState = {
  currentStage: 'setup',
  characters: {
    jobSeeker: {
      role: 'jobSeeker',
      name: 'Alex Johnson',
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022'
    },
    interviewer1: {
      role: 'interviewer1',
      name: 'Sarah Chen',
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022'
    },
    interviewer2: {
      role: 'interviewer2',
      name: 'Mike Rodriguez',
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022'
    },
    hr: {
      role: 'hr',
      name: 'Jennifer Smith',
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022'
    },
    director: {
      role: 'director',
      name: 'Robert Kim',
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022'
    }
  },
  messages: [],
  currentQuestionIndex: 0,
  evaluations: []
};

export const useSimulationStore = create<SimulationStore>((set) => ({
  ...initialState,

  setCharacter: (role, character) => 
    set((state) => ({
      characters: {
        ...state.characters,
        [role]: character
      }
    })),

  addMessage: (message) => 
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date()
        }
      ]
    })),

  setStage: (stage) => set({ currentStage: stage }),

  addEvaluation: (evaluation) =>
    set((state) => ({
      evaluations: [...state.evaluations, evaluation]
    })),

  setCompensationPackage: (compensation) =>
    set({ compensationPackage: compensation }),

  setFinalDecision: (decision) =>
    set({ finalDecision: decision }),

  setAppointmentLetter: (letter) =>
    set({ appointmentLetter: letter }),

  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1
    })),

  resetSimulation: () => set({ ...initialState, messages: [] })
})); 