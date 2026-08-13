
export enum UserRole {
  ADMIN = 'ADMIN',
  COORDINATOR = 'COORDINATOR',
  LEADER = 'LEADER',
  FISCAL = 'FISCAL',
  SUPPORTER = 'SUPPORTER'
}

export interface UserNotificationPreferences {
  email: boolean;
  push: boolean;
  urgentAlerts: boolean;
  whatsapp: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isGlobalAccess: boolean;
  phone: string;
  cpf?: string;
  electoralTitle?: string;
  jobTitle: string;
  party: string;
  coalition?: string;
  territory: string;
  votingZone?: string;
  avatarUrl?: string;
  bio?: string;
  twoFactorEnabled: boolean;
  permissions: string[];
  notificationPreferences: UserNotificationPreferences;
  themePreference?: 'light' | 'dark' | 'system';
  createdAt: string;
  lastLogin: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface AuthSession {
  user: UserProfile;
  token: string;
  expiresAt: string;
  ipAddress: string;
  deviceInfo: string;
}

export interface AccessLog {
  id: string;
  timestamp: string;
  action: string;
  ip: string;
  device: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
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
  options?: string[];
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
  candidateA: number;
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

export interface CandidateResult {
  id: string;
  name: string;
  party: string;
  votes: number;
  percentage: number;
  isMain: boolean;
  color: string;
}

export interface TallyStats {
  sectionsTotal: number;
  sectionsCounted: number;
  votersTotal: number;
  votersPresent: number;
  validVotes: number;
  blankVotes: number;
  nullVotes: number;
  lastUpdate: string;
}

// Novos tipos para Apuração Paralela (Fiscais)
export interface BallotReport {
  id: string;
  zone: string;
  section: string;
  votesCandidateA: number;
  votesCandidateB: number;
  votesOthers: number;
  blankVotes: number;
  nullVotes: number;
  fiscalName: string;
  timestamp: string;
  photoUrl?: string;
}

// ==========================================
// MÓDULO DE GESTÃO DE REUNIÕES & COMPLIANCE
// ==========================================

export enum MeetingType {
  PLENARY = 'PLENÁRIA',
  MINI_RALLY = 'MINI-COMÍCIO',
  LEADERS_MEETING = 'REUNIÃO DE LIDERANÇAS',
  THEMATIC = 'ENCONTRO TEMÁTICO',
  COFFEE_SUPPORTERS = 'CAFÉ COM APOIADORES',
  WALK_VISIT = 'CAMINHADA / VISITA'
}

export enum MeetingStatus {
  SCHEDULED = 'AGENDADA',
  IN_PROGRESS = 'EM ANDAMENTO',
  COMPLETED = 'REALIZADA',
  CANCELLED = 'CANCELADA'
}

export enum RACIRole {
  RESPONSIBLE = 'R - Responsável',
  ACCOUNTABLE = 'A - Aprovador/Líder',
  CONSULTED = 'C - Consultado',
  INFORMED = 'I - Informado'
}

export interface RACIAssignment {
  role: RACIRole;
  assignedTo: string; // Nome ou ID do membro
}

export enum StepStatus {
  PENDING = 'PENDENTE',
  IN_PROGRESS = 'EM_ANDAMENTO',
  COMPLETED = 'CONCLUIDO',
  BLOCKED = 'BLOQUEADO',
  DELAYED = 'ATRASADO'
}

export interface MeetingLifecycleStep {
  id: number; // 1 to 9
  name: string;
  description: string;
  status: StepStatus;
  raci: RACIAssignment[];
  deadline: string; // Data/Hora ou -2h antes
  completedAt?: string;
  legalWarnings?: string[];
  notes?: string;
  checklistItems: {
    id: string;
    text: string;
    completed: boolean;
    required: boolean;
  }[];
}

export interface LeaderCheckIn {
  id: string;
  leaderName: string;
  role: string;
  territory: string;
  phone: string;
  expectedSupporters: number;
  actualSupportersPresent?: number;
  sector?: string;
  status: 'CONFIRMADO' | 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO';
  checkInTime?: string;
  notes?: string;
}

export enum ExpenseCategory {
  VENUE_RENTAL = 'Locação de Espaço',
  SOUND_LIGHTING = 'Sonorização & Iluminação',
  GRAPHIC_MATERIALS = 'Material Gráfico & Banners',
  STAFF_MEALS = 'Alimentação de Equipe (Staff)',
  TRANSPORT_FUEL = 'Transporte & Combustível',
  SECURITY_BRIGADE = 'Segurança & Brigadistas',
  GENERATOR = 'Gerador de Energia',
  PHOTO_VIDEO = 'Registro Audiovisual & Cobertura',
  OTHER = 'Outras Despesas Permitidas'
}

export enum PaymentFundingSource {
  CAMPAIGN_BANK_ACCOUNT = 'Conta Bancária de Campanha (Doações Financeiras)',
  FEFC = 'Fundo Especial de Financiamento de Campanha (FEFC)',
  PARTISAN_FUND = 'Fundo Partidário',
  ESTIMATED_DONATION = 'Doação Estimável em Dinheiro (Cessão/Serviço)'
}

export enum ComplianceAuditStatus {
  APPROVED = 'CONFORME (APROVADO)',
  PENDING_DOCS = 'PENDÊNCIA DOCUMENTAL',
  HIGH_RISK = 'RISCO DE GLOSA / NÃO CONFORME'
}

export interface MeetingExpense {
  id: string;
  category: ExpenseCategory;
  description: string;
  supplierName: string;
  supplierTaxId: string; // CNPJ / CPF
  amount: number;
  fundingSource: PaymentFundingSource;
  documentType: 'NF-e' | 'Recibo Eleitoral' | 'Contrato Prestação' | 'Cupom Fiscal';
  documentNumber: string;
  invoiceFileName?: string;
  invoiceFileUrl?: string;
  complianceStatus: ComplianceAuditStatus;
  legalNotes?: string;
  registeredBy: string;
  createdAt: string;
}

export interface PublicAttendanceData {
  venueAreaM2: number;
  densityFactor: number; // 1 to 5 people/m²
  calculatedDensityCount: number;
  manualCount: number;
  aiEstimatedCount: number;
  aiConfidence: number; // Percentage
  leadersPresentCount: number;
  totalSupportersMobilized: number;
}

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  venueName: string;
  address: string;
  neighborhood: string;
  votingZone: string;
  coordinates: { lat: number; lng: number };
  venueCapacity: number;
  isOutdoor: boolean;
  coordinatorId: string;
  coordinatorName: string;
  expectedAttendance: number;
  confirmedAttendance: number;
  topic: string;
  targetAudience: string;
  
  // 9 Lifecycle Steps
  lifecycleSteps: MeetingLifecycleStep[];
  
  // Submódulos
  attendanceData: PublicAttendanceData;
  leadersCheckIn: LeaderCheckIn[];
  expenses: MeetingExpense[];
  
  // IA & Jurídico
  aiPredictiveAnalysis?: {
    expectedTurnoutScore: number;
    conversionEstimate: number; // Projected converted votes
    riskFactors: string[];
    speechRecommendations: string[];
    climateAlert?: string;
  };
  
  legalAuditSummary?: {
    isFullyCompliant: boolean;
    totalExpensesAmount: number;
    pendingReceiptsCount: number;
    auditFlags: string[];
  };
}
