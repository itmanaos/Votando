
import { 
  Voter, SupportLevel, TeamMember, UserRole, PollResult, VotingStation, 
  Survey, SurveyType, QuestionType, CandidateResult, TallyStats,
  UserProfile, AccessLog
} from './types';
import { INITIAL_IMPORTED_VOTERS } from './data/votersList';

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

export const MOCK_VOTERS: Voter[] = INITIAL_IMPORTED_VOTERS;

export const SPORTS_LEAGUE_TEAMS: TeamMember[] = [
  { id: 'LIGA-01', name: 'Liga Desportiva da Ajuricaba', role: UserRole.LEADER, territory: 'Ajuricaba', goals: 60, achieved: 0, phone: '(92) 98122-1001' },
  { id: 'LIGA-02', name: 'Liga Desportiva do Aleixo', role: UserRole.LEADER, territory: 'Aleixo', goals: 60, achieved: 0, phone: '(92) 98122-1002' },
  { id: 'LIGA-03', name: 'Liga Desportiva do Alvorada I', role: UserRole.COORDINATOR, territory: 'Alvorada I', goals: 60, achieved: 0, phone: '(92) 98122-1003' },
  { id: 'LIGA-04', name: 'Liga Desportiva do Alvorada II', role: UserRole.LEADER, territory: 'Alvorada II', goals: 60, achieved: 0, phone: '(92) 98122-1004' },
  { id: 'LIGA-05', name: 'Liga Desportiva do Alvorada III', role: UserRole.LEADER, territory: 'Alvorada III', goals: 60, achieved: 0, phone: '(92) 98122-1005' },
  { id: 'LIGA-06', name: 'Liga Desportiva da Aparecida', role: UserRole.LEADER, territory: 'Aparecida', goals: 60, achieved: 0, phone: '(92) 98122-1006' },
  { id: 'LIGA-07', name: 'Liga Desportiva do Armando Mendes', role: UserRole.LEADER, territory: 'Armando Mendes', goals: 60, achieved: 0, phone: '(92) 98122-1007' },
  { id: 'LIGA-08', name: 'Liga Desportiva da Cachoeirinha', role: UserRole.LEADER, territory: 'Cachoeirinha', goals: 60, achieved: 0, phone: '(92) 98122-1008' },
  { id: 'LIGA-09', name: 'Liga Desportiva da Chapada', role: UserRole.LEADER, territory: 'Chapada', goals: 60, achieved: 0, phone: '(92) 98122-1009' },
  { id: 'LIGA-10', name: 'Liga Desportiva do Bairro da Cidade Nova, Núcleo I', role: UserRole.COORDINATOR, territory: 'Cidade Nova - Núcleo I', goals: 60, achieved: 0, phone: '(92) 98122-1010' },
  { id: 'LIGA-11', name: 'Liga Desportiva do Bairro da Cidade Nova II, Núcleo 11', role: UserRole.LEADER, territory: 'Cidade Nova II - Núcleo 11', goals: 60, achieved: 0, phone: '(92) 98122-1011' },
  { id: 'LIGA-12', name: 'Liga Desportiva do Bairro da Colônia Oliveira Machado', role: UserRole.LEADER, territory: 'Colônia Oliveira Machado', goals: 60, achieved: 0, phone: '(92) 98122-1012' },
  { id: 'LIGA-13', name: 'Liga Desportiva do Bairro da Colônia Terra Nova III', role: UserRole.LEADER, territory: 'Colônia Terra Nova III', goals: 60, achieved: 0, phone: '(92) 98122-1013' },
  { id: 'LIGA-14', name: 'Liga Desportiva do Bairro da Compensa III', role: UserRole.COORDINATOR, territory: 'Compensa III', goals: 60, achieved: 0, phone: '(92) 98122-1014' },
  { id: 'LIGA-15', name: 'Liga Desportiva da Comunidade Nepal', role: UserRole.LEADER, territory: 'Comunidade Nepal', goals: 60, achieved: 0, phone: '(92) 98122-1015' },
  { id: 'LIGA-16', name: 'Liga Desportiva do Conjunto Manôa', role: UserRole.LEADER, territory: 'Conjunto Manôa', goals: 60, achieved: 0, phone: '(92) 98122-1016' },
  { id: 'LIGA-17', name: 'Liga Desportiva do Conjunto Oswaldo Frota e Emérico Medeiros', role: UserRole.LEADER, territory: 'Conjunto Oswaldo Frota / Emérico Medeiros', goals: 60, achieved: 0, phone: '(92) 98122-1017' },
  { id: 'LIGA-18', name: 'Liga Desportiva do Conjunto Viver Melhor', role: UserRole.COORDINATOR, territory: 'Conjunto Viver Melhor', goals: 60, achieved: 0, phone: '(92) 98122-1018' },
  { id: 'LIGA-19', name: 'Liga Desportiva do Coroado I', role: UserRole.LEADER, territory: 'Coroado I', goals: 60, achieved: 0, phone: '(92) 98122-1019' },
  { id: 'LIGA-20', name: 'Liga Desportiva do Crespo', role: UserRole.LEADER, territory: 'Crespo', goals: 60, achieved: 0, phone: '(92) 98122-1020' },
  { id: 'LIGA-21', name: 'Liga Desportiva do Bairro Cristo Rei', role: UserRole.LEADER, territory: 'Cristo Rei', goals: 60, achieved: 0, phone: '(92) 98122-1021' },
  { id: 'LIGA-22', name: 'Liga Desportiva do Bairro de Flores', role: UserRole.COORDINATOR, territory: 'Flores', goals: 60, achieved: 0, phone: '(92) 98122-1022' },
  { id: 'LIGA-23', name: 'Liga Desportiva do Bairro Florestal Cidade Nova', role: UserRole.LEADER, territory: 'Florestal Cidade Nova', goals: 60, achieved: 0, phone: '(92) 98122-1023' },
  { id: 'LIGA-24', name: 'Liga Desportiva do Bairro da Glória', role: UserRole.LEADER, territory: 'Glória', goals: 60, achieved: 0, phone: '(92) 98122-1024' },
  { id: 'LIGA-25', name: 'Liga Desportiva do Bairro Jardim dos Barés', role: UserRole.LEADER, territory: 'Jardim dos Barés', goals: 60, achieved: 0, phone: '(92) 98122-1025' },
  { id: 'LIGA-26', name: 'Liga Desportiva do João Paulo II', role: UserRole.LEADER, territory: 'João Paulo II', goals: 60, achieved: 0, phone: '(92) 98122-1026' },
  { id: 'LIGA-27', name: 'Liga Desportiva do Bairro Lírio do Vale II', role: UserRole.LEADER, territory: 'Lírio do Vale II', goals: 60, achieved: 0, phone: '(92) 98122-1027' },
  { id: 'LIGA-28', name: 'Liga Desportiva do Bairro do Mauazinho II', role: UserRole.LEADER, territory: 'Mauazinho II', goals: 60, achieved: 0, phone: '(92) 98122-1028' },
  { id: 'LIGA-29', name: 'Liga Desportiva do Bairro de Monte Pascoal', role: UserRole.LEADER, territory: 'Monte Pascoal', goals: 60, achieved: 0, phone: '(92) 98122-1029' },
  { id: 'LIGA-30', name: 'Liga Desportiva do Bairro de Nossa Senhora das Graças', role: UserRole.LEADER, territory: 'Nossa Senhora das Graças', goals: 60, achieved: 0, phone: '(92) 98122-1030' },
  { id: 'LIGA-31', name: 'Liga Desportiva do Bairro da Nova Cidade', role: UserRole.COORDINATOR, territory: 'Nova Cidade', goals: 60, achieved: 0, phone: '(92) 98122-1031' },
  { id: 'LIGA-32', name: 'Liga Desportiva do Bairro de Nova Esperança', role: UserRole.LEADER, territory: 'Nova Esperança', goals: 60, achieved: 0, phone: '(92) 98122-1032' },
  { id: 'LIGA-33', name: 'Liga Desportiva do Bairro de Nova Esperança II', role: UserRole.LEADER, territory: 'Nova Esperança II', goals: 60, achieved: 0, phone: '(92) 98122-1033' },
  { id: 'LIGA-34', name: 'Liga Desportiva do Bairro Nova Floresta', role: UserRole.LEADER, territory: 'Nova Floresta', goals: 60, achieved: 0, phone: '(92) 98122-1034' },
  { id: 'LIGA-35', name: 'Liga Desportiva do Bairro Nova Jerusalém em Petrópolis', role: UserRole.LEADER, territory: 'Nova Jerusalém / Petrópolis', goals: 60, achieved: 0, phone: '(92) 98122-1035' },
  { id: 'LIGA-36', name: 'Liga Desportiva do Nova Vitória', role: UserRole.LEADER, territory: 'Nova Vitória', goals: 60, achieved: 0, phone: '(92) 98122-1036' },
  { id: 'LIGA-37', name: 'Liga Desportiva do Bairro Parque das Laranjeiras – YAEL', role: UserRole.LEADER, territory: 'Parque das Laranjeiras - YAEL', goals: 60, achieved: 0, phone: '(92) 98122-1037' },
  { id: 'LIGA-38', name: 'Liga Desportiva do Bairro Parque das Nações', role: UserRole.LEADER, territory: 'Parque das Nações', goals: 60, achieved: 0, phone: '(92) 98122-1038' },
  { id: 'LIGA-39', name: 'Liga Desportiva do Parque Mauá', role: UserRole.LEADER, territory: 'Parque Mauá', goals: 60, achieved: 0, phone: '(92) 98122-1039' },
  { id: 'LIGA-40', name: 'Liga Desportiva do Bairro da Paz', role: UserRole.LEADER, territory: 'Bairro da Paz', goals: 60, achieved: 0, phone: '(92) 98122-1040' },
  { id: 'LIGA-41', name: 'Liga Desportiva do Bairro de Petrópolis', role: UserRole.COORDINATOR, territory: 'Petrópolis', goals: 60, achieved: 0, phone: '(92) 98122-1041' },
  { id: 'LIGA-42', name: 'Liga Desportiva do Bairro Presidente Vargas', role: UserRole.LEADER, territory: 'Presidente Vargas', goals: 60, achieved: 0, phone: '(92) 98122-1042' },
  { id: 'LIGA-43', name: 'Liga Desportiva do Bairro da Raiz', role: UserRole.LEADER, territory: 'Raiz', goals: 60, achieved: 0, phone: '(92) 98122-1043' },
  { id: 'LIGA-44', name: 'Liga Desportiva do Bairro de Santa Etelvina', role: UserRole.LEADER, territory: 'Santa Etelvina', goals: 60, achieved: 0, phone: '(92) 98122-1044' },
  { id: 'LIGA-45', name: 'Liga Desportiva do Bairro Santa Inês', role: UserRole.LEADER, territory: 'Santa Inês', goals: 60, achieved: 0, phone: '(92) 98122-1045' },
  { id: 'LIGA-46', name: 'Liga Desportiva do Bairro de Santo Antônio', role: UserRole.LEADER, territory: 'Santo Antônio', goals: 60, achieved: 0, phone: '(92) 98122-1046' },
  { id: 'LIGA-47', name: 'Liga Desportiva do Santos Dumont', role: UserRole.LEADER, territory: 'Santos Dumont', goals: 60, achieved: 0, phone: '(92) 98122-1047' },
  { id: 'LIGA-48', name: 'Liga Desportiva do Bairro de São Geraldo', role: UserRole.LEADER, territory: 'São Geraldo', goals: 60, achieved: 0, phone: '(92) 98122-1048' },
  { id: 'LIGA-49', name: 'Liga Desportiva do Bairro de São Jorge', role: UserRole.LEADER, territory: 'São Jorge', goals: 60, achieved: 0, phone: '(92) 98122-1049' },
  { id: 'LIGA-50', name: 'Liga Desportiva do Bairro de São José I', role: UserRole.COORDINATOR, territory: 'São José I', goals: 60, achieved: 0, phone: '(92) 98122-1050' },
  { id: 'LIGA-51', name: 'Liga Desportiva do Bairro de São José II', role: UserRole.LEADER, territory: 'São José II', goals: 60, achieved: 0, phone: '(92) 98122-1051' },
  { id: 'LIGA-52', name: 'Liga Desportiva do São Sebastião', role: UserRole.LEADER, territory: 'São Sebastião', goals: 60, achieved: 0, phone: '(92) 98122-1052' },
  { id: 'LIGA-53', name: 'Liga Desportiva do Bairro de São Sebastião (Setor II)', role: UserRole.LEADER, territory: 'São Sebastião - Setor II', goals: 60, achieved: 0, phone: '(92) 98122-1053' },
  { id: 'LIGA-54', name: 'Liga Desportiva do Bairro do Tarumã', role: UserRole.COORDINATOR, territory: 'Tarumã', goals: 60, achieved: 0, phone: '(92) 98122-1054' },
  { id: 'LIGA-55', name: 'Liga Desportiva da Vila Amazonas, Nossa Senhora das Graças', role: UserRole.LEADER, territory: 'Vila Amazonas / N. Sra. das Graças', goals: 60, achieved: 0, phone: '(92) 98122-1055' },
  { id: 'LIGA-56', name: 'Liga Desportiva do Bairro da Vila da Prata', role: UserRole.LEADER, territory: 'Vila da Prata', goals: 60, achieved: 0, phone: '(92) 98122-1056' },
  { id: 'LIGA-57', name: 'Liga Desportiva do Bairro Vitória Régia', role: UserRole.LEADER, territory: 'Vitória Régia', goals: 60, achieved: 0, phone: '(92) 98122-1057' },
];

export const MOCK_TEAMS: TeamMember[] = SPORTS_LEAGUE_TEAMS;

export const MOCK_POLLS: PollResult[] = [
  { id: 'P1', date: '2023-08-01', region: 'Geral', candidateA: 32, candidateB: 28, undecided: 20, sampleSize: 1200 },
  { id: 'P2', date: '2023-09-01', region: 'Geral', candidateA: 35, candidateB: 27, undecided: 15, sampleSize: 1200 },
  { id: 'P3', date: '2023-10-01', region: 'Geral', candidateA: 38, candidateB: 26, undecided: 12, sampleSize: 1500 },
];

export const MOCK_STATIONS: VotingStation[] = [
  { id: 'S1', name: 'Escola Municipal Central', address: 'Rua das Flores, 123', voterCount: 4500, coordinates: { lat: -23.5505, lng: -46.6333 }, strategicImportance: 'HIGH' },
  { id: 'S2', name: 'Colégio Estadual Norte', address: 'Av. Paulista, 900', voterCount: 2800, coordinates: { lat: -23.5611, lng: -46.6555 }, strategicImportance: 'MEDIUM' },
];

export const MOCK_CANDIDATES: CandidateResult[] = [
  { id: 'C1', name: 'Nosso Candidato', party: 'PVOT (45)', votes: 48293, percentage: 52.4, isMain: true, color: '#2563eb' },
  { id: 'C2', name: 'Oponente Principal', party: 'PROG (10)', votes: 39582, percentage: 42.9, isMain: false, color: '#ef4444' },
  { id: 'C3', name: 'Outros', party: '-', votes: 4281, percentage: 4.7, isMain: false, color: '#94a3b8' },
];

export const MOCK_TALLY_STATS: TallyStats = {
  sectionsTotal: 450,
  sectionsCounted: 384,
  votersTotal: 120000,
  votersPresent: 95000,
  validVotes: 92156,
  blankVotes: 1244,
  nullVotes: 1600,
  lastUpdate: '2024-10-06 21:45:12'
};

// ==========================================
// MOCK DATA - GESTÃO DE REUNIÕES & LIFECYCLE
// ==========================================

import { 
  Meeting, MeetingType, MeetingStatus, RACIRole, StepStatus, 
  ExpenseCategory, PaymentFundingSource, ComplianceAuditStatus 
} from './types';

export const DEFAULT_LIFECYCLE_STEPS = [
  {
    id: 1,
    name: 'Concepção',
    description: 'Definição de pauta, objetivos de conversão de votos e alinhamento com lideranças locais.',
    status: StepStatus.COMPLETED,
    raci: [
      { role: RACIRole.ACCOUNTABLE, assignedTo: 'Coordenação Geral' },
      { role: RACIRole.RESPONSIBLE, assignedTo: 'Líder Territorial' },
      { role: RACIRole.CONSULTED, assignedTo: 'Estrategista Político' },
      { role: RACIRole.INFORMED, assignedTo: 'Comunicação' }
    ],
    deadline: '-7 dias',
    completedAt: '2024-10-02 14:00',
    legalWarnings: ['Pauta deve focar em propostas programáticas sem promessa de vantagens pessoais.'],
    checklistItems: [
      { id: 'c1', text: 'Pauta e tema do encontro validados pelo comitê', completed: true, required: true },
      { id: 'c2', text: 'Meta quantitativa de público e lideranças fixada', completed: true, required: true },
      { id: 'c3', text: 'Roteiro de oradores e tempo de fala rascunhados', completed: true, required: false }
    ]
  },
  {
    id: 2,
    name: 'Logística',
    description: 'Reserva do local, vistorias de acessibilidade e protocolo formal de aviso às autoridades (Lei 9.504/97).',
    status: StepStatus.COMPLETED,
    raci: [
      { role: RACIRole.ACCOUNTABLE, assignedTo: 'Gerência de Logística' },
      { role: RACIRole.RESPONSIBLE, assignedTo: 'Coordenador Operacional' },
      { role: RACIRole.CONSULTED, assignedTo: 'Assessoria Jurídica' },
      { role: RACIRole.INFORMED, assignedTo: 'Segurança' }
    ],
    deadline: '-5 dias',
    completedAt: '2024-10-04 10:30',
    legalWarnings: ['Comunicação prévia à Polícia Militar e Juízo Eleitoral com antecedência mínima de 24h (Art. 39 Lei 9.504).'],
    checklistItems: [
      { id: 'c4', text: 'Locação formalizada com contrato e CNPJ do fornecedor', completed: true, required: true },
      { id: 'c5', text: 'Ofício de comunicação de evento público protocolado', completed: true, required: true },
      { id: 'c6', text: 'Plano de tráfego, estacionamento e acessibilidade definido', completed: true, required: false }
    ]
  },
  {
    id: 3,
    name: 'Sonorização',
    description: 'Contratação e testes de PA, microfones sem fio e controle rigoroso de decibéis permitidos.',
    status: StepStatus.COMPLETED,
    raci: [
      { role: RACIRole.ACCOUNTABLE, assignedTo: 'Produção Técnica' },
      { role: RACIRole.RESPONSIBLE, assignedTo: 'Técnico de Áudio' },
      { role: RACIRole.CONSULTED, assignedTo: 'Equipe de Cerimonial' },
      { role: RACIRole.INFORMED, assignedTo: 'Coordenação' }
    ],
    deadline: '-24 horas',
    completedAt: '2024-10-07 18:00',
    legalWarnings: ['Vedado uso de trios elétricos fora de comícios formais. Limite de 80 dB a 5 metros do equipamento.'],
    checklistItems: [
      { id: 'c7', text: 'Equipamento de som contratado com nota fiscal nominal', completed: true, required: true },
      { id: 'c8', text: 'Microfones com pilhas reservas e cabo de contingência', completed: true, required: true },
      { id: 'c9', text: 'Aferição acústica de decibéis em conformidade com a legislação', completed: true, required: true }
    ]
  },
  {
    id: 4,
    name: 'Alimentação',
    description: 'Fornecimento restrito e exclusivo de lanches para a equipe de trabalho e fiscais da campanha.',
    status: StepStatus.IN_PROGRESS,
    raci: [
      { role: RACIRole.ACCOUNTABLE, assignedTo: 'Administrativo da Campanha' },
      { role: RACIRole.RESPONSIBLE, assignedTo: 'Fiscal de Suprimentos' },
      { role: RACIRole.CONSULTED, assignedTo: 'Jurídico Eleitoral' },
      { role: RACIRole.INFORMED, assignedTo: 'Coordenação de Staff' }
    ],
    deadline: '-12 horas',
    legalWarnings: ['RIGOROSAMENTE PROIBIDA distribuição de alimentos, refrigerantes ou bebidas alcoólicas ao público geral (Captação Ilícita de Sufrágio / Art. 39, §6º).'],
    checklistItems: [
      { id: 'c10', text: 'Kit lanche quantificado estritamente pelo número de membros do staff credenciados', completed: true, required: true },
      { id: 'c11', text: 'Nota fiscal com descrição detalhada emitida para o CNPJ do candidato', completed: true, required: true },
      { id: 'c12', text: 'Área restrita de alimentação identificada com controle de crachá', completed: false, required: true }
    ]
  },
  {
    id: 5,
    name: 'Hidratação',
    description: 'Instalação de bebedouros / pontos de água mineral gratuita para participantes e equipe.',
    status: StepStatus.IN_PROGRESS,
    raci: [
      { role: RACIRole.ACCOUNTABLE, assignedTo: 'Produção' },
      { role: RACIRole.RESPONSIBLE, assignedTo: 'Apoio de Campo' },
      { role: RACIRole.CONSULTED, assignedTo: 'Brigada de Socorro' },
      { role: RACIRole.INFORMED, assignedTo: 'Voluntários' }
    ],
    deadline: '-6 horas',
    legalWarnings: ['Água mineral pode ser disponibilizada ao público como medida de saúde pública, sem qualquer rótulo ou propaganda partidária anexada ao copo.'],
    checklistItems: [
      { id: 'c13', text: 'Galões ou copos de água mineral sem personalização eleitoral', completed: true, required: true },
      { id: 'c14', text: 'Lixeiras seletivas distribuídas para descarte imediato', completed: false, required: true }
    ]
  },
  {
    id: 6,
    name: 'Montagem',
    description: 'Estruturação do espaço, backdrop oficial do candidato/coligação, assentos e checagem de segurança.',
    status: StepStatus.PENDING,
    raci: [
      { role: RACIRole.ACCOUNTABLE, assignedTo: 'Produção Visual' },
      { role: RACIRole.RESPONSIBLE, assignedTo: 'Montadores Credenciados' },
      { role: RACIRole.CONSULTED, assignedTo: 'Segurança' },
      { role: RACIRole.INFORMED, assignedTo: 'Coordenação' }
    ],
    deadline: '-3 horas',
    legalWarnings: ['Backdrop deve conter obrigatoriamente: Nome do Candidato, Nome do Vice, Partido, CNPJ da Campanha e Tiragem gráfica.'],
    checklistItems: [
      { id: 'c15', text: 'Backdrop com informações legais e CNPJ da gráfica visíveis', completed: false, required: true },
      { id: 'c16', text: 'Disposição de cadeiras e rotas de fuga desobstruídas', completed: false, required: true },
      { id: 'c17', text: 'Bancada de credenciamento e recepção de lideranças pronta', completed: false, required: true }
    ]
  },
  {
    id: 7,
    name: 'Realização',
    description: 'Execução do evento, controle de check-in, cerimonial, cronômetro de falas e registros de imagem.',
    status: StepStatus.PENDING,
    raci: [
      { role: RACIRole.ACCOUNTABLE, assignedTo: 'Mestre de Cerimônias / Candidato' },
      { role: RACIRole.RESPONSIBLE, assignedTo: 'Coordenação de Palanque' },
      { role: RACIRole.CONSULTED, assignedTo: 'Assessoria de Imprensa' },
      { role: RACIRole.INFORMED, assignedTo: 'Multiplicadores Digitais' }
    ],
    deadline: 'Hora H',
    legalWarnings: ['Vedada apresentação artística ou músicos remunerados (Vedação a Showmício - Art. 39, §7º).'],
    checklistItems: [
      { id: 'c18', text: 'Contabilização de densidade e check-in de lideranças em andamento', completed: false, required: true },
      { id: 'c19', text: 'Gravação em áudio e vídeo para arquivo jurídico e prestação de contas', completed: false, required: true },
      { id: 'c20', text: 'Transmissão ao vivo nas redes oficiais monitorada', completed: false, required: false }
    ]
  },
  {
    id: 8,
    name: 'Desmontagem',
    description: 'Recolhimento dos equipamentos, limpeza completa do local e devolução das chaves.',
    status: StepStatus.PENDING,
    raci: [
      { role: RACIRole.ACCOUNTABLE, assignedTo: 'Gerência de Logística' },
      { role: RACIRole.RESPONSIBLE, assignedTo: 'Equipe de Limpeza e Apoio' },
      { role: RACIRole.CONSULTED, assignedTo: 'Locador do Imóvel' },
      { role: RACIRole.INFORMED, assignedTo: 'Administrativo' }
    ],
    deadline: '+2 horas após evento',
    legalWarnings: ['Obrigatoriedade de recolhimento de materiais promocionais e não deixar resíduos em vias públicas.'],
    checklistItems: [
      { id: 'c21', text: 'Recolhimento de todos os equipamentos alugados', completed: false, required: true },
      { id: 'c22', text: 'Vistoria final do espaço e termo de entrega assinado', completed: false, required: true },
      { id: 'c23', text: 'Limpeza e descarte ecológico de sobras de material', completed: false, required: true }
    ]
  },
  {
    id: 9,
    name: 'Relatório Final',
    description: 'Consolidação de público presente, atas de adesão, fechamento contábil e auditoria documental.',
    status: StepStatus.PENDING,
    raci: [
      { role: RACIRole.ACCOUNTABLE, assignedTo: 'Advogado Eleitoral / Contador' },
      { role: RACIRole.RESPONSIBLE, assignedTo: 'Secretaria Executiva' },
      { role: RACIRole.CONSULTED, assignedTo: 'Coordenação Geral' },
      { role: RACIRole.INFORMED, assignedTo: 'Candidato' }
    ],
    deadline: '+24 horas após evento',
    legalWarnings: ['Todas as notas fiscais devem ser lançadas no SPCE (Sistema de Prestação de Contas Eleitorais) no prazo legal.'],
    checklistItems: [
      { id: 'c24', text: 'Relatório de público e lideranças consolidado no sistema', completed: false, required: true },
      { id: 'c25', text: 'Auditoria de 100% das notas fiscais e recibos bancários concluída', completed: false, required: true },
      { id: 'c26', text: 'Encaminhamento da pasta do evento para a contabilidade eleitoral', completed: false, required: true }
    ]
  }
];

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'M-2026-08-25',
    title: 'REUNIÃO SEMANAL - Alinhamento Estratégico & Metas de Mobilização',
    type: MeetingType.PLENARY,
    status: MeetingStatus.SCHEDULED,
    date: '2026-08-25',
    startTime: '19:00',
    endTime: '21:00',
    venueName: 'Comitê Central de Campanha - Salão Plenário',
    address: 'Av. Brigadeiro Faria Lima, 2800',
    neighborhood: 'Pinheiros',
    votingZone: '102',
    coordinates: { lat: -23.5812, lng: -46.6854 },
    venueCapacity: 200,
    isOutdoor: false,
    coordinatorId: 'L6',
    coordinatorName: 'Roberto Vasconcelos',
    expectedAttendance: 150,
    confirmedAttendance: 140,
    topic: 'REUNIÃO SEMANAL (25/Ago): Abertura do ciclo semanal, distribuição de metas por território e lançamento do cronograma de visitas.',
    targetAudience: 'Coordenação Geral, Coordenadores Regionais e Lideranças Chave',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS,
    attendanceData: {
      venueAreaM2: 150,
      densityFactor: 1.8,
      calculatedDensityCount: 145,
      manualCount: 140,
      aiEstimatedCount: 142,
      aiConfidence: 94,
      leadersPresentCount: 8,
      totalSupportersMobilized: 130
    },
    leadersCheckIn: [
      { id: 'lc1', leaderName: 'Dr. Arnaldo Silveira', role: 'Presidente Assoc. Médicos', territory: 'Zona Sul', phone: '(11) 98765-4321', expectedSupporters: 25, status: 'CONFIRMADO' },
      { id: 'lc2', leaderName: 'Valéria Santana', role: 'Líder Comunitária Jd. Angela', territory: 'Zona Sul', phone: '(11) 97654-3210', expectedSupporters: 30, status: 'CONFIRMADO' },
      { id: 'lc3', leaderName: 'Roberto Vasconcelos', role: 'Coordenação Geral', territory: 'Geral', phone: '(11) 98888-6666', expectedSupporters: 40, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp1',
        category: ExpenseCategory.VENUE_RENTAL,
        description: 'Locação e infraestrutura de auditório para reunião semanal',
        supplierName: 'Espaço Faria Lima Eventos Ltda',
        supplierTaxId: '12.345.678/0001-90',
        amount: 1500.00,
        fundingSource: PaymentFundingSource.CAMPAIGN_BANK_ACCOUNT,
        documentType: 'NF-e',
        documentNumber: '005810',
        invoiceFileName: 'nfe_comite_central_005810.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Nota fiscal emitida com CNPJ de campanha e discriminada.',
        registeredBy: 'Gerência Financeira',
        createdAt: '2026-08-20'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 94,
      conversionEstimate: 125,
      riskFactors: [
        'Horário de pico no trânsito da Faria Lima (recomendar chegada com 30min de antecedência)',
        'Necessidade de credenciamento ágil na recepção'
      ],
      speechRecommendations: [
        'Apresentar panorama do crescimento das pesquisas e reforçar unidade',
        'Definir metas semanais claras de contato com eleitores por líder'
      ],
      climateAlert: 'Ambiente climatizado.'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 1500.00,
      pendingReceiptsCount: 0,
      auditFlags: ['Despesa em conformidade com as regras do TSE (Lei 9.504/97).']
    }
  },
  {
    id: 'M-2026-08-27',
    title: 'REUNIÃO SEMANAL - Operações de Rua & Logística Territorial',
    type: MeetingType.LEADERS_MEETING,
    status: MeetingStatus.SCHEDULED,
    date: '2026-08-27',
    startTime: '19:00',
    endTime: '21:00',
    venueName: 'Espaço Comunitário Santo Amaro',
    address: 'Av. Adolfo Pinheiro, 1420',
    neighborhood: 'Santo Amaro',
    votingZone: '088',
    coordinates: { lat: -23.6521, lng: -46.7032 },
    venueCapacity: 180,
    isOutdoor: false,
    coordinatorId: 'L1',
    coordinatorName: 'Ricardo Mendes',
    expectedAttendance: 120,
    confirmedAttendance: 110,
    topic: 'REUNIÃO SEMANAL (27/Ago): Organização das equipes de bandeiraço, pontos de panfletagem e rotas de vans na Zona Sul.',
    targetAudience: 'Lideranças da Zona Sul, cabos eleitorais e voluntários',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS,
    attendanceData: {
      venueAreaM2: 120,
      densityFactor: 1.6,
      calculatedDensityCount: 115,
      manualCount: 110,
      aiEstimatedCount: 112,
      aiConfidence: 91,
      leadersPresentCount: 6,
      totalSupportersMobilized: 95
    },
    leadersCheckIn: [
      { id: 'lc4', leaderName: 'Ricardo Mendes', role: 'Coord. Zona Sul', territory: 'Zona Sul', phone: '(11) 98888-1111', expectedSupporters: 35, status: 'CONFIRMADO' },
      { id: 'lc5', leaderName: 'Pastor Ezequiel', role: 'Conselho Comunitário Sul', territory: 'Zona Sul', phone: '(11) 96543-2109', expectedSupporters: 40, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp2',
        category: ExpenseCategory.SOUND_LIGHTING,
        description: 'Sonorização portátil e microfones para plenária setorial',
        supplierName: 'AudioTech Pro Áudio Eireli',
        supplierTaxId: '98.765.432/0001-11',
        amount: 800.00,
        fundingSource: PaymentFundingSource.CAMPAIGN_BANK_ACCOUNT,
        documentType: 'NF-e',
        documentNumber: '001420',
        invoiceFileName: 'nfe_som_santo_amaro_001420.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Dentro do limite de decibéis permitido.',
        registeredBy: 'Gerência Financeira',
        createdAt: '2026-08-22'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 90,
      conversionEstimate: 85,
      riskFactors: ['Verificar abastecimento das caixas de som e material impresso'],
      speechRecommendations: ['Focar em propostas de transporte público e corredores de ônibus para Santo Amaro.'],
      climateAlert: 'Tempo firme previsto.'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 800.00,
      pendingReceiptsCount: 0,
      auditFlags: ['Regularidade cadastral e financeira aprovada.']
    }
  },
  {
    id: 'M-2026-09-01',
    title: 'REUNIÃO SEMANAL - Avaliação de Desempenho & Metas Territoriais',
    type: MeetingType.PLENARY,
    status: MeetingStatus.SCHEDULED,
    date: '2026-09-01',
    startTime: '19:00',
    endTime: '21:00',
    venueName: 'Auditório Centro Empresarial Norte',
    address: 'Av. Cruzeiro do Sul, 1800',
    neighborhood: 'Santana',
    votingZone: '105',
    coordinates: { lat: -23.5042, lng: -46.6251 },
    venueCapacity: 250,
    isOutdoor: false,
    coordinatorId: 'L2',
    coordinatorName: 'Fernanda Lima',
    expectedAttendance: 180,
    confirmedAttendance: 165,
    topic: 'REUNIÃO SEMANAL (01/Set): Revisão dos indicadores da primeira semana de setembro, análise dos formulários e reforço na Zona Norte.',
    targetAudience: 'Lideranças comunitárias da Zona Norte e equipe de inteligência',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS,
    attendanceData: {
      venueAreaM2: 160,
      densityFactor: 1.7,
      calculatedDensityCount: 170,
      manualCount: 165,
      aiEstimatedCount: 168,
      aiConfidence: 93,
      leadersPresentCount: 9,
      totalSupportersMobilized: 150
    },
    leadersCheckIn: [
      { id: 'lc6', leaderName: 'Fernanda Lima', role: 'Coord. Zona Norte', territory: 'Zona Norte', phone: '(11) 98888-2222', expectedSupporters: 45, status: 'CONFIRMADO' },
      { id: 'lc7', leaderName: 'Marcos Santos (Negão)', role: 'Coordenador Bloco Cultural', territory: 'Zona Norte', phone: '(11) 92109-8765', expectedSupporters: 50, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp3',
        category: ExpenseCategory.VENUE_RENTAL,
        description: 'Locação de auditório para plenária regional da Zona Norte',
        supplierName: 'Centro Empresarial Santana Ltda',
        supplierTaxId: '44.333.222/0001-99',
        amount: 1800.00,
        fundingSource: PaymentFundingSource.FEFC,
        documentType: 'NF-e',
        documentNumber: '007890',
        invoiceFileName: 'nfe_auditorio_norte_007890.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Recurso especial FEFC com emissão regular.',
        registeredBy: 'Gerência Financeira',
        createdAt: '2026-08-28'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 92,
      conversionEstimate: 140,
      riskFactors: ['Fluxo de chegada próximo à estação Santana do metrô'],
      speechRecommendations: ['Destacar investimentos em creches e UBSs para a Zona Norte.'],
      climateAlert: 'Noite com temperatura de 21°C.'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 1800.00,
      pendingReceiptsCount: 0,
      auditFlags: ['Documentação e prestação de contas integralmente validadas.']
    }
  },
  {
    id: 'M-2026-09-03',
    title: 'REUNIÃO SEMANAL - Estratégia Digital, Redes & WhatsApp',
    type: MeetingType.NEIGHBORHOOD_TALK,
    status: MeetingStatus.SCHEDULED,
    date: '2026-09-03',
    startTime: '19:30',
    endTime: '21:30',
    venueName: 'Hub Coworking Pinheiros',
    address: 'Rua dos Pinheiros, 890',
    neighborhood: 'Pinheiros',
    votingZone: '082',
    coordinates: { lat: -23.5678, lng: -46.6912 },
    venueCapacity: 100,
    isOutdoor: false,
    coordinatorId: 'L5',
    coordinatorName: 'Lucas Ferraz',
    expectedAttendance: 80,
    confirmedAttendance: 75,
    topic: 'REUNIÃO SEMANAL (03/Set): Alinhamento da fábrica de cortes de vídeo, mobilização de grupos de WhatsApp e resposta rápida a fake news.',
    targetAudience: 'Criadores de conteúdo, comunicadores e multiplicadores digitais',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS,
    attendanceData: {
      venueAreaM2: 75,
      densityFactor: 1.3,
      calculatedDensityCount: 78,
      manualCount: 75,
      aiEstimatedCount: 76,
      aiConfidence: 95,
      leadersPresentCount: 6,
      totalSupportersMobilized: 65
    },
    leadersCheckIn: [
      { id: 'lc8', leaderName: 'Lucas Ferraz', role: 'Coord. Inovação & Digital', territory: 'Zona Oeste', phone: '(11) 98888-5555', expectedSupporters: 30, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp4',
        category: ExpenseCategory.VENUE_RENTAL,
        description: 'Locação de sala de reuniões com link dedicado de alta velocidade',
        supplierName: 'Pinheiros Work Place SA',
        supplierTaxId: '11.444.777/0001-88',
        amount: 900.00,
        fundingSource: PaymentFundingSource.CAMPAIGN_BANK_ACCOUNT,
        documentType: 'NF-e',
        documentNumber: '009941',
        invoiceFileName: 'nfe_coworking_009941.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Recurso bancário próprio de campanha.',
        registeredBy: 'Gerência Financeira',
        createdAt: '2026-08-30'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 95,
      conversionEstimate: 60,
      riskFactors: ['Garantir que todos os participantes tenham o pacote de criativos baixado'],
      speechRecommendations: ['Apresentar números de engajamento no Instagram e TikTok da campanha.'],
      climateAlert: 'Espaço climatizado.'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 900.00,
      pendingReceiptsCount: 0,
      auditFlags: ['Sem pendências contábeis.']
    }
  },
  {
    id: 'M-2026-09-08',
    title: 'REUNIÃO SEMANAL - Alinhamento Jurídico & Prestação de Contas Parcial',
    type: MeetingType.LEADERS_MEETING,
    status: MeetingStatus.SCHEDULED,
    date: '2026-09-08',
    startTime: '18:30',
    endTime: '20:30',
    venueName: 'Comitê Central de Campanha',
    address: 'Av. Brigadeiro Faria Lima, 2800',
    neighborhood: 'Pinheiros',
    votingZone: '102',
    coordinates: { lat: -23.5812, lng: -46.6854 },
    venueCapacity: 150,
    isOutdoor: false,
    coordinatorId: 'L6',
    coordinatorName: 'Roberto Vasconcelos',
    expectedAttendance: 90,
    confirmedAttendance: 85,
    topic: 'REUNIÃO SEMANAL (08/Set): Auditoria legal e contábil, conferência de notas fiscais do SPCE e conformidade das normas de propaganda TSE.',
    targetAudience: 'Contabilidade eleitoral, assessoria jurídica e tesouraria',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS,
    attendanceData: {
      venueAreaM2: 100,
      densityFactor: 1.2,
      calculatedDensityCount: 88,
      manualCount: 85,
      aiEstimatedCount: 86,
      aiConfidence: 96,
      leadersPresentCount: 7,
      totalSupportersMobilized: 80
    },
    leadersCheckIn: [
      { id: 'lc9', leaderName: 'Dr. Roberto Vasconcelos', role: 'Coordenador Geral', territory: 'Geral', phone: '(11) 98888-6666', expectedSupporters: 20, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp5',
        category: ExpenseCategory.LEGAL_ACCOUNTING,
        description: 'Consultoria técnica de conformidade para entrega da prestação de contas parcial',
        supplierName: 'Advocacia Eleitoral & Associados',
        supplierTaxId: '66.777.888/0001-33',
        amount: 2500.00,
        fundingSource: PaymentFundingSource.FEFC,
        documentType: 'NF-e',
        documentNumber: '003310',
        invoiceFileName: 'nfe_juridico_003310.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Conforme art. 26 da Lei 9.504/97.',
        registeredBy: 'Gerência Financeira',
        createdAt: '2026-09-04'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 96,
      conversionEstimate: 70,
      riskFactors: ['Atenção aos prazos estritos de envio do relatório parcial ao TSE'],
      speechRecommendations: ['Reforçar a todos os coordenadores que nenhum recibo pode ficar sem comprovante bancário.'],
      climateAlert: 'Comitê interno fechado.'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 2500.00,
      pendingReceiptsCount: 0,
      auditFlags: ['100% de conformidade documental comprovada.']
    }
  },
  {
    id: 'M-2026-09-10',
    title: 'REUNIÃO SEMANAL - Logística de Material & Mega-Caravana Leste',
    type: MeetingType.PLENARY,
    status: MeetingStatus.SCHEDULED,
    date: '2026-09-10',
    startTime: '19:00',
    endTime: '21:30',
    venueName: 'Teatro Comunitário Arthur Azevedo',
    address: 'Av. Radial Leste, 4500',
    neighborhood: 'Itaquera',
    votingZone: '094',
    coordinates: { lat: -23.5385, lng: -46.4532 },
    venueCapacity: 350,
    isOutdoor: false,
    coordinatorId: 'L4',
    coordinatorName: 'Camila Alencar',
    expectedAttendance: 260,
    confirmedAttendance: 240,
    topic: 'REUNIÃO SEMANAL (10/Set): Alinhamento das carreatas e caminhadas da Zona Leste, reabastecimento de santinhos e adesivaço.',
    targetAudience: 'Lideranças da Zona Leste, motoristas de comitiva e voluntários',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS,
    attendanceData: {
      venueAreaM2: 220,
      densityFactor: 1.9,
      calculatedDensityCount: 250,
      manualCount: 240,
      aiEstimatedCount: 245,
      aiConfidence: 92,
      leadersPresentCount: 11,
      totalSupportersMobilized: 215
    },
    leadersCheckIn: [
      { id: 'lc10', leaderName: 'Camila Alencar', role: 'Coord. Zona Leste', territory: 'Zona Leste', phone: '(11) 98888-4444', expectedSupporters: 60, status: 'CONFIRMADO' },
      { id: 'lc11', leaderName: 'Prof. Henrique Dias', role: 'Coord. Cursinho Popular', territory: 'Zona Leste', phone: '(11) 98222-3344', expectedSupporters: 50, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp6',
        category: ExpenseCategory.GRAPHIC_MATERIALS,
        description: 'Material impresso informativo para caravana da Zona Leste com CNPJ e tiragem legal',
        supplierName: 'Gráfica Eleitoral Rápida Ltda',
        supplierTaxId: '33.222.111/0001-55',
        amount: 2100.00,
        fundingSource: PaymentFundingSource.FEFC,
        documentType: 'NF-e',
        documentNumber: '004120',
        invoiceFileName: 'nfe_grafica_leste_004120.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Tiragem e dados do candidato devidamente expressos.',
        registeredBy: 'Gerência Financeira',
        createdAt: '2026-09-06'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 91,
      conversionEstimate: 190,
      riskFactors: ['Verificar rota do trânsito na Radial Leste e segurança das equipes'],
      speechRecommendations: ['Focar em propostas para mobilidade sobre trilhos e geração de empregos locais.'],
      climateAlert: 'Previsão de clima favorável.'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 2100.00,
      pendingReceiptsCount: 0,
      auditFlags: ['Em conformidade com teto de gastos eleitorais.']
    }
  },
  {
    id: 'M-2026-09-15',
    title: 'REUNIÃO SEMANAL - Reta Final: Monitoramento e Pesquisas de Campo',
    type: MeetingType.LEADERS_MEETING,
    status: MeetingStatus.SCHEDULED,
    date: '2026-09-15',
    startTime: '19:00',
    endTime: '21:00',
    venueName: 'Auditório da Associação Comercial Central',
    address: 'Rua Direita, 250 - 4º Andar',
    neighborhood: 'Centro',
    votingZone: '102',
    coordinates: { lat: -23.5489, lng: -46.6341 },
    venueCapacity: 120,
    isOutdoor: false,
    coordinatorId: 'L3',
    coordinatorName: 'Marcos Paulo',
    expectedAttendance: 95,
    confirmedAttendance: 90,
    topic: 'REUNIÃO SEMANAL (15/Set): Análise das pesquisas internas de tracking eleitoral, foco de convencimento de indecisos na reta final.',
    targetAudience: 'Comitê político executivo e coordenadores de macro-região',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS,
    attendanceData: {
      venueAreaM2: 90,
      densityFactor: 1.4,
      calculatedDensityCount: 92,
      manualCount: 90,
      aiEstimatedCount: 91,
      aiConfidence: 94,
      leadersPresentCount: 8,
      totalSupportersMobilized: 82
    },
    leadersCheckIn: [
      { id: 'lc12', leaderName: 'Marcos Paulo', role: 'Coord. Centro', territory: 'Centro', phone: '(11) 98888-3333', expectedSupporters: 35, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp7',
        category: ExpenseCategory.VENUE_RENTAL,
        description: 'Locação do auditório da associação comercial com projetor',
        supplierName: 'Associação Comercial Central',
        supplierTaxId: '22.111.000/0001-44',
        amount: 850.00,
        fundingSource: PaymentFundingSource.CAMPAIGN_BANK_ACCOUNT,
        documentType: 'NF-e',
        documentNumber: '006733',
        invoiceFileName: 'nfe_comercial_006733.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Recursos bancários de campanha.',
        registeredBy: 'Gerência Financeira',
        createdAt: '2026-09-11'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 93,
      conversionEstimate: 75,
      riskFactors: ['Foco em retenção do voto consolidado e conversão da faixa de 18 a 29 anos'],
      speechRecommendations: ['Apresentar comparativo de propostas e enfatizar a experiência de gestão.'],
      climateAlert: 'Ambiente interno climatizado.'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 850.00,
      pendingReceiptsCount: 0,
      auditFlags: ['Despesa aprovada sem apontamentos.']
    }
  },
  {
    id: 'M-2026-09-17',
    title: 'REUNIÃO SEMANAL - Treinamento de Fiscais e Delegados de Votação',
    type: MeetingType.PLENARY,
    status: MeetingStatus.SCHEDULED,
    date: '2026-09-17',
    startTime: '19:00',
    endTime: '21:30',
    venueName: 'Espaço Comunitário Santo Amaro',
    address: 'Av. Adolfo Pinheiro, 1420',
    neighborhood: 'Santo Amaro',
    votingZone: '088',
    coordinates: { lat: -23.6521, lng: -46.7032 },
    venueCapacity: 300,
    isOutdoor: false,
    coordinatorId: 'L1',
    coordinatorName: 'Ricardo Mendes',
    expectedAttendance: 220,
    confirmedAttendance: 200,
    topic: 'REUNIÃO SEMANAL (17/Set): Credenciamento oficial de fiscais perante o TRE, instruções para impugnação de seções e coleta do Boletim de Urna (BU).',
    targetAudience: 'Fiscais de seção, delegados partidários e advogados de plantão',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS,
    attendanceData: {
      venueAreaM2: 180,
      densityFactor: 2.0,
      calculatedDensityCount: 210,
      manualCount: 200,
      aiEstimatedCount: 205,
      aiConfidence: 95,
      leadersPresentCount: 14,
      totalSupportersMobilized: 185
    },
    leadersCheckIn: [
      { id: 'lc13', leaderName: 'Ricardo Mendes', role: 'Coord. Zona Sul', territory: 'Zona Sul', phone: '(11) 98888-1111', expectedSupporters: 50, status: 'CONFIRMADO' },
      { id: 'lc14', leaderName: 'Valéria Santana', role: 'Líder Comunitária Jd. Angela', territory: 'Zona Sul', phone: '(11) 97654-3210', expectedSupporters: 45, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp8',
        category: ExpenseCategory.STAFF_MEALS,
        description: 'Fornecimento de água e lanches credenciados para treinamento de fiscais',
        supplierName: 'Panificadora e Lanches Padrão ME',
        supplierTaxId: '45.123.890/0001-44',
        amount: 600.00,
        fundingSource: PaymentFundingSource.CAMPAIGN_BANK_ACCOUNT,
        documentType: 'NF-e',
        documentNumber: '009102',
        invoiceFileName: 'nfe_lanches_fiscais_009102.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Alimentação restrita aos fiscais e equipe de trabalho credenciada (Art. 39, §6º).',
        registeredBy: 'Gerência Financeira',
        createdAt: '2026-09-13'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 96,
      conversionEstimate: 160,
      riskFactors: ['Garantir que 100% dos fiscais recebam crachá padronizado e aplicativo instalado'],
      speechRecommendations: ['Instruir sobre postura republicana, respeito às normas eleitorais e atenção ao lacre das urnas.'],
      climateAlert: 'Clima ameno.'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 600.00,
      pendingReceiptsCount: 0,
      auditFlags: ['Conformidade total com a Resolução TSE sobre fiscais partidários.']
    }
  },
  {
    id: 'M-2026-09-22',
    title: 'REUNIÃO SEMANAL - Mobilização Geral de Voluntários & Blitz dos Últimos Dias',
    type: MeetingType.PLENARY,
    status: MeetingStatus.SCHEDULED,
    date: '2026-09-22',
    startTime: '19:00',
    endTime: '21:30',
    venueName: 'Ginásio Poliesportivo Central',
    address: 'Rua São Joaquim, 400',
    neighborhood: 'Liberdade',
    votingZone: '102',
    coordinates: { lat: -23.5601, lng: -46.6382 },
    venueCapacity: 500,
    isOutdoor: false,
    coordinatorId: 'L6',
    coordinatorName: 'Roberto Vasconcelos',
    expectedAttendance: 420,
    confirmedAttendance: 390,
    topic: 'REUNIÃO SEMANAL (22/Set): Alinhamento final de todas as frentes de rua para a última semana de campanha, distribuição de kits e energia total.',
    targetAudience: 'Todos os multiplicadores, voluntários e coordenadores setoriais',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS,
    attendanceData: {
      venueAreaM2: 320,
      densityFactor: 2.3,
      calculatedDensityCount: 400,
      manualCount: 390,
      aiEstimatedCount: 395,
      aiConfidence: 94,
      leadersPresentCount: 18,
      totalSupportersMobilized: 360
    },
    leadersCheckIn: [
      { id: 'lc15', leaderName: 'Roberto Vasconcelos', role: 'Coordenação Geral', territory: 'Geral', phone: '(11) 98888-6666', expectedSupporters: 100, status: 'CONFIRMADO' },
      { id: 'lc16', leaderName: 'Fernanda Lima', role: 'Coord. Zona Norte', territory: 'Zona Norte', phone: '(11) 98888-2222', expectedSupporters: 70, status: 'CONFIRMADO' },
      { id: 'lc17', leaderName: 'Camila Alencar', role: 'Coord. Zona Leste', territory: 'Zona Leste', phone: '(11) 98888-4444', expectedSupporters: 80, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp9',
        category: ExpenseCategory.SOUND_LIGHTING,
        description: 'Sonorização de grande porte e iluminação para plenária geral de voluntários',
        supplierName: 'AudioTech Pro Áudio Eireli',
        supplierTaxId: '98.765.432/0001-11',
        amount: 3200.00,
        fundingSource: PaymentFundingSource.FEFC,
        documentType: 'NF-e',
        documentNumber: '002890',
        invoiceFileName: 'nfe_som_ginasio_002890.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Nota fiscal discriminada e em conformidade legal.',
        registeredBy: 'Gerência Financeira',
        createdAt: '2026-09-18'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 97,
      conversionEstimate: 310,
      riskFactors: ['Organização de filas de entrada no ginásio para evitar aglomerações na calçada'],
      speechRecommendations: ['Discurso inspirador de encerramento de campanha, agradecimento aos voluntários e foco na virada.'],
      climateAlert: 'Ambiente amplo e ventilado.'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 3200.00,
      pendingReceiptsCount: 0,
      auditFlags: ['Prestação de contas regular.']
    }
  },
  {
    id: 'M-2026-09-24',
    title: 'REUNIÃO SEMANAL - Operação Dia D, Fiscalização e Apuração Paralela',
    type: MeetingType.PLENARY,
    status: MeetingStatus.SCHEDULED,
    date: '2026-09-24',
    startTime: '19:00',
    endTime: '21:00',
    venueName: 'Comitê Central de Campanha - Salão Master',
    address: 'Av. Brigadeiro Faria Lima, 2800',
    neighborhood: 'Pinheiros',
    votingZone: '102',
    coordinates: { lat: -23.5812, lng: -46.6854 },
    venueCapacity: 250,
    isOutdoor: false,
    coordinatorId: 'L6',
    coordinatorName: 'Roberto Vasconcelos',
    expectedAttendance: 200,
    confirmedAttendance: 195,
    topic: 'REUNIÃO SEMANAL (24/Set): Definição dos postos de apuração rápida, logística de envio de fotos de BUs e central jurídica de emergência no dia da eleição.',
    targetAudience: 'Coordenação Geral, Coordenadores de Zonas Eleitorais e Plantão Jurídico',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS,
    attendanceData: {
      venueAreaM2: 170,
      densityFactor: 1.9,
      calculatedDensityCount: 200,
      manualCount: 195,
      aiEstimatedCount: 198,
      aiConfidence: 96,
      leadersPresentCount: 12,
      totalSupportersMobilized: 180
    },
    leadersCheckIn: [
      { id: 'lc18', leaderName: 'Roberto Vasconcelos', role: 'Coordenação Geral', territory: 'Geral', phone: '(11) 98888-6666', expectedSupporters: 50, status: 'CONFIRMADO' },
      { id: 'lc19', leaderName: 'Lucas Ferraz', role: 'Coord. Inovação & Dados', territory: 'Zona Oeste', phone: '(11) 98888-5555', expectedSupporters: 30, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp10',
        category: ExpenseCategory.VENUE_RENTAL,
        description: 'Locação do espaço central com infraestrutura de rede para apuração e central jurídica',
        supplierName: 'Espaço Faria Lima Eventos Ltda',
        supplierTaxId: '12.345.678/0001-90',
        amount: 1800.00,
        fundingSource: PaymentFundingSource.CAMPAIGN_BANK_ACCOUNT,
        documentType: 'NF-e',
        documentNumber: '006120',
        invoiceFileName: 'nfe_comite_central_006120.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Total conformidade com as regras do TSE.',
        registeredBy: 'Gerência Financeira',
        createdAt: '2026-09-20'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 98,
      conversionEstimate: 160,
      riskFactors: ['Testar redundância de conexão de internet e gerador de energia'],
      speechRecommendations: ['Instruir todos sobre a conferência rigorosa dos Boletins de Urna e envio imediato no app.'],
      climateAlert: 'Comitê central climatizado.'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 1800.00,
      pendingReceiptsCount: 0,
      auditFlags: ['Conformidade jurídica e contábil 100% atestada.']
    }
  }
];

// ==========================================
// AUTENTICAÇÃO, PERMISSÕES E USUÁRIO GLOBAL
// ==========================================

export const SYSTEM_PERMISSIONS = [
  { id: 'DASHBOARD_FULL', label: 'Dashboard & Indicadores Globais', category: 'Geral' },
  { id: 'MEETINGS_MANAGE', label: 'Gestão de Reuniões & Checklist RACI', category: 'Operações' },
  { id: 'JACOBS_AUDIT', label: 'Auditoria de Público (Método de Jacobs)', category: 'Operações' },
  { id: 'FINANCIAL_COMPLIANCE', label: 'Prestação de Contas & Compliance TSE', category: 'Jurídico/Financeiro' },
  { id: 'VOTERS_FULL', label: 'Base de Eleitores & Segmentação', category: 'Mobilização' },
  { id: 'TEAMS_MANAGE', label: 'Gestão de Equipes & Multiplicadores', category: 'Mobilização' },
  { id: 'POLLS_MANAGE', label: 'Pesquisas Eleitorais & Formulários', category: 'Estratégia' },
  { id: 'TALLY_MANAGE', label: 'Apuração Paralela & Fiscais de Seção', category: 'Eleição' },
  { id: 'MAPS_BI_FULL', label: 'Mapas Georreferenciados & BI Territorial', category: 'Inteligência' },
  { id: 'USERS_RBAC_MANAGE', label: 'Gerenciamento de Perfis e Acessos', category: 'Segurança' },
  { id: 'SYSTEM_SETTINGS', label: 'Configurações Globais do Comitê', category: 'Administração' }
];

export const DEFAULT_GLOBAL_USER: UserProfile = {
  id: 'usr-admin-global',
  name: 'Administrador Master',
  email: 'admin@votando.eleicoes.br',
  role: UserRole.ADMIN,
  isGlobalAccess: true,
  phone: '(11) 99999-0001',
  cpf: '123.456.789-00',
  electoralTitle: '9876 5432 1098',
  jobTitle: 'Coordenador Geral de Campanha (Acesso Global)',
  party: 'PVOT (Partido Votando - 45)',
  coalition: 'Coligação Futuro & Vitória',
  territory: 'Nacional / Todas as Zonas (Acesso Irrestrito)',
  votingZone: 'Zona 001 - Capital',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Acesso Administrativo Global irrestrito para coordenação estratégica, compliance financeiro TSE, inteligência territorial e controle de multiplicadores.',
  twoFactorEnabled: true,
  permissions: SYSTEM_PERMISSIONS.map(p => p.id),
  notificationPreferences: {
    email: true,
    push: true,
    urgentAlerts: true,
    whatsapp: true
  },
  themePreference: 'light',
  createdAt: '2024-01-01 08:00:00',
  lastLogin: 'Agora mesmo',
  status: 'ACTIVE'
};

export const MOCK_USERS: UserProfile[] = [
  DEFAULT_GLOBAL_USER,
  {
    id: 'usr-coord-1',
    name: 'Dr. Roberto Vasconcelos',
    email: 'coordenacao@votando.eleicoes.br',
    role: UserRole.COORDINATOR,
    isGlobalAccess: false,
    phone: '(11) 98888-6666',
    cpf: '234.567.890-11',
    electoralTitle: '8765 4321 0987',
    jobTitle: 'Coordenador de Estratégia e Logística',
    party: 'PVOT (45)',
    coalition: 'Coligação Futuro & Vitória',
    territory: 'Região Metropolitana',
    votingZone: 'Zona 102',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Coordenação operacional de comícios, rotas de rua e alinhamento de lideranças municipais.',
    twoFactorEnabled: false,
    permissions: ['DASHBOARD_FULL', 'MEETINGS_MANAGE', 'JACOBS_AUDIT', 'VOTERS_FULL', 'TEAMS_MANAGE', 'MAPS_BI_FULL'],
    notificationPreferences: {
      email: true,
      push: true,
      urgentAlerts: true,
      whatsapp: false
    },
    themePreference: 'light',
    createdAt: '2024-02-15 10:30:00',
    lastLogin: 'Há 2 horas',
    status: 'ACTIVE'
  },
  {
    id: 'usr-leader-1',
    name: 'Ricardo Mendes',
    email: 'ricardo.mendes@votando.eleicoes.br',
    role: UserRole.LEADER,
    isGlobalAccess: false,
    phone: '(11) 98888-1111',
    cpf: '345.678.901-22',
    electoralTitle: '7654 3210 9876',
    jobTitle: 'Líder Regional & Multiplicador',
    party: 'PVOT (45)',
    coalition: 'Coligação Futuro & Vitória',
    territory: 'Zona Sul - Distrito 4',
    votingZone: 'Zona 088',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Mobilização territorial de bairros e gestão de comitês comunitários da Zona Sul.',
    twoFactorEnabled: false,
    permissions: ['MEETINGS_MANAGE', 'VOTERS_FULL', 'TEAMS_MANAGE'],
    notificationPreferences: {
      email: false,
      push: true,
      urgentAlerts: true,
      whatsapp: true
    },
    themePreference: 'light',
    createdAt: '2024-03-01 14:00:00',
    lastLogin: 'Há 45 minutos',
    status: 'ACTIVE'
  },
  {
    id: 'usr-fiscal-1',
    name: 'Juliana Rocha',
    email: 'juliana.fiscal@votando.eleicoes.br',
    role: UserRole.FISCAL,
    isGlobalAccess: false,
    phone: '(11) 97777-3322',
    cpf: '456.789.012-33',
    electoralTitle: '6543 2109 8765',
    jobTitle: 'Fiscal Titular de Apuração',
    party: 'PVOT (45)',
    coalition: 'Coligação Futuro & Vitória',
    territory: 'Zona 105 - Centro Norte',
    votingZone: 'Zona 105',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Fiscalização de urnas, registro de Boletins de Urna (BUs) e auditoria de apuração.',
    twoFactorEnabled: true,
    permissions: ['TALLY_MANAGE', 'MEETINGS_MANAGE'],
    notificationPreferences: {
      email: true,
      push: true,
      urgentAlerts: true,
      whatsapp: true
    },
    themePreference: 'light',
    createdAt: '2024-04-10 09:15:00',
    lastLogin: 'Ontem às 19:30',
    status: 'ACTIVE'
  },
  {
    id: 'usr-supporter-1',
    name: 'Carla Peixoto',
    email: 'carla.voluntaria@votando.eleicoes.br',
    role: UserRole.SUPPORTER,
    isGlobalAccess: false,
    phone: '(11) 96666-4455',
    jobTitle: 'Mobilizadora de Rua & Voluntária',
    party: 'PVOT (45)',
    coalition: 'Coligação Futuro & Vitória',
    territory: 'Centro',
    votingZone: 'Zona 102',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Distribuição de santinhos, convite para reuniões e cadastro de eleitores simpáticos.',
    twoFactorEnabled: false,
    permissions: ['VOTERS_FULL', 'MEETINGS_MANAGE'],
    notificationPreferences: {
      email: false,
      push: true,
      urgentAlerts: false,
      whatsapp: true
    },
    themePreference: 'light',
    createdAt: '2024-05-20 16:40:00',
    lastLogin: 'Há 3 dias',
    status: 'ACTIVE'
  }
];

export const MOCK_ACCESS_LOGS: AccessLog[] = [
  {
    id: 'log-1',
    timestamp: '2024-10-14 18:22:10',
    action: 'Login efetuado com sucesso (Acesso Global)',
    ip: '189.120.45.12 (São Paulo - BR)',
    device: 'Chrome 128 / macOS Sequoia',
    status: 'SUCCESS'
  },
  {
    id: 'log-2',
    timestamp: '2024-10-14 17:15:04',
    action: 'Auditoria de Despesa TSE (Gerador 150kVA) aprovada',
    ip: '189.120.45.12 (São Paulo - BR)',
    device: 'Chrome 128 / macOS Sequoia',
    status: 'SUCCESS'
  },
  {
    id: 'log-3',
    timestamp: '2024-10-14 14:02:40',
    action: 'Tentativa de acesso com senha incorreta',
    ip: '177.18.99.201 (Curitiba - BR)',
    device: 'Firefox 130 / Windows 11',
    status: 'WARNING'
  },
  {
    id: 'log-4',
    timestamp: '2024-10-14 11:30:18',
    action: 'Sincronização de 120 eleitores via planilha CSV',
    ip: '189.120.45.12 (São Paulo - BR)',
    device: 'Chrome 128 / macOS Sequoia',
    status: 'SUCCESS'
  },
  {
    id: 'log-5',
    timestamp: '2024-10-13 22:45:00',
    action: 'Check-in de Lideranças confirmado na Reunião Plenária',
    ip: '201.86.110.55 (São Paulo - BR)',
    device: 'Mobile Safari / iOS 18.0',
    status: 'SUCCESS'
  }
];
