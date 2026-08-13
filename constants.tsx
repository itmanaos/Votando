
import { Voter, SupportLevel, TeamMember, UserRole, PollResult, VotingStation, Survey, SurveyType, QuestionType, CandidateResult, TallyStats } from './types';

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
  { id: 'L3', name: 'Marcos Paulo', role: UserRole.LEADER, territory: 'Centro', goals: 250, achieved: 210, phone: '(11) 98888-3333' },
  { id: 'L4', name: 'Camila Alencar', role: UserRole.LEADER, territory: 'Zona Leste', goals: 450, achieved: 390, phone: '(11) 98888-4444' },
  { id: 'L5', name: 'Lucas Ferraz', role: UserRole.LEADER, territory: 'Zona Oeste', goals: 350, achieved: 290, phone: '(11) 98888-5555' },
  { id: 'L6', name: 'Roberto Vasconcelos', role: UserRole.COORDINATOR, territory: 'Geral', goals: 1000, achieved: 920, phone: '(11) 98888-6666' },
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
    id: 'M1',
    title: 'Grande Plenária de Saúde e Mobilidade - Zona Sul',
    type: MeetingType.PLENARY,
    status: MeetingStatus.SCHEDULED,
    date: '2024-10-18',
    startTime: '19:00',
    endTime: '21:30',
    venueName: 'Espaço Comunitário Santo Amaro',
    address: 'Av. Adolfo Pinheiro, 1420',
    neighborhood: 'Santo Amaro',
    votingZone: '088',
    coordinates: { lat: -23.6521, lng: -46.7032 },
    venueCapacity: 350,
    isOutdoor: false,
    coordinatorId: 'L1',
    coordinatorName: 'Ricardo Mendes',
    expectedAttendance: 250,
    confirmedAttendance: 210,
    topic: 'Propostas para o novo Hospital Regional e ampliação de corredores de ônibus',
    targetAudience: 'Profissionais de saúde, comerciantes locais e lideranças comunitárias',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS,
    attendanceData: {
      venueAreaM2: 180,
      densityFactor: 2.2,
      calculatedDensityCount: 220,
      manualCount: 205,
      aiEstimatedCount: 218,
      aiConfidence: 94,
      leadersPresentCount: 8,
      totalSupportersMobilized: 195
    },
    leadersCheckIn: [
      { id: 'lc1', leaderName: 'Dr. Arnaldo Silveira', role: 'Presidente Assoc. Médicos', territory: 'Zona Sul', phone: '(11) 98765-4321', expectedSupporters: 35, status: 'CONFIRMADO', notes: 'Trará comitiva de 25 enfermeiros' },
      { id: 'lc2', leaderName: 'Valéria Santana', role: 'Líder Comunitária Jd. Angela', territory: 'Zona Sul', phone: '(11) 97654-3210', expectedSupporters: 50, status: 'PRESENTE', checkInTime: '18:45' },
      { id: 'lc3', leaderName: 'Pastor Ezequiel', role: 'Conselho de Pastores Sul', territory: 'Zona Sul', phone: '(11) 96543-2109', expectedSupporters: 60, status: 'CONFIRMADO' },
      { id: 'lc4', leaderName: 'Prof. Cláudio Nogueira', role: 'Coord. Educacional', territory: 'Zona Sul', phone: '(11) 95432-1098', expectedSupporters: 20, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp1',
        category: ExpenseCategory.VENUE_RENTAL,
        description: 'Locação de salão para realização de plenária eleitoral',
        supplierName: 'Espaço Eventos Sul Ltda',
        supplierTaxId: '12.345.678/0001-90',
        amount: 2500.00,
        fundingSource: PaymentFundingSource.FEFC,
        documentType: 'NF-e',
        documentNumber: '004921',
        invoiceFileName: 'nfe_locacao_espaco_sul_004921.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Nota fiscal emitida com CNPJ do candidato e descrição detalhada.',
        registeredBy: 'Gerência Financeira',
        createdAt: '2024-10-05'
      },
      {
        id: 'exp2',
        category: ExpenseCategory.SOUND_LIGHTING,
        description: 'Locação de sonorização, 4 microfones sem fio e iluminação básica',
        supplierName: 'AudioTech Pro Áudio Eireli',
        supplierTaxId: '98.765.432/0001-11',
        amount: 1800.00,
        fundingSource: PaymentFundingSource.CAMPAIGN_BANK_ACCOUNT,
        documentType: 'NF-e',
        documentNumber: '001284',
        invoiceFileName: 'nfe_audiotech_001284.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Conforme art. 39 da Lei 9.504/97. Decibéis dentro do padrão legal.',
        registeredBy: 'Gerência Financeira',
        createdAt: '2024-10-06'
      },
      {
        id: 'exp3',
        category: ExpenseCategory.STAFF_MEALS,
        description: 'Lanches fornecidos estritamente aos 12 fiscais e voluntários do staff',
        supplierName: 'Panificadora e Lanches Padrão ME',
        supplierTaxId: '45.123.890/0001-44',
        amount: 360.00,
        fundingSource: PaymentFundingSource.CAMPAIGN_BANK_ACCOUNT,
        documentType: 'NF-e',
        documentNumber: '008712',
        invoiceFileName: 'nfe_lanches_staff_008712.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Alimentação restrita à equipe de trabalho credenciada (Art. 39, §6º).',
        registeredBy: 'Apoio de Campo',
        createdAt: '2024-10-07'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 92,
      conversionEstimate: 165,
      riskFactors: [
        'Alto fluxo de tráfego na Av. Adolfo Pinheiro entre 18h30 e 19h15 (recomendar saída antecipada aos participantes)',
        'Zona com 24% de eleitores indecisos em saúde pública (oportunidade chave de conversão)'
      ],
      speechRecommendations: [
        'Enfatizar tempo de espera no atendimento do Hospital Regional e plano de telemedicina',
        'Citar nominalmente o Dr. Arnaldo e a líder comunitária Valéria Santana durante a fala',
        'Fechar com convite para o mutirão de cadastramento digital de eleitores'
      ],
      climateAlert: 'Clima ameno, previsão de 22°C sem chuva.'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 4660.00,
      pendingReceiptsCount: 0,
      auditFlags: [
        'Todas as despesas possuem NF-e vinculada e quitada via conta bancária de campanha.',
        'Sem indícios de distribuição indevida de bens a eleitores.'
      ]
    }
  },
  {
    id: 'M2',
    title: 'Encontro com Lideranças do Comércio e Serviços',
    type: MeetingType.LEADERS_MEETING,
    status: MeetingStatus.SCHEDULED,
    date: '2024-10-21',
    startTime: '10:00',
    endTime: '12:00',
    venueName: 'Auditório da Associação Comercial Central',
    address: 'Rua Direita, 250 - 4º Andar',
    neighborhood: 'Centro',
    votingZone: '102',
    coordinates: { lat: -23.5489, lng: -46.6341 },
    venueCapacity: 120,
    isOutdoor: false,
    coordinatorId: 'L3',
    coordinatorName: 'Marcos Paulo',
    expectedAttendance: 85,
    confirmedAttendance: 74,
    topic: 'Desoneração fiscal municipal, segurança no centro histórico e revitalização comercial',
    targetAudience: 'Lojistas, microempreendedores individuais e corretores de imóveis',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS.map(s => ({
      ...s,
      status: s.id <= 3 ? StepStatus.COMPLETED : StepStatus.PENDING
    })),
    attendanceData: {
      venueAreaM2: 95,
      densityFactor: 1.5,
      calculatedDensityCount: 80,
      manualCount: 0,
      aiEstimatedCount: 78,
      aiConfidence: 89,
      leadersPresentCount: 6,
      totalSupportersMobilized: 60
    },
    leadersCheckIn: [
      { id: 'lc5', leaderName: 'Rogério Brandão', role: 'Dir. Câmara de Lojistas', territory: 'Centro', phone: '(11) 94321-0987', expectedSupporters: 25, status: 'CONFIRMADO' },
      { id: 'lc6', leaderName: 'Carla Silveira', role: 'Assoc. Mulheres Empreendedoras', territory: 'Centro', phone: '(11) 93210-9876', expectedSupporters: 30, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp4',
        category: ExpenseCategory.GRAPHIC_MATERIALS,
        description: 'Impressão de cadernos de propostas setoriais de desenvolvimento econômico',
        supplierName: 'Gráfica Eleitoral Rápida Ltda',
        supplierTaxId: '33.222.111/0001-55',
        amount: 850.00,
        fundingSource: PaymentFundingSource.CAMPAIGN_BANK_ACCOUNT,
        documentType: 'NF-e',
        documentNumber: '003291',
        invoiceFileName: 'nfe_grafica_003291.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Contém tiragem, CNPJ do candidato e CNPJ da gráfica em conformidade legal.',
        registeredBy: 'Comunicação',
        createdAt: '2024-10-09'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 89,
      conversionEstimate: 58,
      riskFactors: [
        'Dificuldade de estacionamento no entorno (orientar uso de transporte público ou estacionamento conveniado)'
      ],
      speechRecommendations: [
        'Apresentar metas claras de simplificação do alvará eletrônico em 24h',
        'Destacar projeto de patrulhamento preventivo e videomonitoramento inteligente para o Centro'
      ],
      climateAlert: 'Ambiente interno climatizado.'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 850.00,
      pendingReceiptsCount: 0,
      auditFlags: ['Despesa gráfica devidamente registrada e com nota fiscal em conformidade.']
    }
  },
  {
    id: 'M3',
    title: 'Mini-Comício e Caminhada no Bairro Brasilândia',
    type: MeetingType.MINI_RALLY,
    status: MeetingStatus.SCHEDULED,
    date: '2024-10-25',
    startTime: '16:00',
    endTime: '18:30',
    venueName: 'Praça das Bandeiras Comunitária',
    address: 'Rua Parapuã, altura do 800',
    neighborhood: 'Brasilândia',
    votingZone: '105',
    coordinates: { lat: -23.4712, lng: -46.6891 },
    venueCapacity: 600,
    isOutdoor: true,
    coordinatorId: 'L2',
    coordinatorName: 'Fernanda Lima',
    expectedAttendance: 400,
    confirmedAttendance: 320,
    topic: 'Criação do novo Parque Linear e regularização fundiária de moradias',
    targetAudience: 'Moradores, associações de bairro, juventude e coletivos culturais',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS.map(s => ({
      ...s,
      status: s.id <= 2 ? StepStatus.COMPLETED : StepStatus.PENDING
    })),
    attendanceData: {
      venueAreaM2: 350,
      densityFactor: 2.8,
      calculatedDensityCount: 380,
      manualCount: 0,
      aiEstimatedCount: 360,
      aiConfidence: 87,
      leadersPresentCount: 12,
      totalSupportersMobilized: 280
    },
    leadersCheckIn: [
      { id: 'lc7', leaderName: 'Marcos Santos (Negão)', role: 'Coordenador Bloco Cultural', territory: 'Zona Norte', phone: '(11) 92109-8765', expectedSupporters: 80, status: 'CONFIRMADO' },
      { id: 'lc8', leaderName: 'Dona Neusa', role: 'Conselho de Bairro Brasilândia', territory: 'Zona Norte', phone: '(11) 91098-7654', expectedSupporters: 50, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp5',
        category: ExpenseCategory.SOUND_LIGHTING,
        description: 'Carro de som e microfones para mini-comício de rua',
        supplierName: 'Voz do Bairro Comunicações ME',
        supplierTaxId: '55.444.333/0001-22',
        amount: 2200.00,
        fundingSource: PaymentFundingSource.FEFC,
        documentType: 'NF-e',
        documentNumber: '000542',
        invoiceFileName: 'nfe_carro_som_000542.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Horário do som limitado até as 22h conforme art. 39 da Lei das Eleições.',
        registeredBy: 'Gerência de Logística',
        createdAt: '2024-10-10'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 84,
      conversionEstimate: 210,
      riskFactors: [
        'Evento em área aberta sujeito a intempéries climáticas',
        'Controle de trânsito em via de linha de ônibus'
      ],
      speechRecommendations: [
        'Compromisso formal com o posto de saúde 24h da Brasilândia',
        'Destacar defesa do orçamento participativo para pavimentação de travessas'
      ],
      climateAlert: 'Possibilidade de pancadas de chuva no final da tarde (28% de probabilidade).'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 2200.00,
      pendingReceiptsCount: 0,
      auditFlags: ['Ofício de comunicação prévia deve ser conferido com a 2ª Cia do Batalhão PM.']
    }
  },
  {
    id: 'M4',
    title: 'Plenária de Educação, Juventude e Primeiro Emprego',
    type: MeetingType.PLENARY,
    status: MeetingStatus.SCHEDULED,
    date: '2024-10-27',
    startTime: '18:30',
    endTime: '21:00',
    venueName: 'Teatro Comunitário Arthur Azevedo',
    address: 'Av. Radial Leste, altura 4500',
    neighborhood: 'Itaquera',
    votingZone: '094',
    coordinates: { lat: -23.5385, lng: -46.4532 },
    venueCapacity: 450,
    isOutdoor: false,
    coordinatorId: 'L4',
    coordinatorName: 'Camila Alencar',
    expectedAttendance: 320,
    confirmedAttendance: 285,
    topic: 'Hub de inovação pública, cursos técnicos e passe livre estudantil integral',
    targetAudience: 'Estudantes universitários, grêmios estudantis e professores',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS.map(s => ({
      ...s,
      status: s.id === 1 ? StepStatus.COMPLETED : StepStatus.PENDING
    })),
    attendanceData: {
      venueAreaM2: 240,
      densityFactor: 2.1,
      calculatedDensityCount: 310,
      manualCount: 0,
      aiEstimatedCount: 305,
      aiConfidence: 91,
      leadersPresentCount: 9,
      totalSupportersMobilized: 260
    },
    leadersCheckIn: [
      { id: 'lc9', leaderName: 'Camila Alencar', role: 'Dir. DCE ZL', territory: 'Zona Leste', phone: '(11) 98111-2233', expectedSupporters: 45, status: 'CONFIRMADO' },
      { id: 'lc10', leaderName: 'Prof. Henrique Dias', role: 'Coord. Cursinho Popular', territory: 'Zona Leste', phone: '(11) 98222-3344', expectedSupporters: 60, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp6',
        category: ExpenseCategory.VENUE_RENTAL,
        description: 'Locação de espaço cultural com infraestrutura audiovisual',
        supplierName: 'Espaço Cultural Leste ME',
        supplierTaxId: '77.888.999/0001-33',
        amount: 3100.00,
        fundingSource: PaymentFundingSource.FEFC,
        documentType: 'NF-e',
        documentNumber: '002198',
        invoiceFileName: 'nfe_teatro_leste_002198.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Conformidade legal e contrato assinado.',
        registeredBy: 'Gerência Financeira',
        createdAt: '2024-10-12'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 90,
      conversionEstimate: 215,
      riskFactors: [
        'Horário coincide com término de aulas nas faculdades do entorno',
        'Público jovem exige dinamismo no formato sem discursos longos'
      ],
      speechRecommendations: [
        'Apresentar proposta do cartão bolsa qualificação profissional',
        'Dar espaço para perguntas rápidas de estudantes no microfone'
      ],
      climateAlert: 'Ambiente fechado climatizado.'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 3100.00,
      pendingReceiptsCount: 0,
      auditFlags: ['Despesa em conformidade com teto da Zona Leste.']
    }
  },
  {
    id: 'M5',
    title: 'Café da Manhã com Inovadores e Empreendedorismo Social',
    type: MeetingType.COFFEE_SUPPORTERS,
    status: MeetingStatus.SCHEDULED,
    date: '2024-10-29',
    startTime: '08:30',
    endTime: '11:00',
    venueName: 'Hub Coworking Pinheiros',
    address: 'Rua dos Pinheiros, 890',
    neighborhood: 'Pinheiros',
    votingZone: '082',
    coordinates: { lat: -23.5678, lng: -46.6912 },
    venueCapacity: 90,
    isOutdoor: false,
    coordinatorId: 'L5',
    coordinatorName: 'Lucas Ferraz',
    expectedAttendance: 65,
    confirmedAttendance: 58,
    topic: 'Incentivos a startups de impacto social, redução de ISS e sustentabilidade urbana',
    targetAudience: 'Founders de tecnologia, investidores anjo e ativistas ambientais',
    lifecycleSteps: DEFAULT_LIFECYCLE_STEPS.map(s => ({
      ...s,
      status: s.id === 1 ? StepStatus.COMPLETED : StepStatus.PENDING
    })),
    attendanceData: {
      venueAreaM2: 70,
      densityFactor: 1.4,
      calculatedDensityCount: 62,
      manualCount: 0,
      aiEstimatedCount: 60,
      aiConfidence: 93,
      leadersPresentCount: 5,
      totalSupportersMobilized: 48
    },
    leadersCheckIn: [
      { id: 'lc11', leaderName: 'Lucas Ferraz', role: 'Fundador Startup ESG', territory: 'Zona Oeste', phone: '(11) 97333-4455', expectedSupporters: 15, status: 'CONFIRMADO' }
    ],
    expenses: [
      {
        id: 'exp7',
        category: ExpenseCategory.VENUE_RENTAL,
        description: 'Locação de sala de conferência com projetor 4K',
        supplierName: 'Pinheiros Work Place SA',
        supplierTaxId: '11.444.777/0001-88',
        amount: 1200.00,
        fundingSource: PaymentFundingSource.CAMPAIGN_BANK_ACCOUNT,
        documentType: 'NF-e',
        documentNumber: '009832',
        invoiceFileName: 'nfe_coworking_009832.pdf',
        complianceStatus: ComplianceAuditStatus.APPROVED,
        legalNotes: 'Recursos próprios de campanha via TED nominal.',
        registeredBy: 'Gerência Financeira',
        createdAt: '2024-10-14'
      }
    ],
    aiPredictiveAnalysis: {
      expectedTurnoutScore: 94,
      conversionEstimate: 45,
      riskFactors: [
        'Público de alta exigência técnica em métricas de gestão pública'
      ],
      speechRecommendations: [
        'Apresentar plano de digitalização 100% de serviços municipais',
        'Citar parcerias público-privadas de descarbonização'
      ],
      climateAlert: 'Espaço fechado com ar condicionado.'
    },
    legalAuditSummary: {
      isFullyCompliant: true,
      totalExpensesAmount: 1200.00,
      pendingReceiptsCount: 0,
      auditFlags: ['Despesa legalmente regular.']
    }
  }
];
