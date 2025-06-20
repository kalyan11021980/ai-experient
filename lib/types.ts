export type AIProvider = 'openai' | 'anthropic' | 'google' | 'ollama';

export type CharacterRole = 'jobSeeker' | 'interviewer1' | 'interviewer2' | 'hr' | 'director';

export interface Character {
  role: CharacterRole;
  name: string;
  provider: AIProvider;
  model: string;
}

export interface Message {
  id: string;
  character: CharacterRole;
  content: string;
  timestamp: Date;
  isInternal?: boolean; // For internal evaluations
}

export type SimulationStage = 
  | 'setup'
  | 'technical1' 
  | 'technical2' 
  | 'hrDiscussion' 
  | 'directorApproval' 
  | 'completed'
  | 'paused';

export interface InterviewQuestion {
  id: number;
  question: string;
  expectedTopics: string[];
}

export interface Evaluation {
  questionId: number;
  score: number; // 1-10
  feedback: string;
  character: CharacterRole;
}

export interface CompensationPackage {
  baseSalary: number;
  bonus: number;
  benefits: number;
  total: number;
}

export interface SimulationState {
  currentStage: SimulationStage;
  characters: Record<CharacterRole, Character>;
  messages: Message[];
  currentQuestionIndex: number;
  evaluations: Evaluation[];
  compensationPackage?: CompensationPackage;
  finalDecision?: 'approved' | 'rejected';
  appointmentLetter?: string;
} 