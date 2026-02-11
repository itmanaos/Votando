
export enum UserRole {
  ADMIN = 'ADMIN',
  LEADER = 'LEADER',
  SUPPORTER = 'SUPPORTER'
}

export enum SupportLevel {
  LOYAL = 'LOYAL',
  INDECISIVE = 'INDECISIVE',
  OPPOSITION = 'OPPOSITION',
  NEUTRAL = 'NEUTRAL'
}

export interface Voter {
  id: string;
  name: string;
  age: number;
  gender: string;
  neighborhood: string;
  votingZone: string;
  votingSection: string;
  supportLevel: SupportLevel;
  lastContact: string;
  leaderId: string;
  coordinates: { lat: number; lng: number };
  socioEconomic: string;
  interests: string[];
  phone: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: UserRole;
  territory: string;
  goals: number;
  achieved: number;
  phone: string;
}

// Novos tipos para o Módulo de Pesquisas
export enum QuestionType {
  TEXT = 'TEXTO',
  YES_NO = 'SIM/NÃO',
  MULTIPLE_CHOICE = 'MÚLTIPLA ESCOLHA',
  NUMERIC = 'NUMÉRICO'
}

export enum SurveyType {
  OPINION = 'OPINIÃO',
  VOTING_INTENTION = 'INTENÇÃO DE VOTO'
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // Apenas para Múltipla Escolha
  required: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  type: SurveyType;
  questions: Question[];
  status: 'RASCUNHO' | 'ATIVA' | 'FINALIZADA';
  responsesCount: number;
  targetRegion: string;
  createdAt: string;
}

export interface PollResult {
  id: string;
  date: string;
  region: string;
  candidateA: number; // Percentage
  candidateB: number;
  undecided: number;
  sampleSize: number;
}

export interface VotingStation {
  id: string;
  name: string;
  address: string;
  voterCount: number;
  coordinates: { lat: number; lng: number };
  strategicImportance: 'HIGH' | 'MEDIUM' | 'LOW';
}
