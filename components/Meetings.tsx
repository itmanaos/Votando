import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, MapPin, Users, AlertTriangle, CheckCircle2, 
  Plus, Search, Filter, Shield, Sparkles, FileText, Upload, 
  DollarSign, ArrowRight, UserCheck, Phone, CheckSquare, 
  ChevronRight, Lock, Eye, AlertCircle, RefreshCw, X, Download,
  Volume2, Utensils, Droplets, Wrench, PlayCircle, Archive, Award,
  Info, ShieldCheck, Check, MessageSquare, Compass, Map as MapIcon,
  Layers, Radio
} from 'lucide-react';
import { 
  Meeting, MeetingType, MeetingStatus, StepStatus, RACIRole, 
  MeetingLifecycleStep, LeaderCheckIn, MeetingExpense, ExpenseCategory, 
  PaymentFundingSource, ComplianceAuditStatus 
} from '../types';
import { MOCK_MEETINGS, DEFAULT_LIFECYCLE_STEPS, MOCK_TEAMS } from '../constants';
import { analyzeMeetingSuccessPredictive, auditMeetingExpensesTSE } from '../geminiService';
import { useToast } from './Toast';
import MeetingMapViewer from './MeetingMapViewer';

const STEP_ICONS: Record<number, React.ElementType> = {
  1: FileText,    // Concepção
  2: MapPin,      // Logística
  3: Volume2,     // Sonorização
  4: Utensils,    // Alimentação
  5: Droplets,    // Hidratação
  6: Wrench,      // Montagem
  7: PlayCircle,  // Realização
  8: Archive,     // Desmontagem
  9: Award        // Relatório Final
};

export const Meetings: React.FC = () => {
  const { addToast } = useToast();
  const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(MOCK_MEETINGS[0].id);
  const [viewMode, setViewMode] = useState<'events' | 'map'>('events');
  const [activeSubTab, setActiveSubTab] = useState<'lifecycle' | 'attendance' | 'expenses' | 'ai_predictive' | 'map'>('lifecycle');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCoordinator, setFilterCoordinator] = useState<string>('ALL');

  // Modals
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [isAddLeaderModalOpen, setIsAddLeaderModalOpen] = useState(false);
  const [isChangeCoordinatorModalOpen, setIsChangeCoordinatorModalOpen] = useState(false);
  const [selectedCoordinatorIdForChange, setSelectedCoordinatorIdForChange] = useState<string>('L1');
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [isAuditingExpenses, setIsAuditingExpenses] = useState(false);

  // New Meeting Form State
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    type: MeetingType.PLENARY,
    date: new Date().toISOString().split('T')[0],
    startTime: '19:00',
    endTime: '21:00',
    venueName: '',
    address: '',
    neighborhood: '',
    votingZone: '102',
    venueCapacity: 200,
    isOutdoor: false,
    coordinatorId: 'L1',
    expectedAttendance: 150,
    topic: '',
    targetAudience: ''
  });

  // New Expense Form State
  const [newExpense, setNewExpense] = useState({
    category: ExpenseCategory.VENUE_RENTAL,
    description: '',
    supplierName: '',
    supplierTaxId: '',
    amount: '',
    fundingSource: PaymentFundingSource.CAMPAIGN_BANK_ACCOUNT,
    documentType: 'NF-e' as const,
    documentNumber: '',
    invoiceFileName: ''
  });

  // New Leader CheckIn Form State
  const [newLeader, setNewLeader] = useState({
    leaderName: '',
    role: '',
    territory: 'Zona Sul',
    phone: '',
    expectedSupporters: 20
  });

  // Density Calculation State
  const [densityFactor, setDensityFactor] = useState<number>(2.0);
  const [venueAreaInput, setVenueAreaInput] = useState<number>(180);

  // Currently Selected Meeting
  const currentMeeting = useMemo(() => {
    return meetings.find(m => m.id === selectedMeetingId) || meetings[0];
  }, [meetings, selectedMeetingId]);

  // Filtered Meetings List
  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = m.title.toLowerCase().includes(q) ||
                            m.neighborhood.toLowerCase().includes(q) ||
                            m.venueName.toLowerCase().includes(q) ||
                            m.coordinatorName.toLowerCase().includes(q);
      const matchesType = filterType === 'ALL' || m.type === filterType;
      const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;
      const matchesCoordinator = filterCoordinator === 'ALL' || m.coordinatorId === filterCoordinator;
      return matchesSearch && matchesType && matchesStatus && matchesCoordinator;
    });
  }, [meetings, searchQuery, filterType, filterStatus, filterCoordinator]);

  // Conflict Matrix Checker for scheduling
  const scheduleConflicts = useMemo(() => {
    if (!newMeeting.date || !newMeeting.startTime || !newMeeting.endTime) return [];
    
    const conflicts: string[] = [];
    meetings.forEach(existing => {
      if (existing.date === newMeeting.date) {
        // Time Overlap check: (StartA < EndB) && (EndA > StartB)
        const overlap = (newMeeting.startTime < existing.endTime) && (newMeeting.endTime > existing.startTime);
        if (overlap) {
          conflicts.push(`Conflito de Horário com "${existing.title}" (${existing.startTime} às ${existing.endTime}) no mesmo dia.`);
        }
        // Geographic travel check
        if (existing.votingZone !== newMeeting.votingZone) {
          conflicts.push(`Alerta de Deslocamento: Evento na Zona ${existing.votingZone} no mesmo dia (${existing.neighborhood}). Verifique o tempo hábil de trânsito.`);
        }
      }
    });
    return conflicts;
  }, [meetings, newMeeting.date, newMeeting.startTime, newMeeting.endTime, newMeeting.votingZone]);

  // Handle Lifecycle Step Checklist Toggle
  const handleToggleChecklistItem = (stepId: number, itemId: string) => {
    setMeetings(prev => prev.map(m => {
      if (m.id !== currentMeeting.id) return m;

      const updatedSteps = m.lifecycleSteps.map(step => {
        if (step.id !== stepId) return step;

        const updatedChecklist = step.checklistItems.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, completed: !item.completed };
        });

        // Determine if all required are completed
        const allRequiredDone = updatedChecklist.filter(i => i.required).every(i => i.completed);
        const newStatus = allRequiredDone 
          ? StepStatus.COMPLETED 
          : updatedChecklist.some(i => i.completed) 
            ? StepStatus.IN_PROGRESS 
            : StepStatus.PENDING;

        return {
          ...step,
          checklistItems: updatedChecklist,
          status: newStatus,
          completedAt: allRequiredDone ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined
        };
      });

      return { ...m, lifecycleSteps: updatedSteps };
    }));

    addToast({
      type: 'info',
      title: 'Item de Checklist Atualizado',
      message: 'Progresso da etapa salvo com registro de conformidade.'
    });
  };

  // Handle Step Status Direct Change (with sequential gate verification)
  const handleUpdateStepStatus = (stepId: number, newStatus: StepStatus) => {
    // Sequential Gate Check: Can't complete step N if step N-1 is not completed
    if (newStatus === StepStatus.COMPLETED && stepId > 1) {
      const prevStep = currentMeeting.lifecycleSteps.find(s => s.id === stepId - 1);
      if (prevStep && prevStep.status !== StepStatus.COMPLETED) {
        addToast({
          type: 'error',
          title: 'Bloqueio de Etapa Sequencial',
          message: `A etapa anterior (${prevStep.name}) precisa ser concluída antes de finalizar esta.`
        });
        return;
      }
    }

    setMeetings(prev => prev.map(m => {
      if (m.id !== currentMeeting.id) return m;
      const updatedSteps = m.lifecycleSteps.map(s => {
        if (s.id === stepId) {
          return {
            ...s,
            status: newStatus,
            completedAt: newStatus === StepStatus.COMPLETED ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined
          };
        }
        return s;
      });
      return { ...m, lifecycleSteps: updatedSteps };
    }));

    addToast({
      type: 'success',
      title: 'Status da Etapa Atualizado',
      message: `Etapa avançada para ${newStatus}.`
    });
  };

  // Handle Leader Check-In Status Change
  const handleLeaderStatusChange = (leaderId: string, status: LeaderCheckIn['status']) => {
    setMeetings(prev => prev.map(m => {
      if (m.id !== currentMeeting.id) return m;
      const updatedLeaders = m.leadersCheckIn.map(l => {
        if (l.id === leaderId) {
          return {
            ...l,
            status,
            checkInTime: status === 'PRESENTE' ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : l.checkInTime
          };
        }
        return l;
      });

      const leadersPresent = updatedLeaders.filter(l => l.status === 'PRESENTE').length;
      const supportersMobilized = updatedLeaders
        .filter(l => l.status === 'PRESENTE' || l.status === 'CONFIRMADO')
        .reduce((acc, curr) => acc + curr.expectedSupporters, 0);

      return {
        ...m,
        leadersCheckIn: updatedLeaders,
        attendanceData: {
          ...m.attendanceData,
          leadersPresentCount: leadersPresent,
          totalSupportersMobilized: supportersMobilized
        }
      };
    }));

    addToast({
      type: 'info',
      title: 'Check-in de Liderança Registrado',
      message: `Status atualizado para ${status}.`
    });
  };

  // Handle Add New Expense with TSE Compliance Checks
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newExpense.amount);
    if (!newExpense.description || isNaN(amountNum) || amountNum <= 0 || !newExpense.supplierTaxId) {
      addToast({
        type: 'error',
        title: 'Dados Incompletos',
        message: 'Preencha a descrição, CNPJ/CPF do fornecedor e valor válido.'
      });
      return;
    }

    // Trava Jurídica: Validar se há comprovante ou número de documento
    const hasDoc = !!newExpense.documentNumber || !!newExpense.invoiceFileName;
    const complianceStatus = hasDoc ? ComplianceAuditStatus.APPROVED : ComplianceAuditStatus.PENDING_DOCS;

    const expenseObj: MeetingExpense = {
      id: 'exp_' + Date.now(),
      category: newExpense.category,
      description: newExpense.description,
      supplierName: newExpense.supplierName || 'Fornecedor Credenciado',
      supplierTaxId: newExpense.supplierTaxId,
      amount: amountNum,
      fundingSource: newExpense.fundingSource,
      documentType: newExpense.documentType,
      documentNumber: newExpense.documentNumber || 'PENDENTE',
      invoiceFileName: newExpense.invoiceFileName || undefined,
      complianceStatus,
      legalNotes: hasDoc ? 'Documento fiscal vinculado para prestação de contas.' : 'Pendente de upload da NF-e com CNPJ do candidato.',
      registeredBy: 'Equipe de Finanças',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setMeetings(prev => prev.map(m => {
      if (m.id !== currentMeeting.id) return m;
      const updatedExpenses = [...m.expenses, expenseObj];
      const totalAmount = updatedExpenses.reduce((acc, curr) => acc + curr.amount, 0);
      const pendingCount = updatedExpenses.filter(exp => exp.complianceStatus !== ComplianceAuditStatus.APPROVED).length;

      return {
        ...m,
        expenses: updatedExpenses,
        legalAuditSummary: {
          isFullyCompliant: pendingCount === 0,
          totalExpensesAmount: totalAmount,
          pendingReceiptsCount: pendingCount,
          auditFlags: pendingCount > 0 
            ? ['Existem comprovantes fiscais pendentes para homologação no SPCE.'] 
            : ['Todas as despesas possuem documentação fiscal regular vinculada.']
        }
      };
    }));

    setIsNewExpenseModalOpen(false);
    setNewExpense({
      category: ExpenseCategory.VENUE_RENTAL,
      description: '',
      supplierName: '',
      supplierTaxId: '',
      amount: '',
      fundingSource: PaymentFundingSource.CAMPAIGN_BANK_ACCOUNT,
      documentType: 'NF-e',
      documentNumber: '',
      invoiceFileName: ''
    });

    addToast({
      type: 'success',
      title: 'Despesa Registrada',
      message: `R$ ${amountNum.toFixed(2)} lançados na contabilidade do evento.`
    });
  };

  // Handle Changing Meeting Coordinator
  const handleChangeCoordinator = (targetMeetingId: string, newCoordId: string) => {
    const coord = MOCK_TEAMS.find(t => t.id === newCoordId);
    if (!coord) return;

    setMeetings(prev => prev.map(m => {
      if (m.id !== targetMeetingId) return m;
      return {
        ...m,
        coordinatorId: coord.id,
        coordinatorName: coord.name
      };
    }));

    setIsChangeCoordinatorModalOpen(false);
    addToast({
      type: 'success',
      title: 'Coordenador Atualizado',
      message: `${coord.name} (${coord.territory}) agora é o coordenador responsável por este encontro.`
    });
  };

  // Handle Add New Meeting
  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.title || !newMeeting.venueName || !newMeeting.address) {
      addToast({
        type: 'error',
        title: 'Campos Obrigatórios',
        message: 'Informe o título, nome do espaço e endereço completo.'
      });
      return;
    }

    const created: Meeting = {
      id: 'M_' + Date.now(),
      title: newMeeting.title,
      type: newMeeting.type,
      status: MeetingStatus.SCHEDULED,
      date: newMeeting.date,
      startTime: newMeeting.startTime,
      endTime: newMeeting.endTime,
      venueName: newMeeting.venueName,
      address: newMeeting.address,
      neighborhood: newMeeting.neighborhood || 'Centro',
      votingZone: newMeeting.votingZone,
      coordinates: { lat: -23.5505, lng: -46.6333 },
      venueCapacity: Number(newMeeting.venueCapacity) || 200,
      isOutdoor: newMeeting.isOutdoor,
      coordinatorId: newMeeting.coordinatorId,
      coordinatorName: MOCK_TEAMS.find(t => t.id === newMeeting.coordinatorId)?.name || 'Coordenador Central',
      expectedAttendance: Number(newMeeting.expectedAttendance) || 100,
      confirmedAttendance: 0,
      topic: newMeeting.topic || 'Apresentação de propostas prioritárias',
      targetAudience: newMeeting.targetAudience || 'Lideranças comunitárias e eleitores',
      lifecycleSteps: DEFAULT_LIFECYCLE_STEPS.map(s => ({
        ...s,
        status: s.id === 1 ? StepStatus.IN_PROGRESS : StepStatus.PENDING,
        completedAt: undefined,
        checklistItems: s.checklistItems.map(i => ({ ...i, completed: false }))
      })),
      attendanceData: {
        venueAreaM2: 120,
        densityFactor: 2.0,
        calculatedDensityCount: 240,
        manualCount: 0,
        aiEstimatedCount: 0,
        aiConfidence: 0,
        leadersPresentCount: 0,
        totalSupportersMobilized: 0
      },
      leadersCheckIn: [],
      expenses: [],
      legalAuditSummary: {
        isFullyCompliant: true,
        totalExpensesAmount: 0,
        pendingReceiptsCount: 0,
        auditFlags: ['Aguardando lançamentos iniciais de logística e despesas.']
      }
    };

    setMeetings(prev => [created, ...prev]);
    setSelectedMeetingId(created.id);
    setIsNewMeetingModalOpen(false);

    addToast({
      type: 'success',
      title: 'Reunião Agendada com Sucesso',
      message: `Ciclo de vida em 9 etapas inicializado para "${created.title}".`
    });
  };

  // Run AI Predictive Analysis via Gemini
  const handleRunAiPredictive = async () => {
    setIsAnalyzingAi(true);
    try {
      const result = await analyzeMeetingSuccessPredictive(currentMeeting);
      setMeetings(prev => prev.map(m => {
        if (m.id !== currentMeeting.id) return m;
        return {
          ...m,
          aiPredictiveAnalysis: result
        };
      }));
      addToast({
        type: 'success',
        title: 'Inteligência Preditiva Atualizada',
        message: 'Projeção de público, riscos e recomendações de discurso geradas pelo Gemini.'
      });
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Falha na Análise',
        message: 'Não foi possível conectar ao serviço de inteligência artificial.'
      });
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // Run TSE Legal Expense Audit via Gemini
  const handleRunTseAudit = async () => {
    setIsAuditingExpenses(true);
    try {
      const audit = await auditMeetingExpensesTSE(currentMeeting.expenses, currentMeeting.title);
      setMeetings(prev => prev.map(m => {
        if (m.id !== currentMeeting.id) return m;
        return {
          ...m,
          legalAuditSummary: audit
        };
      }));
      addToast({
        type: 'success',
        title: 'Auditoria TSE Concluída',
        message: 'Parecer jurídico e contábil processado com base na Lei 9.504/97.'
      });
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Falha na Auditoria',
        message: 'Erro ao processar validação jurídica de despesas.'
      });
    } finally {
      setIsAuditingExpenses(false);
    }
  };

  // Calculate live Jacobs Crowd Density
  const calculatedJacobsPublic = Math.round(venueAreaInput * densityFactor);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-full uppercase tracking-wider">
              Gestão de Reuniões & Compliance
            </span>
            <span className="text-xs text-slate-400 font-medium">Lifecycle em 9 Etapas • TSE 9.504/97</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Comando de Eventos e Plenárias
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Coordenação operacional de ponta a ponta: matriz de conflitos, RACI, auditoria de público, controle de gastos e parecer jurídico por IA.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {/* Top View Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            <button
              id="viewmode-events-btn"
              onClick={() => setViewMode('events')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'events'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar size={15} />
              <span>Visão de Eventos</span>
            </button>
            <button
              id="viewmode-map-btn"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Compass size={15} />
              <span>Mapa Georreferenciado & Densidade</span>
              <span className="bg-sky-400/20 text-sky-700 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                {meetings.length} loc.
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsNewMeetingModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-95"
          >
            <Plus size={16} />
            Agendar Nova Reunião
          </button>
        </div>
      </div>

      {/* Conditionally Render Standalone Map View or Split Events View */}
      {viewMode === 'map' ? (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <MeetingMapViewer 
            meetings={meetings}
            selectedMeetingId={selectedMeetingId}
            onSelectMeeting={(meetingId) => {
              setSelectedMeetingId(meetingId);
              setViewMode('events');
            }}
            onOpenNewMeetingModal={() => setIsNewMeetingModalOpen(true)}
          />
        </div>
      ) : (
      /* Main Two-Column Layout */
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Meetings Agenda & List (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
            
            {/* Search and Filters */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por título, bairro ou local..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
                >
                  <option value="ALL">Todos os Tipos</option>
                  {Object.values(MeetingType).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
                >
                  <option value="ALL">Todos os Status</option>
                  {Object.values(MeetingStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <select
                value={filterCoordinator}
                onChange={(e) => setFilterCoordinator(e.target.value)}
                className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
              >
                <option value="ALL">👤 Todos os Coordenadores</option>
                {MOCK_TEAMS.map(team => (
                  <option key={team.id} value={team.id}>
                    👤 {team.name} ({team.territory})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Meetings Cards Scrollable */}
          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredMeetings.map((m) => {
              const isSelected = m.id === selectedMeetingId;
              const completedSteps = m.lifecycleSteps.filter(s => s.status === StepStatus.COMPLETED).length;
              const progressPct = Math.round((completedSteps / 9) * 100);

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMeetingId(m.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                    isSelected 
                      ? 'bg-blue-50/50 border-blue-500 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/30' 
                      : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                      {m.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      m.status === MeetingStatus.COMPLETED 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : m.status === MeetingStatus.IN_PROGRESS 
                          ? 'bg-blue-100 text-blue-700 animate-pulse'
                          : 'bg-amber-100 text-amber-700'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1.5">
                    {m.title}
                  </h3>

                  {/* Coordinator Badge */}
                  <div className="mb-2 flex items-center gap-1.5 px-2 py-1 bg-slate-100/80 rounded-lg text-[11px] text-slate-700 font-medium border border-slate-200/50">
                    <UserCheck size={13} className="text-blue-600 shrink-0" />
                    <span className="text-slate-400 text-[10px]">Coord:</span>
                    <strong className="truncate text-slate-800">{m.coordinatorName}</strong>
                  </div>

                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400 shrink-0" />
                      <span>{new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR')} • {m.startTime} às {m.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{m.venueName} ({m.neighborhood} - Zona {m.votingZone})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={13} className="text-slate-400 shrink-0" />
                      <span>Estimativa: <strong>{m.expectedAttendance} pessoas</strong></span>
                    </div>
                  </div>

                  {/* Lifecycle Progress Bar */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                      <span>Ciclo: Etapa {completedSteps}/9</span>
                      <span className="text-blue-600">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredMeetings.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 text-slate-400">
                <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs font-semibold">Nenhuma reunião encontrada para os filtros atuais.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Meeting Detail & Submodules (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Meeting Summary Banner */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-800">
                    {currentMeeting.type}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                    Zona Eleitoral {currentMeeting.votingZone}
                  </span>
                  {currentMeeting.isOutdoor ? (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Espaço Aberto / Rua
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Espaço Fechado ({currentMeeting.venueCapacity} cap.)
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {currentMeeting.title}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                  <strong>Pauta:</strong> {currentMeeting.topic}
                </p>
              </div>

              {/* Status Badge */}
              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-slate-400">Status Geral</div>
                <div className="inline-block mt-0.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
                  {currentMeeting.status}
                </div>
              </div>
            </div>

            {/* Dedicated Coordenador Responsável Card */}
            {(() => {
              const currentCoordinator = MOCK_TEAMS.find(t => t.id === currentMeeting.coordinatorId || t.name === currentMeeting.coordinatorName);
              const cleanPhone = currentCoordinator?.phone ? currentCoordinator.phone.replace(/\D/g, '') : '';
              
              return (
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md border border-slate-800/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-black text-sm shrink-0 shadow-inner">
                      {currentMeeting.coordinatorName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-black tracking-wider text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-md border border-blue-400/20">
                          Coordenador Responsável
                        </span>
                        <span className="text-xs text-slate-300 font-medium">
                          • {currentCoordinator?.territory ? `Território: ${currentCoordinator.territory}` : `Zona: ${currentMeeting.votingZone}`}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-white mt-1 flex items-center gap-2">
                        {currentMeeting.coordinatorName}
                        {currentCoordinator?.phone && (
                          <span className="text-xs text-slate-300 font-normal">
                            ({currentCoordinator.phone})
                          </span>
                        )}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-700/50">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(`Olá ${currentMeeting.coordinatorName}, alinhamento sobre a reunião "${currentMeeting.title}" agendada para ${currentMeeting.date}...`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
                        title="Enviar mensagem via WhatsApp"
                      >
                        <MessageSquare size={13} />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    <button
                      id="change-meeting-coordinator-btn"
                      type="button"
                      onClick={() => {
                        setSelectedCoordinatorIdForChange(currentMeeting.coordinatorId || 'L1');
                        setIsChangeCoordinatorModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 transition-all active:scale-95"
                    >
                      <RefreshCw size={13} />
                      <span>Alterar Coordenador</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Data & Horário</p>
                <p className="text-xs font-black text-slate-800 mt-0.5">
                  {new Date(currentMeeting.date + 'T00:00:00').toLocaleDateString('pt-BR')} • {currentMeeting.startTime}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Público Estimado</p>
                <p className="text-xs font-black text-slate-800 mt-0.5">
                  {currentMeeting.expectedAttendance} pessoas
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Lideranças</p>
                <p className="text-xs font-black text-blue-600 mt-0.5">
                  {currentMeeting.leadersCheckIn.filter(l => l.status === 'PRESENTE').length} presentes / {currentMeeting.leadersCheckIn.length} convidadas
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Despesas Totais</p>
                <p className="text-xs font-black text-slate-900 mt-0.5">
                  R$ {currentMeeting.expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveSubTab('lifecycle')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeSubTab === 'lifecycle'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <CheckSquare size={14} />
                Lifecycle (9 Etapas)
              </button>

              <button
                onClick={() => setActiveSubTab('attendance')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeSubTab === 'attendance'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <UserCheck size={14} />
                Contabilização de Público ({currentMeeting.leadersCheckIn.length})
              </button>

              <button
                onClick={() => setActiveSubTab('expenses')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeSubTab === 'expenses'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <DollarSign size={14} />
                Despesas & Trava Jurídica ({currentMeeting.expenses.length})
              </button>

              <button
                onClick={() => setActiveSubTab('ai_predictive')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeSubTab === 'ai_predictive'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sparkles size={14} />
                Inteligência Preditiva IA
              </button>

              <button
                id="subtab-meeting-map"
                onClick={() => setActiveSubTab('map')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeSubTab === 'map'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Compass size={14} />
                Mapa & Densidade Local
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SUBTAB 1: LIFECYCLE 9 SEQUENTIAL STEPS                                    */}
          {/* ========================================================================= */}
          {activeSubTab === 'lifecycle' && (
            <div className="space-y-6">
              
              {/* Sequential Stepper Progress Horizontal */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 overflow-x-auto">
                <div className="flex items-center min-w-[700px] justify-between relative px-2">
                  {currentMeeting.lifecycleSteps.map((step, idx) => {
                    const IconComponent = STEP_ICONS[step.id] || FileText;
                    const isSelected = idx === selectedStepIndex;
                    const isCompleted = step.status === StepStatus.COMPLETED;
                    const isInProgress = step.status === StepStatus.IN_PROGRESS;

                    return (
                      <div key={step.id} className="flex flex-col items-center relative z-10">
                        <button
                          onClick={() => setSelectedStepIndex(idx)}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                            isSelected
                              ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110'
                              : isCompleted
                                ? 'bg-emerald-500 text-white'
                                : isInProgress
                                  ? 'bg-amber-500 text-white animate-pulse'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {isCompleted ? <Check size={16} /> : <IconComponent size={16} />}
                        </button>
                        <span className={`text-[10px] font-bold mt-1.5 text-center max-w-[65px] truncate ${
                          isSelected ? 'text-blue-600 font-black' : isCompleted ? 'text-emerald-700' : 'text-slate-500'
                        }`}>
                          {step.id}. {step.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Step Detailed Card */}
              {(() => {
                const activeStep = currentMeeting.lifecycleSteps[selectedStepIndex] || currentMeeting.lifecycleSteps[0];
                const StepIcon = STEP_ICONS[activeStep.id] || FileText;

                return (
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          <StepIcon size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
                              Etapa {activeStep.id} de 9
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              activeStep.status === StepStatus.COMPLETED 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : activeStep.status === StepStatus.IN_PROGRESS 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-slate-100 text-slate-600'
                            }`}>
                              {activeStep.status}
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900">{activeStep.name}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {activeStep.status !== StepStatus.COMPLETED ? (
                          <button
                            onClick={() => handleUpdateStepStatus(activeStep.id, StepStatus.COMPLETED)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                          >
                            <CheckCircle2 size={15} />
                            Marcar Etapa como Concluída
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStepStatus(activeStep.id, StepStatus.IN_PROGRESS)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                          >
                            <RefreshCw size={13} />
                            Reabrir Etapa
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {activeStep.description}
                    </p>

                    {/* RACI Matrix Grid */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        Matriz de Responsabilidades (RACI)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                        {activeStep.raci.map((r, i) => (
                          <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                              {r.role}
                            </span>
                            <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                              {r.assignedTo}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Legal Warning / Trava Jurídica da Etapa */}
                    {activeStep.legalWarnings && activeStep.legalWarnings.length > 0 && (
                      <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-1.5">
                        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                          <ShieldCheck size={16} className="text-amber-600" />
                          <span>Diretriz Jurídica & Conformidade Eleitoral (Lei 9.504/97)</span>
                        </div>
                        {activeStep.legalWarnings.map((w, wi) => (
                          <p key={wi} className="text-xs text-amber-900 font-medium leading-relaxed">
                            • {w}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Checklist Items */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                          Itens Obrigatórios de Verificação
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {activeStep.checklistItems.filter(i => i.completed).length} de {activeStep.checklistItems.length} concluídos
                        </span>
                      </div>

                      <div className="space-y-2">
                        {activeStep.checklistItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleToggleChecklistItem(activeStep.id, item.id)}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                              item.completed
                                ? 'bg-emerald-50/40 border-emerald-200 text-slate-700'
                                : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => {}} // Handled by parent div
                                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                              />
                              <span className={`text-xs font-medium ${item.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-800'}`}>
                                {item.text}
                              </span>
                            </div>

                            {item.required && (
                              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 px-2 py-0.5 rounded">
                                Obrigatório
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stepper Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        disabled={selectedStepIndex === 0}
                        onClick={() => setSelectedStepIndex(prev => Math.max(0, prev - 1))}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-30 transition-all"
                      >
                        ← Etapa Anterior
                      </button>

                      <button
                        disabled={selectedStepIndex === currentMeeting.lifecycleSteps.length - 1}
                        onClick={() => setSelectedStepIndex(prev => Math.min(currentMeeting.lifecycleSteps.length - 1, prev + 1))}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl disabled:opacity-30 transition-all flex items-center gap-1"
                      >
                        Próxima Etapa →
                      </button>
                    </div>

                  </div>
                );
              })()}

            </div>
          )}

          {/* ========================================================================= */}
          {/* SUBTAB 2: ATTENDANCE & JACOBS DENSITY CALCULATOR                          */}
          {/* ========================================================================= */}
          {activeSubTab === 'attendance' && (
            <div className="space-y-6">
              
              {/* Public Estimation & Jacobs Method Interactive Tool */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Auditoria de Público por Densidade (Método de Jacobs)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Cálculo técnico padrão de aglomeração: Área útil (m²) × Fator de Concentração
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-center min-w-[140px]">
                    <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider block">Público Calculado</span>
                    <span className="text-2xl font-black text-blue-700 tracking-tight">{calculatedJacobsPublic}</span>
                    <span className="text-[10px] text-slate-500 block">pessoas estimadas</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Área Útil do Espaço (m²)</label>
                    <input
                      type="number"
                      value={venueAreaInput}
                      onChange={(e) => setVenueAreaInput(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Fator de Densidade: <strong className="text-blue-600">{densityFactor} pessoas/m²</strong>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="4.5"
                      step="0.5"
                      value={densityFactor}
                      onChange={(e) => setDensityFactor(parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Leve (1 p/m²)</span>
                      <span>Média Sentada (2 p/m²)</span>
                      <span>Alta Aglomeração (4 p/m²)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leaders Check-In List */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Check-in de Lideranças & Multiplicadores
                    </h3>
                    <p className="text-xs text-slate-400">
                      Monitoramento de presença e capacidade de mobilização em campo
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddLeaderModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-xl transition-all"
                  >
                    <Plus size={14} />
                    Convidar Liderança
                  </button>
                </div>

                <div className="space-y-2.5">
                  {currentMeeting.leadersCheckIn.map((leader) => (
                    <div
                      key={leader.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{leader.leaderName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                            {leader.role}
                          </span>
                          <span className="text-[10px] text-slate-400">• {leader.territory}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Meta mobilizada: <strong>{leader.expectedSupporters} apoiadores</strong>
                          {leader.checkInTime && <span className="text-emerald-600 font-bold ml-2">• Check-in às {leader.checkInTime}</span>}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={leader.status}
                          onChange={(e) => handleLeaderStatusChange(leader.id, e.target.value as any)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 outline-none border cursor-pointer ${
                            leader.status === 'PRESENTE'
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                              : leader.status === 'CONFIRMADO'
                                ? 'bg-blue-100 border-blue-300 text-blue-800'
                                : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <option value="CONFIRMADO">CONFIRMADO</option>
                          <option value="PRESENTE">PRESENTE</option>
                          <option value="AUSENTE">AUSENTE</option>
                          <option value="JUSTIFICADO">JUSTIFICADO</option>
                        </select>

                        <a
                          href={`https://wa.me/55${leader.phone.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(leader.leaderName)}, confirmamos sua presença na ${encodeURIComponent(currentMeeting.title)}!`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors"
                          title="Enviar WhatsApp"
                        >
                          <MessageSquare size={14} />
                        </a>
                      </div>
                    </div>
                  ))}

                  {currentMeeting.leadersCheckIn.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">
                      Nenhuma liderança cadastrada para check-in nesta reunião.
                    </p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SUBTAB 3: EXPENSES & TSE JURIDICAL COMPLIANCE LOCK                        */}
          {/* ========================================================================= */}
          {activeSubTab === 'expenses' && (
            <div className="space-y-6">
              
              {/* Compliance Warning Banner */}
              <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-3xl shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-blue-400" />
                    <h3 className="font-bold text-sm">Trava Jurídica & Prevenção de Passivos Eleitorais (TSE)</h3>
                  </div>
                  <button
                    onClick={handleRunTseAudit}
                    disabled={isAuditingExpenses}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
                  >
                    <Sparkles size={14} className={isAuditingExpenses ? "animate-spin" : ""} />
                    {isAuditingExpenses ? "Auditando..." : "Auditar com IA"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-amber-400 font-bold block mb-1">Vedação a Showmício</span>
                    Apresentações artísticas remuneradas ou voluntárias são estritamente vedadas (Art. 39, §7º).
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-amber-400 font-bold block mb-1">Vedação a Brindes / Comida</span>
                    Proibida distribuição de camisetas, brindes ou comida para eleitores em geral (Art. 39, §6º).
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-emerald-400 font-bold block mb-1">Comprovante Fiscal Obrigatório</span>
                    Toda despesa requer NF-e emitida para o CNPJ de Campanha do Candidato.
                  </div>
                </div>

                {currentMeeting.legalAuditSummary?.auditFlags && (
                  <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                    <strong className="text-white">Parecer da Auditoria:</strong>
                    {currentMeeting.legalAuditSummary.auditFlags.map((f, fi) => (
                      <p key={fi} className="text-slate-300">• {f}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Expenses List & Actions */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Demonstrativo Contábil do Evento
                    </h3>
                    <p className="text-xs text-slate-400">
                      Lançamentos de fornecedores, comprovantes fiscais e fontes de custeio
                    </p>
                  </div>

                  <button
                    onClick={() => setIsNewExpenseModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    <Plus size={14} />
                    Lançar Despesa
                  </button>
                </div>

                <div className="space-y-3">
                  {currentMeeting.expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{exp.category}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            exp.complianceStatus === ComplianceAuditStatus.APPROVED
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {exp.complianceStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">{exp.description}</p>
                        <p className="text-[11px] text-slate-400">
                          Fornecedor: <strong>{exp.supplierName}</strong> ({exp.supplierTaxId}) • Doc: {exp.documentType} nº {exp.documentNumber}
                        </p>
                      </div>

                      <div className="text-right shrink-0 flex md:flex-col items-center md:items-end justify-between gap-1">
                        <span className="text-sm font-black text-slate-900">
                          R$ {exp.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {exp.fundingSource}
                        </span>
                        {exp.invoiceFileName && (
                          <span className="text-[10px] text-blue-600 flex items-center gap-1 font-bold">
                            <FileText size={11} /> {exp.invoiceFileName}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {currentMeeting.expenses.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">
                      Nenhuma despesa lançada para este evento até o momento.
                    </p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SUBTAB 4: AI PREDICTIVE INTELLIGENCE (GEMINI)                             */}
          {/* ========================================================================= */}
          {activeSubTab === 'ai_predictive' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Análise Preditiva de Conversão (Gemini AI)</h3>
                      <p className="text-xs text-slate-400">Cruzamento de perfil regional, lideranças presentes e pauta do encontro</p>
                    </div>
                  </div>

                  <button
                    onClick={handleRunAiPredictive}
                    disabled={isAnalyzingAi}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    <Sparkles size={15} className={isAnalyzingAi ? "animate-spin" : ""} />
                    {isAnalyzingAi ? "Calculando..." : "Recalcular Projeção IA"}
                  </button>
                </div>

                {currentMeeting.aiPredictiveAnalysis && (
                  <div className="space-y-6">
                    {/* Score Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Probabilidade de Sucesso / Adesão</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-3xl font-black text-blue-900">{currentMeeting.aiPredictiveAnalysis.expectedTurnoutScore}%</span>
                          <span className="text-xs text-blue-700 font-bold">score analítico</span>
                        </div>
                      </div>

                      <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Projeção de Conversão Eleitoral</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-3xl font-black text-emerald-900">~{currentMeeting.aiPredictiveAnalysis.conversionEstimate} votos</span>
                          <span className="text-xs text-emerald-700 font-bold">multiplicados</span>
                        </div>
                      </div>
                    </div>

                    {/* Speech Recommendations */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        Recomendações Estratégicas de Discurso para o Candidato
                      </h4>
                      <div className="space-y-2">
                        {currentMeeting.aiPredictiveAnalysis.speechRecommendations.map((rec, i) => (
                          <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        Fatores de Risco & Pontos Críticos de Atenção
                      </h4>
                      <div className="space-y-2">
                        {currentMeeting.aiPredictiveAnalysis.riskFactors.map((risk, i) => (
                          <div key={i} className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-100 flex items-start gap-2.5">
                            <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-rose-950 font-medium leading-relaxed">{risk}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Climate Alert */}
                    {currentMeeting.aiPredictiveAnalysis.climateAlert && (
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                        <Info size={16} className="text-blue-500 shrink-0" />
                        <span><strong>Boletim Climático:</strong> {currentMeeting.aiPredictiveAnalysis.climateAlert}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUBTAB 5: GEOREFERENCED MAP & REGIONAL DENSITY FOR SELECTED EVENT         */}
          {/* ========================================================================= */}
          {activeSubTab === 'map' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600" />
                    Geolocalização do Evento: {currentMeeting.venueName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentMeeting.address} — {currentMeeting.neighborhood} (Zona {currentMeeting.votingZone})
                  </p>
                </div>
                <button
                  onClick={() => setViewMode('map')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all"
                >
                  <Compass size={14} />
                  Expandir Mapa Completo
                </button>
              </div>

              <MeetingMapViewer
                meetings={meetings}
                selectedMeetingId={currentMeeting.id}
                onSelectMeeting={(id) => setSelectedMeetingId(id)}
                onOpenNewMeetingModal={() => setIsNewMeetingModalOpen(true)}
              />
            </div>
          )}

        </div>

      </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOVO AGENDAMENTO DE REUNIÃO COM MATRIZ DE CONFLITOS                */}
      {/* ========================================================================= */}
      {isNewMeetingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Agendar Nova Reunião / Evento</h3>
                <p className="text-xs text-slate-400">Validação em tempo real de matriz de conflitos de agenda e território</p>
              </div>
              <button 
                onClick={() => setIsNewMeetingModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Conflicts Warning */}
            {scheduleConflicts.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <span>Alerta de Matriz de Conflitos Detectado:</span>
                </div>
                {scheduleConflicts.map((c, i) => (
                  <p key={i} className="text-xs text-amber-900 font-medium">• {c}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleCreateMeeting} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Título do Evento / Plenária *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Plenária com Moradores do Bairro da Paz"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Formato / Tipo</label>
                  <select
                    value={newMeeting.type}
                    onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {Object.values(MeetingType).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Data *</label>
                  <input
                    type="date"
                    required
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Início</label>
                    <input
                      type="time"
                      value={newMeeting.startTime}
                      onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                      className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Término</label>
                    <input
                      type="time"
                      value={newMeeting.endTime}
                      onChange={(e) => setNewMeeting({ ...newMeeting, endTime: e.target.value })}
                      className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nome do Local / Salão *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Associação de Moradores Norte"
                    value={newMeeting.venueName}
                    onChange={(e) => setNewMeeting({ ...newMeeting, venueName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Endereço Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Rua Central, 450"
                    value={newMeeting.address}
                    onChange={(e) => setNewMeeting({ ...newMeeting, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Bairro</label>
                  <input
                    type="text"
                    placeholder="Ex: Santo Amaro"
                    value={newMeeting.neighborhood}
                    onChange={(e) => setNewMeeting({ ...newMeeting, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Zona Eleitoral</label>
                  <input
                    type="text"
                    value={newMeeting.votingZone}
                    onChange={(e) => setNewMeeting({ ...newMeeting, votingZone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Capacidade Estimada</label>
                  <input
                    type="number"
                    value={newMeeting.venueCapacity}
                    onChange={(e) => setNewMeeting({ ...newMeeting, venueCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Coordenador Responsável *</span>
                    <span className="text-[10px] text-blue-600 font-semibold">Responsável pela execução</span>
                  </label>
                  <select
                    value={newMeeting.coordinatorId}
                    onChange={(e) => setNewMeeting({ ...newMeeting, coordinatorId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 cursor-pointer focus:bg-white focus:border-blue-500"
                  >
                    {MOCK_TEAMS.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name} — {team.territory} ({team.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Público Esperado</label>
                  <input
                    type="number"
                    value={newMeeting.expectedAttendance}
                    onChange={(e) => setNewMeeting({ ...newMeeting, expectedAttendance: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Pauta Principal do Encontro</label>
                <textarea
                  rows={2}
                  placeholder="Descreva o tema central e principais reivindicações locais..."
                  value={newMeeting.topic}
                  onChange={(e) => setNewMeeting({ ...newMeeting, topic: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewMeetingModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
                >
                  Criar e Iniciar Lifecycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LANÇAMENTO DE DESPESA COM TRAVA JURÍDICA E COMPROVANTE FISCAL       */}
      {/* ========================================================================= */}
      {isNewExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Lançar Despesa do Evento</h3>
                <p className="text-xs text-slate-400">Conformidade obrigatória com as regras de prestação do TSE</p>
              </div>
              <button 
                onClick={() => setIsNewExpenseModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Categoria de Despesa *</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  {Object.values(ExpenseCategory).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Descrição Detalhada do Serviço/Material *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Locação de som e 4 microfones sem fio"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Razão Social / Fornecedor</label>
                  <input
                    type="text"
                    placeholder="Ex: Som & Iluminação Ltda"
                    value={newExpense.supplierName}
                    onChange={(e) => setNewExpense({ ...newExpense, supplierName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">CNPJ / CPF do Fornecedor *</label>
                  <input
                    type="text"
                    required
                    placeholder="00.000.000/0001-00"
                    value={newExpense.supplierTaxId}
                    onChange={(e) => setNewExpense({ ...newExpense, supplierTaxId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Valor Total (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nº da NF-e / Recibo</label>
                  <input
                    type="text"
                    placeholder="Ex: 004821"
                    value={newExpense.documentNumber}
                    onChange={(e) => setNewExpense({ ...newExpense, documentNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Fonte de Recursos (Custeio)</label>
                <select
                  value={newExpense.fundingSource}
                  onChange={(e) => setNewExpense({ ...newExpense, fundingSource: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  {Object.values(PaymentFundingSource).map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Simulated Receipt File Upload */}
              <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center space-y-1.5">
                <Upload size={18} className="mx-auto text-slate-400" />
                <p className="text-xs text-slate-600 font-medium">Anexar Comprovante Fiscal (PDF ou Imagem)</p>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewExpense({ ...newExpense, invoiceFileName: e.target.files[0].name });
                    }
                  }}
                  className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewExpenseModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
                >
                  Homologar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONVIDAR LIDERANÇA PARA CHECK-IN                                   */}
      {/* ========================================================================= */}
      {isAddLeaderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Convidar Liderança para o Evento</h3>
              <button 
                onClick={() => setIsAddLeaderModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!newLeader.leaderName) return;

                const leaderObj: LeaderCheckIn = {
                  id: 'lc_' + Date.now(),
                  leaderName: newLeader.leaderName,
                  role: newLeader.role || 'Liderança Comunitária',
                  territory: newLeader.territory,
                  phone: newLeader.phone || '(11) 98888-0000',
                  expectedSupporters: Number(newLeader.expectedSupporters) || 15,
                  status: 'CONFIRMADO'
                };

                setMeetings(prev => prev.map(m => {
                  if (m.id !== currentMeeting.id) return m;
                  return {
                    ...m,
                    leadersCheckIn: [...m.leadersCheckIn, leaderObj]
                  };
                }));

                setIsAddLeaderModalOpen(false);
                setNewLeader({ leaderName: '', role: '', territory: 'Zona Sul', phone: '', expectedSupporters: 20 });
                addToast({ type: 'success', title: 'Liderança Convidada', message: 'Registro adicionado à lista de check-in.' });
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nome da Liderança *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pastor Marcos / Dra. Regina"
                  value={newLeader.leaderName}
                  onChange={(e) => setNewLeader({ ...newLeader, leaderName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Cargo / Entidade Representada</label>
                <input
                  type="text"
                  placeholder="Ex: Associação de Bairro / Coletivo Cultural"
                  value={newLeader.role}
                  onChange={(e) => setNewLeader({ ...newLeader, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Território</label>
                  <input
                    type="text"
                    value={newLeader.territory}
                    onChange={(e) => setNewLeader({ ...newLeader, territory: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Meta de Apoiadores</label>
                  <input
                    type="number"
                    value={newLeader.expectedSupporters}
                    onChange={(e) => setNewLeader({ ...newLeader, expectedSupporters: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Telefone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="(11) 98888-7777"
                  value={newLeader.phone}
                  onChange={(e) => setNewLeader({ ...newLeader, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddLeaderModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
                >
                  Adicionar ao Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ALTERAR COORDENADOR RESPONSÁVEL DA REUNIÃO                         */}
      {/* ========================================================================= */}
      {isChangeCoordinatorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <UserCheck size={18} className="text-blue-600" />
                  <span>Alterar Coordenador Responsável</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reatribuir a responsabilidade e supervisão do evento: <strong>{currentMeeting.title}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsChangeCoordinatorModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Selecione o novo Coordenador da Reunião:
              </label>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {MOCK_TEAMS.map((team) => {
                  const isSelected = selectedCoordinatorIdForChange === team.id;
                  const isCurrent = currentMeeting.coordinatorId === team.id;

                  return (
                    <div
                      key={team.id}
                      onClick={() => setSelectedCoordinatorIdForChange(team.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {team.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{team.name}</h4>
                            {isCurrent && (
                              <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                Atual
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {team.territory} • {team.phone}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs font-bold ${
                          isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 text-transparent'
                        }`}>
                          ✓
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsChangeCoordinatorModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleChangeCoordinator(currentMeeting.id, selectedCoordinatorIdForChange)}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all active:scale-95"
              >
                Confirmar Reatribuição
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Meetings;
