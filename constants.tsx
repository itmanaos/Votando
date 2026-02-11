
import { Voter, SupportLevel, TeamMember, UserRole, PollResult, VotingStation, Survey, SurveyType, QuestionType } from './types';

// Palette Colors inspired by Votando (Blue/Teal/White)
export const THEME = {
  primary: '#0f172a',    // Slate 900
  secondary: '#3b82f6',  // Blue 500
  accent: '#14b8a6',     // Teal 500
  background: '#f8fafc', // Slate 50
  surface: '#ffffff',
  text: '#1e293b'        // Slate 800
};

export const MOCK_SURVEYS: Survey[] = [
  {
    id: 'S1',
    title: 'Avaliação de Gestão Municipal 2024',
    description: 'Pesquisa para medir o impacto das obras recentes no centro.',
    type: SurveyType.OPINION,
    status: 'ATIVA',
    responsesCount: 145,
    targetRegion: 'Centro',
    createdAt: '2023-10-01',
    questions: [
      { id: 'q1', text: 'Como você avalia o trânsito no centro?', type: QuestionType.MULTIPLE_CHOICE, options: ['Ótimo', 'Bom', 'Regular', 'Ruim'], required: true },
      { id: 'q2', text: 'Você aprova a nova iluminação?', type: QuestionType.YES_NO, required: true }
    ]
  },
  {
    id: 'S2',
    title: 'Simulado de Intenção de Voto - Outubro',
    description: 'Levantamento espontâneo e estimulado de candidatos.',
    type: SurveyType.VOTING_INTENTION,
    status: 'FINALIZADA',
    responsesCount: 1200,
    targetRegion: 'Geral',
    createdAt: '2023-09-15',
    questions: []
  }
];

export const MOCK_VOTERS: Voter[] = [
  { id: '1', name: 'João Silva', age: 34, gender: 'M', neighborhood: 'Centro', votingZone: '102', votingSection: '045', supportLevel: SupportLevel.LOYAL, lastContact: '2023-10-15', leaderId: 'L1', coordinates: { lat: -23.55, lng: -46.63 }, socioEconomic: 'Classe B', interests: ['Saúde', 'Segurança'], phone: '(11) 98877-1122' },
  { id: '2', name: 'Maria Souza', age: 28, gender: 'F', neighborhood: 'Norte', votingZone: '105', votingSection: '112', supportLevel: SupportLevel.INDECISIVE, lastContact: '2023-10-12', leaderId: 'L2', coordinates: { lat: -23.56, lng: -46.64 }, socioEconomic: 'Classe C', interests: ['Educação'], phone: '(11) 97766-3344' },
  { id: '3', name: 'Carlos Oliveira', age: 52, gender: 'M', neighborhood: 'Sul', votingZone: '088', votingSection: '015', supportLevel: SupportLevel.OPPOSITION, lastContact: '2023-10-10', leaderId: 'L1', coordinates: { lat: -23.54, lng: -46.62 }, socioEconomic: 'Classe A', interests: ['Economia'], phone: '(11) 96655-5566' },
  { id: '4', name: 'Ana Costa', age: 41, gender: 'F', neighborhood: 'Oeste', votingZone: '112', votingSection: '098', supportLevel: SupportLevel.NEUTRAL, lastContact: '2023-10-14', leaderId: 'L3', coordinates: { lat: -23.57, lng: -46.65 }, socioEconomic: 'Classe D', interests: ['Infraestrutura'], phone: '(11) 95544-7788' },
];

export const MOCK_TEAMS: TeamMember[] = [
  { id: 'L1', name: 'Ricardo Mendes', role: UserRole.LEADER, territory: 'Zona Sul', goals: 500, achieved: 420, phone: '(11) 98888-1111' },
  { id: 'L2', name: 'Fernanda Lima', role: UserRole.LEADER, territory: 'Zona Norte', goals: 300, achieved: 150, phone: '(11) 98888-2222' },
  { id: 'L3', name: 'Marcos Paulo', role: UserRole.SUPPORTER, territory: 'Centro', goals: 100, achieved: 85, phone: '(11) 98888-3333' },
];

export const MOCK_POLLS: PollResult[] = [
  { id: 'P1', date: '2023-08-01', region: 'Geral', candidateA: 32, candidateB: 28, undecided: 20, sampleSize: 1200 },
  { id: 'P2', date: '2023-09-01', region: 'Geral', candidateA: 35, candidateB: 27, undecided: 15, sampleSize: 1200 },
  { id: 'P3', date: '2023-10-01', region: 'Geral', candidateA: 38, candidateB: 26, undecided: 12, sampleSize: 1500 },
];

export const MOCK_STATIONS: VotingStation[] = [
  { id: 'S1', name: 'Escola Municipal Central', address: 'Rua das Flores, 123', voterCount: 4500, coordinates: { lat: -23.5505, lng: -46.6333 }, strategicImportance: 'HIGH' },
  { id: 'S2', name: 'Colégio Estadual Norte', address: 'Av. Paulista, 900', voterCount: 2800, coordinates: { lat: -23.5611, lng: -46.6555 }, strategicImportance: 'MEDIUM' },
];