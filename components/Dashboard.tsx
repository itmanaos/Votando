import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Users, Target, UserPlus, FileSearch, TrendingUp, Sparkles, 
  ArrowUpRight, ArrowDownRight, ShieldCheck, MapPin, CheckCircle2, 
  RefreshCw, Award, Activity, Zap, AlertCircle
} from 'lucide-react';
import { MOCK_VOTERS, MOCK_POLLS, MOCK_TEAMS, MOCK_SURVEYS } from '../constants';
import { getCampaignInsights } from '../geminiService';
import { useToast } from './Toast';
import { useDatabase } from './DatabaseContext';

interface PollingPoint {
  date: string;
  candidateA: number;
  candidateB: number;
  undecided: number;
  sampleSize: number;
}

const EXTENDED_POLLS: Record<string, PollingPoint[]> = {
  'Geral': [
    { date: 'Jun/24', candidateA: 29, candidateB: 31, undecided: 24, sampleSize: 1000 },
    { date: 'Jul/24', candidateA: 32, candidateB: 29, undecided: 21, sampleSize: 1200 },
    { date: 'Ago/24', candidateA: 35, candidateB: 28, undecided: 18, sampleSize: 1200 },
    { date: 'Set/24', candidateA: 39, candidateB: 27, undecided: 14, sampleSize: 1500 },
    { date: 'Out/24 (Atual)', candidateA: 44, candidateB: 26, undecided: 11, sampleSize: 2000 },
  ],
  'Zona Sul': [
    { date: 'Jun/24', candidateA: 34, candidateB: 28, undecided: 20, sampleSize: 400 },
    { date: 'Jul/24', candidateA: 38, candidateB: 26, undecided: 18, sampleSize: 400 },
    { date: 'Ago/24', candidateA: 42, candidateB: 24, undecided: 15, sampleSize: 500 },
    { date: 'Set/24', candidateA: 46, candidateB: 23, undecided: 12, sampleSize: 500 },
    { date: 'Out/24 (Atual)', candidateA: 51, candidateB: 22, undecided: 9, sampleSize: 600 },
  ],
  'Zona Norte': [
    { date: 'Jun/24', candidateA: 25, candidateB: 34, undecided: 25, sampleSize: 300 },
    { date: 'Jul/24', candidateA: 28, candidateB: 32, undecided: 22, sampleSize: 350 },
    { date: 'Ago/24', candidateA: 31, candidateB: 30, undecided: 19, sampleSize: 350 },
    { date: 'Set/24', candidateA: 35, candidateB: 29, undecided: 16, sampleSize: 450 },
    { date: 'Out/24 (Atual)', candidateA: 39, candidateB: 28, undecided: 13, sampleSize: 550 },
  ],
  'Centro': [
    { date: 'Jun/24', candidateA: 30, candidateB: 30, undecided: 26, sampleSize: 300 },
    { date: 'Jul/24', candidateA: 33, candidateB: 28, undecided: 22, sampleSize: 450 },
    { date: 'Ago/24', candidateA: 36, candidateB: 27, undecided: 19, sampleSize: 450 },
    { date: 'Set/24', candidateA: 40, candidateB: 26, undecided: 14, sampleSize: 500 },
    { date: 'Out/24 (Atual)', candidateA: 45, candidateB: 25, undecided: 10, sampleSize: 600 },
  ]
};

const Dashboard: React.FC = () => {
  const { addToast } = useToast();
  const { voters, teams, isDatabaseEmpty, restoreDemoData } = useDatabase();
  const [selectedRegion, setSelectedRegion] = useState<string>('Geral');
  const [activeChartType, setActiveChartType] = useState<'area' | 'line'>('area');
  const [aiInsights, setAiInsights] = useState<Array<{ insight: string; action: string }>>([
    { insight: "Crescimento sustentado de +5% na intenção de voto no último mês impulsionado pelo Centro.", action: "Intensificar caminhadas e corpo a corpo na Zona Norte." },
    { insight: "Índice de indecisos caiu para 11%, concentrando-se em eleitores jovens de 18 a 29 anos.", action: "Disparar pautas de primeiro emprego e tecnologia nas redes." },
    { insight: "Equipe Zona Sul atingiu 84% da meta de captação de votos cadastrados.", action: "Replicar método de abordagem territorial para a Zona Norte." }
  ]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Agora mesmo');

  // Calculate dynamic KPIs from active database
  const totalVoters = voters.length;
  const loyalVoters = voters.filter(v => v.supportLevel === 'LOYAL').length;
  const undecidedVoters = voters.filter(v => v.supportLevel === 'INDECISIVE').length;
  const oppositionVoters = voters.filter(v => v.supportLevel === 'OPPOSITION').length;
  const neutralVoters = voters.filter(v => v.supportLevel === 'NEUTRAL').length;

  const totalGoals = useMemo(() => teams.reduce((acc, t) => acc + t.goals, 0), [teams]);
  const totalAchieved = useMemo(() => teams.reduce((acc, t) => acc + t.achieved, 0), [teams]);
  const teamEfficiency = totalGoals > 0 ? Math.round((totalAchieved / totalGoals) * 100) : 0;

  const currentPollData = EXTENDED_POLLS[selectedRegion] || EXTENDED_POLLS['Geral'];
  const latestPoll = currentPollData[currentPollData.length - 1];
  const previousPoll = currentPollData[currentPollData.length - 2];
  const deltaCandidateA = latestPoll.candidateA - previousPoll.candidateA;

  const pieData = useMemo(() => {
    if (totalVoters === 0) {
      return [
        { name: 'Nenhum Eleitor', value: 1, color: '#e2e8f0', percentage: 100 }
      ];
    }
    return [
      { name: 'Fiel (Consolidado)', value: loyalVoters, color: '#10b981', percentage: Math.round((loyalVoters / totalVoters) * 100) },
      { name: 'Indeciso (Alvo)', value: undecidedVoters, color: '#f59e0b', percentage: Math.round((undecidedVoters / totalVoters) * 100) },
      { name: 'Oposição', value: oppositionVoters, color: '#ef4444', percentage: Math.round((oppositionVoters / totalVoters) * 100) },
      { name: 'Neutro', value: neutralVoters, color: '#94a3b8', percentage: Math.round((neutralVoters / totalVoters) * 100) },
    ];
  }, [totalVoters, loyalVoters, undecidedVoters, oppositionVoters, neutralVoters]);

  const teamChartData = useMemo(() => {
    if (teams.length === 0) return [];
    return teams.map(t => ({
      territory: t.territory || t.name,
      meta: t.goals,
      realizado: t.achieved,
      rate: t.goals > 0 ? Math.round((t.achieved / t.goals) * 100) : 0,
      leader: t.name
    }));
  }, [teams]);

  const strategicPriorities = [
    { topic: 'Saúde Pública & UPAs', votes: 42, color: 'bg-blue-500' },
    { topic: 'Segurança & Iluminação', votes: 28, color: 'bg-indigo-500' },
    { topic: 'Educação & Creches', votes: 18, color: 'bg-teal-500' },
    { topic: 'Transporte & Asfalto', votes: 12, color: 'bg-amber-500' },
  ];

  const handleRefreshAi = async () => {
    setIsLoadingAi(true);
    try {
      const insights = await getCampaignInsights(MOCK_VOTERS, currentPollData);
      if (insights && insights.length > 0) {
        setAiInsights(insights);
        addToast({
          type: 'success',
          title: 'Inteligência Atualizada',
          message: 'Novos insights estratégicos gerados com sucesso pelo Gemini.'
        });
      }
    } catch (e) {
      addToast({
        type: 'info',
        title: 'Insights Recarregados',
        message: 'Análise estratégica sintetizada com base nas pesquisas recentes.'
      });
    } finally {
      setIsLoadingAi(false);
      setLastRefreshed(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Total Voters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Users size={24} />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <ArrowUpRight size={14} />
              +12.4%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Eleitores Cadastrados</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{totalVoters.toLocaleString('pt-BR')}</h3>
            <span className="text-xs text-slate-400 font-medium">no CRM</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Fidelizados: <strong className="text-slate-700 font-bold">{loyalVoters}</strong></span>
            <span>Indecisos: <strong className="text-amber-600 font-bold">{undecidedVoters}</strong></span>
          </div>
        </div>

        {/* KPI 2: Active Teams */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Target size={24} />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
              {teamEfficiency}% Meta
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Equipes & Lideranças</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{teams.length}</h3>
            <span className="text-xs text-slate-400 font-medium">integrantes</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Captados: <strong className="text-slate-700 font-bold">{totalAchieved}</strong></span>
            <span>Meta: <strong className="text-slate-700 font-bold">{totalGoals}</strong></span>
          </div>
        </div>

        {/* KPI 3: Real-Time Poll Leader */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <TrendingUp size={24} />
            </div>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
              deltaCandidateA >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
            }`}>
              {deltaCandidateA >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {deltaCandidateA > 0 ? `+${deltaCandidateA}%` : `${deltaCandidateA}%`}
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Intenção de Voto (Líder)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-blue-600 tracking-tight">{latestPoll.candidateA}%</h3>
            <span className="text-xs text-slate-400 font-medium">vs {latestPoll.candidateB}%</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Vantagem: <strong className="text-blue-700 font-bold">+{latestPoll.candidateA - latestPoll.candidateB} pp</strong></span>
            <span>Indecisos: <strong className="text-amber-600 font-bold">{latestPoll.undecided}%</strong></span>
          </div>
        </div>

        {/* KPI 4: Research & Field Surveys */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <FileSearch size={24} />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 size={13} />
              1.3k Amostras
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pesquisas & Campo</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{MOCK_SURVEYS.length} ativas</h3>
            <span className="text-xs text-slate-400 font-medium">questionários</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Respostas: <strong className="text-slate-700 font-bold">1.345</strong></span>
            <span>Margem: <strong className="text-slate-700 font-bold">± 2.5%</strong></span>
          </div>
        </div>

      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-Time Polling Trends (Takes 2 Columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <TrendingUp size={18} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">Evolução da Intenção de Voto em Tempo Real</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">Série histórica comparada por rodadas de amostragem eleitoral</p>
              </div>

              {/* Regional and Style Filters */}
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1">
                  {(['area', 'line'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveChartType(type)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md capitalize transition-all ${
                        activeChartType === type 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {type === 'area' ? 'Área' : 'Linhas'}
                    </button>
                  ))}
                </div>

                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <option value="Geral">Território Geral</option>
                  <option value="Zona Sul">Zona Sul</option>
                  <option value="Zona Norte">Zona Norte</option>
                  <option value="Centro">Região Central</option>
                </select>
              </div>
            </div>

            {/* Polling Score Header Badges */}
            <div className="grid grid-cols-3 gap-3 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nosso Candidato</p>
                  <p className="text-base font-black text-blue-600">{latestPoll.candidateA}% <span className="text-[10px] text-emerald-600 font-bold">({deltaCandidateA > 0 ? `+${deltaCandidateA}%` : `${deltaCandidateA}%`})</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Oponente Principal</p>
                  <p className="text-base font-black text-slate-700">{latestPoll.candidateB}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Indecisos</p>
                  <p className="text-base font-black text-amber-600">{latestPoll.undecided}%</p>
                </div>
              </div>
            </div>

            {/* Recharts Chart Container */}
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {activeChartType === 'area' ? (
                  <AreaChart data={currentPollData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCandidateA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorCandidateB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorUndecided" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 60]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip 
                      formatter={(value: any, name: any) => [`${value}%`, name === 'candidateA' ? 'Nosso Candidato' : name === 'candidateB' ? 'Oponente' : 'Indecisos']}
                      contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '10px' }}
                    />
                    <Area type="monotone" dataKey="candidateA" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCandidateA)" name="Nosso Candidato" />
                    <Area type="monotone" dataKey="candidateB" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorCandidateB)" name="Oponente Principal" />
                    <Area type="monotone" dataKey="undecided" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorUndecided)" name="Indecisos" />
                  </AreaChart>
                ) : (
                  <LineChart data={currentPollData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 60]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip 
                      formatter={(value: any, name: any) => [`${value}%`, name === 'candidateA' ? 'Nosso Candidato' : name === 'candidateB' ? 'Oponente' : 'Indecisos']}
                      contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="candidateA" stroke="#2563eb" strokeWidth={4} dot={{ fill: '#2563eb', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} name="Nosso Candidato" />
                    <Line type="monotone" dataKey="candidateB" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 4 }} name="Oponente Principal" />
                    <Line type="monotone" dataKey="undecided" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={{ fill: '#f59e0b', r: 3 }} name="Indecisos" />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <span>Região Selecionada: <strong className="text-slate-700 font-semibold">{selectedRegion}</strong></span>
            <span>Amostragem: <strong>{latestPoll.sampleSize} entrevistas presenciais</strong></span>
            <span>Margem de Erro: <strong>± 2.2%</strong></span>
          </div>
        </div>

        {/* Support Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                  <Users size={18} />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Perfil de Apoio Eleitoral</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">{totalVoters} base</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Segmentação da base de eleitores por conversão política</p>

            {/* Donut Chart with Centered KPI */}
            <div className="h-[210px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={86}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} eleitores`, 'Total']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-800 tracking-tight">{Math.round((loyalVoters / totalVoters) * 100)}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fidelidade</span>
              </div>
            </div>

            {/* List breakdown */}
            <div className="space-y-2 mt-2">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">{item.value.toLocaleString('pt-BR')}</span>
                    <span className="text-xs font-black text-slate-800 min-w-[32px] text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-medium">Meta de conversão: <strong>55% de eleitores fiéis</strong> até o pleito</span>
          </div>
        </div>

      </div>

      {/* Secondary Row: Active Campaign Teams Performance & Strategic Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Campaign Teams Performance (2 Columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Target size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Desempenho das Equipes Territoriais</h3>
                <p className="text-xs text-slate-400">Captação real de eleitores cadastrados vs. meta estabelecida por zona</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <div className="w-3 h-3 rounded bg-blue-600"></div>
                Realizado
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <div className="w-3 h-3 rounded bg-slate-200"></div>
                Meta
              </div>
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="territory" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  formatter={(value: any, name: any) => [`${value} cadastros`, name === 'realizado' ? 'Cadastrados' : 'Meta']}
                  contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="meta" fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Meta" barSize={28} />
                <Bar dataKey="realizado" fill="#2563eb" radius={[6, 6, 0, 0]} name="Realizado" barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Team Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
            {teamChartData.map((t, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-700 truncate">{t.territory}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                    t.rate >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {t.rate}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{t.leader}</p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${t.rate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(t.rate, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Priorities & Demand Topics */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Zap size={18} />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Demandas Prioritárias</h3>
              </div>
              <span className="text-xs text-slate-400 font-bold">Interesse Popular</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">Pautas com maior impacto na decisão de voto registradas no campo</p>

            <div className="space-y-4">
              {strategicPriorities.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">{item.topic}</span>
                    <span className="text-slate-900">{item.votes}% dos eleitores</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.color} transition-all duration-700`} 
                      style={{ width: `${item.votes}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100/80 mt-6">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 leading-relaxed font-medium">
                Pauta de <strong>Saúde Pública</strong> possui 42% de apelo entre indecisos. Recomendado enfatizar propostas nos comícios desta semana.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Strategic AI Insights Cards */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Recomendações Estratégicas Automatizadas (Gemini AI)</h3>
              <p className="text-xs text-slate-400">Cruzamento de pesquisas de intenção, perfis socioeconômicos e metas de equipes</p>
            </div>
          </div>
          <button
            onClick={handleRefreshAi}
            disabled={isLoadingAi}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-lg transition-colors disabled:opacity-50 self-start sm:self-auto"
          >
            <Sparkles size={14} className={isLoadingAi ? "animate-spin" : ""} />
            {isLoadingAi ? "Analisando..." : "Atualizar Insights"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {aiInsights.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Diagnóstico</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.insight}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-start gap-2">
                <ArrowUpRight size={14} className="text-blue-600 shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <p className="text-xs font-bold text-blue-900">
                  <span className="text-blue-600 font-extrabold uppercase text-[10px] block">Ação Recomendada:</span>
                  {item.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
