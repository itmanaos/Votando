
import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Users, 
  Clock, 
  MapPin, 
  TrendingUp, 
  BarChart, 
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Vote,
  GanttChartSquare,
  Activity,
  FileSpreadsheet,
  Plus,
  ShieldCheck,
  History,
  X,
  Save,
  Hash,
  AlertTriangle,
  ChevronRight,
  Eye,
  ArrowRightLeft
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MOCK_CANDIDATES, MOCK_TALLY_STATS } from '../constants';
import { BallotReport } from '../types';
import { useToast } from './Toast';
import { useDatabase } from './DatabaseContext';

const BallotReportModal: React.FC<{ onClose: () => void; onSave: (report: any) => void; existingReports: BallotReport[] }> = ({ onClose, onSave, existingReports }) => {
  const [formData, setFormData] = useState({
    zone: '',
    section: '',
    votesCandidateA: '',
    votesCandidateB: '',
    votesOthers: '',
    blankVotes: '',
    nullVotes: '',
    fiscalName: 'Fiscal de Campo #12'
  });
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.zone || !formData.section) {
      showToast("Zona e Seção são obrigatórias.", "error");
      return;
    }

    const isDuplicate = existingReports.some(r => r.zone === formData.zone && r.section === formData.section);
    if (isDuplicate) {
      showToast(`Boletim para Zona ${formData.zone} / Seção ${formData.section} já foi lançado.`, "error");
      return;
    }

    const report = {
      ...formData,
      votesCandidateA: Number(formData.votesCandidateA),
      votesCandidateB: Number(formData.votesCandidateB),
      votesOthers: Number(formData.votesOthers),
      blankVotes: Number(formData.blankVotes),
      nullVotes: Number(formData.nullVotes),
    };

    onSave(report);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose}></div>
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col animate-in zoom-in duration-300 border border-slate-100"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Lançar Boletim de Urna (BU)</h3>
              <p className="text-xs text-indigo-100 font-bold uppercase tracking-widest">Auditoria Paralela de Campo</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zona Eleitoral</label>
              <input 
                required
                type="number"
                placeholder="Ex: 102"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.zone}
                onChange={e => setFormData({...formData, zone: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seção</label>
              <input 
                required
                type="number"
                placeholder="Ex: 045"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.section}
                onChange={e => setFormData({...formData, section: e.target.value})}
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} /> Contagem de Votos
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Nosso Candidato (A)</label>
                <input 
                  required
                  type="number"
                  className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-black text-blue-700"
                  value={formData.votesCandidateA}
                  onChange={e => setFormData({...formData, votesCandidateA: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Oponente Principal (B)</label>
                <input 
                  required
                  type="number"
                  className="w-full bg-rose-50/50 border border-rose-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-500 font-black text-rose-700"
                  value={formData.votesCandidateB}
                  onChange={e => setFormData({...formData, votesCandidateB: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Outros</label>
                <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none" value={formData.votesOthers} onChange={e => setFormData({...formData, votesOthers: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Brancos</label>
                <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none" value={formData.blankVotes} onChange={e => setFormData({...formData, blankVotes: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Nulos</label>
                <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none" value={formData.nullVotes} onChange={e => setFormData({...formData, nullVotes: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-2xl transition-colors">
            Cancelar
          </button>
          <button type="submit" className="flex-[2] py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
            <Save size={18} /> Confirmar Boletim
          </button>
        </div>
      </form>
    </div>
  );
};

const VotingResults: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OFFICIAL' | 'PARALLEL'>('OFFICIAL');
  const { ballotReports: reports, setBallotReports: setReports } = useDatabase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  
  const tallyProgress = useMemo(() => {
    return (MOCK_TALLY_STATS.sectionsCounted / MOCK_TALLY_STATS.sectionsTotal) * 100;
  }, []);

  const parallelStats = useMemo(() => {
    return reports.reduce((acc, r) => ({
      votesA: acc.votesA + r.votesCandidateA,
      votesB: acc.votesB + r.votesCandidateB,
      others: acc.others + r.votesOthers,
      totalValid: acc.totalValid + r.votesCandidateA + r.votesCandidateB + r.votesOthers
    }), { votesA: 0, votesB: 0, others: 0, totalValid: 0 });
  }, [reports]);

  const pieData = [
    { name: 'Votos Válidos', value: MOCK_TALLY_STATS.validVotes, color: '#3b82f6' },
    { name: 'Brancos', value: MOCK_TALLY_STATS.blankVotes, color: '#cbd5e1' },
    { name: 'Nulos', value: MOCK_TALLY_STATS.nullVotes, color: '#f43f5e' },
  ];

  const handleRefresh = () => {
    showToast("Sincronizando com base de dados central...", "info");
  };

  const handleSaveReport = (reportData: any) => {
    const newReport: BallotReport = {
      ...reportData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('pt-BR')
    };
    setReports([newReport, ...reports]);
    setIsModalOpen(false);
    showToast(`Boletim da Seção ${newReport.section} incluído com sucesso!`, "success");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Module Header with Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Centro de Apuração</h1>
          <p className="text-sm text-slate-500 font-medium">Monitoramento oficial e auditoria de campo</p>
        </div>
        <div className="flex p-1 bg-slate-200/50 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('OFFICIAL')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'OFFICIAL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldCheck size={16} /> Dados Oficiais
          </button>
          <button 
            onClick={() => setActiveTab('PARALLEL')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'PARALLEL' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileSpreadsheet size={16} /> Auditoria Paralela
          </button>
        </div>
      </div>

      {activeTab === 'OFFICIAL' ? (
        <>
          {/* Live Header Status */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900 text-white relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              
              <div className="flex items-center gap-5 z-10">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Vote size={32} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-black tracking-tight">Apuração em Tempo Real</h1>
                    <span className="flex items-center gap-1.5 bg-rose-500 text-[10px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">
                      <Activity size={10} /> Ao Vivo
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> Atualizado em: {MOCK_TALLY_STATS.lastUpdate}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 z-10">
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Seções Totalizadas</p>
                    <p className="text-2xl font-black">{tallyProgress.toFixed(1)}%</p>
                  </div>
                  <div className="w-px h-10 bg-slate-800"></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Total Votos</p>
                    <p className="text-2xl font-black">{MOCK_TALLY_STATS.votersPresent.toLocaleString()}</p>
                  </div>
                </div>
                <button 
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  <RefreshCcw size={14} /> Sincronizar Agora
                </button>
              </div>
            </div>
            
            <div className="h-2 w-full bg-slate-200">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
                style={{ width: `${tallyProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
                <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-tight">
                  <Trophy size={20} className="text-amber-500" /> Resultados por Candidato
                </h2>
                <div className="space-y-8">
                  {MOCK_CANDIDATES.map((candidate, idx) => (
                    <div key={candidate.id} className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">
                              {candidate.name}
                              {candidate.isMain && <CheckCircle2 size={18} className="text-blue-500" />}
                            </h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{candidate.party}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black text-slate-800">{candidate.percentage.toFixed(1)}%</p>
                          <p className="text-xs font-bold text-slate-400 uppercase">{candidate.votes.toLocaleString()} Votos</p>
                        </div>
                      </div>
                      <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div 
                          className="h-full transition-all duration-1000 ease-out rounded-full" 
                          style={{ 
                            width: `${candidate.percentage}%`, 
                            backgroundColor: candidate.color,
                            boxShadow: `0 0 10px ${candidate.color}33`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
                  <BarChart size={18} className="text-blue-500" /> Distribuição de Votos
                </h2>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* PARALLEL TAB */
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              {/* Parallel Overview */}
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <ArrowRightLeft size={28} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-800">Auditagem vs. TSE</h2>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Base comparativa de {reports.length} boletins</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                  >
                    <Plus size={18} /> Novo Boletim de Urna
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Total Paralelo (A)</p>
                    <div className="flex items-end justify-between">
                      <h4 className="text-3xl font-black text-slate-800">{parallelStats.votesA.toLocaleString()}</h4>
                      <div className="text-right">
                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {parallelStats.totalValid > 0 ? ((parallelStats.votesA / parallelStats.totalValid) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Divergência Estimada</p>
                    <div className="flex items-end justify-between">
                      <h4 className="text-3xl font-black text-slate-800">0.02%</h4>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} /> Dentro da Margem
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Boletins / Meta</p>
                    <div className="flex items-end justify-between">
                      <h4 className="text-3xl font-black text-slate-800">{reports.length}</h4>
                      <span className="text-xs font-bold text-slate-500 uppercase">/ {MOCK_TALLY_STATS.sectionsTotal} Seções</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reports Table */}
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <History size={16} className="text-indigo-500" /> Histórico de Lançamentos
                  </h3>
                  <div className="flex gap-2">
                     <span className="text-[10px] font-bold text-slate-400">Total de Votos Auditados: <span className="text-slate-700">{parallelStats.totalValid.toLocaleString()}</span></span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-tighter border-b border-slate-50">
                        <th className="px-6 py-4">Zona / Seção</th>
                        <th className="px-6 py-4">Candidato A</th>
                        <th className="px-6 py-4">Candidato B</th>
                        <th className="px-6 py-4">Outros/B/N</th>
                        <th className="px-6 py-4">Fiscal / Hora</th>
                        <th className="px-6 py-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {reports.length > 0 ? (
                        reports.map((report) => (
                          <tr key={report.id} className="text-sm hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg font-black text-xs">Z-{report.zone}</span>
                                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg font-black text-xs">S-{report.section}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-black text-blue-600">{report.votesCandidateA}</td>
                            <td className="px-6 py-4 font-black text-rose-600">{report.votesCandidateB}</td>
                            <td className="px-6 py-4 text-slate-500 font-medium">
                              {report.votesOthers + report.blankVotes + report.nullVotes}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-700">{report.fiscalName}</span>
                                <span className="text-[10px] text-slate-400">{report.timestamp}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                <Eye size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center justify-center text-slate-300">
                               <FileSpreadsheet size={48} className="opacity-20 mb-4" />
                               <p className="text-sm font-bold uppercase tracking-widest">Nenhum boletim lançado</p>
                               <p className="text-xs">Os boletins enviados pelos fiscais aparecerão aqui.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Alert Card */}
              <div className="bg-indigo-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <h3 className="text-lg font-black mb-4 flex items-center gap-2 tracking-tight">
                  <ShieldCheck size={20} className="text-indigo-400" /> Controle de Integridade
                </h3>
                <p className="text-xs text-indigo-200 leading-relaxed font-medium mb-6">
                  A apuração paralela serve para detectar possíveis atrasos ou anomalias no envio dos dados ao sistema oficial.
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Seções Pendentes</p>
                    <p className="text-xl font-black">{MOCK_TALLY_STATS.sectionsTotal - reports.length}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Cobertura de Campo</p>
                    <p className="text-xl font-black">{reports.length > 0 ? ((reports.length / MOCK_TALLY_STATS.sectionsTotal) * 100).toFixed(1) : 0}%</p>
                  </div>
                </div>
              </div>

              {/* Warning Log */}
              <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100">
                <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <AlertTriangle size={14} /> Log de Auditoria
                </h4>
                <div className="space-y-3">
                   <div className="p-3 bg-white border border-amber-100 rounded-xl text-[10px] font-bold text-amber-800 leading-tight">
                      <span className="text-amber-500 block mb-1">21:30 • DIVERGÊNCIA</span>
                      Diferença de 4 votos detectada na Seção 045 em relação ao pré-lançamento.
                   </div>
                   <div className="p-3 bg-white border border-amber-100 rounded-xl text-[10px] font-bold text-amber-800 leading-tight opacity-50">
                      <span className="text-emerald-500 block mb-1">21:15 • VALIDAÇÃO</span>
                      Boletim da Zona 102/105 validado com sucesso.
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <BallotReportModal 
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveReport}
          existingReports={reports}
        />
      )}
    </div>
  );
};

export default VotingResults;
