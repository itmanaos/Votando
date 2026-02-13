
import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  Settings, 
  BarChart, 
  ChevronRight, 
  Save, 
  X, 
  CheckCircle2, 
  Circle, 
  Type, 
  HelpCircle,
  Hash,
  ToggleLeft,
  LayoutList,
  Target,
  FileText,
  Search,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users,
  Eye,
  Info,
  ListChecks,
  MessageSquareText,
  Clock,
  MapPin,
  Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MOCK_SURVEYS, MOCK_POLLS } from '../constants';
import { Survey, SurveyType, Question, QuestionType } from '../types';
import { useToast } from './Toast';

const SurveyDetailModal: React.FC<{ survey: Survey; onClose: () => void }> = ({ survey, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVA': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'RASCUNHO': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'FINALIZADA': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getQuestionIcon = (type: QuestionType) => {
    switch (type) {
      case QuestionType.TEXT: return <MessageSquareText size={16} />;
      case QuestionType.YES_NO: return <ToggleLeft size={16} />;
      case QuestionType.MULTIPLE_CHOICE: return <ListChecks size={16} />;
      case QuestionType.NUMERIC: return <Hash size={16} />;
      default: return <HelpCircle size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative flex flex-col animate-in zoom-in duration-300 border border-white/20">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20 bg-amber-500`}>
              <ClipboardList size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{survey.title}</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(survey.status)}`}>
                  {survey.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-300" /> {survey.createdAt}</span>
                <span className="flex items-center gap-1.5"><Target size={14} className="text-slate-300" /> {survey.targetRegion}</span>
                <span className="flex items-center gap-1.5"><Info size={14} className="text-slate-300" /> {survey.type}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-all hover:rotate-90">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Description Section */}
          <section>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <FileText size={14} /> Objetivo da Pesquisa
            </h4>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 leading-relaxed">
              "{survey.description || 'Nenhuma descrição detalhada fornecida para esta pesquisa.'}"
            </div>
          </section>

          {/* Metrics Summary */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Total Respostas</p>
                <p className="text-xl font-black text-slate-800">{survey.responsesCount.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Tempo Médio</p>
                <p className="text-xl font-black text-slate-800">4m 12s</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Taxa de Conclusão</p>
                <p className="text-xl font-black text-slate-800">92%</p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Questionnaire Detail */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <LayoutList size={14} /> Questionário Aplicado
              </h4>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{survey.questions.length} Pergunta(s)</span>
            </div>
            
            <div className="space-y-4">
              {survey.questions.map((q, idx) => (
                <div key={q.id} className="bg-white border border-slate-100 p-6 rounded-2xl hover:border-blue-200 transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-blue-500">{getQuestionIcon(q.type)}</span>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{q.type}</span>
                         {q.required && <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">• Obrigatória</span>}
                      </div>
                      <p className="font-bold text-slate-800 text-lg mb-4">{q.text}</p>
                      
                      {q.type === QuestionType.MULTIPLE_CHOICE && q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                          {q.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 font-medium">
                              <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      {q.type === QuestionType.YES_NO && (
                        <div className="flex gap-4 mt-2">
                          <div className="flex-1 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-center font-bold text-sm">Sim</div>
                          <div className="flex-1 p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-center font-bold text-sm">Não</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Result Mockup */}
          {survey.responsesCount > 0 && (
            <section className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl">
               <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <BarChart size={14} className="text-blue-400" /> Resultados Preliminares
              </h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase mb-2">
                    <span>Participação por Região</span>
                    <span className="text-blue-400">78% da Meta</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[78%] rounded-full"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Principal Interesse</p>
                    <p className="text-lg font-bold">Saúde Pública</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Humor Predominante</p>
                    <p className="text-lg font-bold">Esperançoso (64%)</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Download size={18} /> Exportar Completo
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Fechar
            </button>
            <button className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg transition-all active:scale-[0.98]">
              Gerar Relatório de BI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComparativeReportModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const latestPoll = MOCK_POLLS[MOCK_POLLS.length - 1];
  const previousPoll = MOCK_POLLS[MOCK_POLLS.length - 2];
  
  const deltaA = latestPoll.candidateA - previousPoll.candidateA;
  const deltaUndecided = latestPoll.undecided - previousPoll.undecided;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative flex flex-col animate-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Relatório Comparativo de Intenção</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Análise Evolutiva • Ciclo Eleitoral 2024</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Crescimento Candidato A</p>
              <div className="flex items-end gap-2">
                <h4 className="text-3xl font-black text-slate-800">{latestPoll.candidateA}%</h4>
                <div className={`flex items-center text-xs font-bold mb-1 ${deltaA >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {deltaA >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {Math.abs(deltaA)}pp
                </div>
              </div>
            </div>
            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Taxa de Indecisos</p>
              <div className="flex items-end gap-2">
                <h4 className="text-3xl font-black text-slate-800">{latestPoll.undecided}%</h4>
                <div className={`flex items-center text-xs font-bold mb-1 ${deltaUndecided <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {deltaUndecided <= 0 ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                  {Math.abs(deltaUndecided)}pp
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Amostragem Acumulada</p>
              <div className="flex items-end gap-2">
                <h4 className="text-3xl font-black text-slate-800">
                  {MOCK_POLLS.reduce((acc, p) => acc + p.sampleSize, 0).toLocaleString()}
                </h4>
                <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Entrevistas</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-black text-slate-800 flex items-center gap-2">
                <BarChart size={20} className="text-blue-600" />
                Tendência Histórica de Voto
              </h4>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Candidato A</span>
                <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase">Candidato B</span>
                <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase">Indecisos</span>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_POLLS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { month: 'short' })}
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="candidateA" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6, stroke: '#fff' }} 
                    activeDot={{ r: 8, strokeWidth: 0 }}
                    name="Nosso Candidato" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="candidateB" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    strokeDasharray="5 5"
                    dot={{ fill: '#ef4444', r: 4 }} 
                    name="Oponente Principal" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="undecided" 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    dot={{ fill: '#f59e0b', r: 4 }} 
                    name="Indecisos" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-50 bg-slate-50/50">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Detalhamento por Período</h4>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-tighter border-b border-slate-50">
                  <th className="px-6 py-4">Data da Pesquisa</th>
                  <th className="px-6 py-4">Região</th>
                  <th className="px-6 py-4">Nosso (A)</th>
                  <th className="px-6 py-4">Oponente (B)</th>
                  <th className="px-6 py-4">Indecisos</th>
                  <th className="px-6 py-4">Amostra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_POLLS.map((poll) => (
                  <tr key={poll.id} className="text-sm hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-2">
                      <Calendar size={14} className="text-slate-300" />
                      {new Date(poll.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{poll.region}</td>
                    <td className="px-6 py-4 font-black text-blue-600">{poll.candidateA}%</td>
                    <td className="px-6 py-4 font-black text-rose-600">{poll.candidateB}%</td>
                    <td className="px-6 py-4 font-black text-amber-600">{poll.undecided}%</td>
                    <td className="px-6 py-4 text-slate-400 text-xs font-bold">{poll.sampleSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
          <button 
            onClick={() => window.print()}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Exportar PDF
          </button>
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
          >
            Fechar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

const SurveyBuilderModal: React.FC<{ onClose: () => void; onSave: (survey: any) => void }> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<SurveyType>(SurveyType.OPINION);
  const [region, setRegion] = useState('');
  const [questions, setQuestions] = useState<Partial<Question>[]>([]);

  const addQuestion = () => {
    const newQuestion: Partial<Question> = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      type: QuestionType.TEXT,
      required: true,
      options: []
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const addOption = (qId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: [...(q.options || []), ''] };
      }
      return q;
    }));
  };

  const updateOption = (qId: string, optIdx: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOpts = [...(q.options || [])];
        newOpts[optIdx] = value;
        return { ...q, options: newOpts };
      }
      return q;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, type, targetRegion: region, questions, status: 'RASCUNHO', responsesCount: 0 });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative flex flex-col animate-in zoom-in duration-300"
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <ClipboardList size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Criar Nova Pesquisa</h3>
              <p className="text-xs text-slate-400">Configure o questionário e defina os critérios</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Título da Pesquisa</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="Ex: Intenção de Voto Novembro"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Descrição / Objetivo</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 h-20 resize-none"
                  placeholder="Descreva a finalidade desta pesquisa..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tipo de Pesquisa</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500/20"
                  value={type}
                  onChange={e => setType(e.target.value as SurveyType)}
                >
                  <option value={SurveyType.OPINION}>Pesquisa de Opinião</option>
                  <option value={SurveyType.VOTING_INTENTION}>Intenção de Voto</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Região Alvo</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="Ex: Bairro Centro ou Geral"
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <LayoutList size={18} className="text-amber-500" />
                Estrutura do Questionário
              </h4>
              <button 
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 text-xs font-bold text-amber-600 hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors border border-amber-200"
              >
                <Plus size={16} /> Adicionar Pergunta
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
                <HelpCircle size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-500 font-medium">Nenhuma pergunta adicionada.</p>
                <p className="text-xs text-slate-400">Clique no botão acima para começar a construir seu questionário.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 animate-in slide-in-from-left-2 duration-300">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="md:col-span-8">
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Pergunta {index + 1}</label>
                            <input 
                              required
                              type="text" 
                              className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
                              placeholder="Digite o texto da pergunta..."
                              value={q.text}
                              onChange={e => updateQuestion(q.id!, 'text', e.target.value)}
                            />
                          </div>
                          <div className="md:col-span-4">
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Tipo de Resposta</label>
                            <select 
                              className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
                              value={q.type}
                              onChange={e => updateQuestion(q.id!, 'type', e.target.value as QuestionType)}
                            >
                              <option value={QuestionType.TEXT}>Texto Aberto</option>
                              <option value={QuestionType.YES_NO}>Sim ou Não</option>
                              <option value={QuestionType.MULTIPLE_CHOICE}>Múltipla Escolha</option>
                              <option value={QuestionType.NUMERIC}>Numérico</option>
                            </select>
                          </div>
                        </div>

                        {q.type === QuestionType.MULTIPLE_CHOICE && (
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                              <LayoutList size={12} /> Opções da Pergunta
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options?.map((opt, optIdx) => (
                                <div key={optIdx} className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full border border-slate-300 bg-white"></div>
                                  <input 
                                    type="text" 
                                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-amber-500"
                                    placeholder={`Opção ${optIdx + 1}`}
                                    value={opt}
                                    onChange={e => updateOption(q.id!, optIdx, e.target.value)}
                                  />
                                </div>
                              ))}
                              <button 
                                type="button"
                                onClick={() => addOption(q.id!)}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 hover:underline px-2"
                              >
                                <Plus size={12} /> Adicionar Opção
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <button 
                        type="button"
                        onClick={() => removeQuestion(q.id!)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg transition-all"
          >
            <Save size={18} /> Salvar como Rascunho
          </button>
        </div>
      </form>
    </div>
  );
};

const Polls: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>(MOCK_SURVEYS);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [activeTab, setActiveTab] = useState<'ATIVAS' | 'RASCUNHOS' | 'FINALIZADAS'>('ATIVAS');
  const { showToast } = useToast();

  const filteredSurveys = useMemo(() => {
    const statusMap: Record<string, string> = {
      'ATIVAS': 'ATIVA',
      'RASCUNHOS': 'RASCUNHO',
      'FINALIZADAS': 'FINALIZADA'
    };
    const targetStatus = statusMap[activeTab];
    return surveys.filter(s => s.status === targetStatus);
  }, [surveys, activeTab]);

  const handleSaveSurvey = (newSurvey: any) => {
    const survey: Survey = {
      ...newSurvey,
      id: `S${surveys.length + 1}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSurveys([survey, ...surveys]);
    setIsBuilderOpen(false);
    showToast(`Pesquisa "${survey.title}" salva como rascunho!`, 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVA': return 'bg-emerald-100 text-emerald-700';
      case 'RASCUNHO': return 'bg-slate-100 text-slate-600';
      case 'FINALIZADA': return 'bg-rose-100 text-rose-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Módulo de Pesquisas</h1>
            <p className="text-sm text-slate-500 font-medium">Inteligência de campo e monitoramento de opinião</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-black text-xs shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <TrendingUp size={18} /> RELATÓRIO COMPARATIVO
            </button>
            <button 
              onClick={() => setIsBuilderOpen(true)}
              className="flex items-center gap-2 bg-amber-500 text-white px-5 py-3 rounded-2xl font-black text-xs shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={18} /> CRIAR QUESTIONÁRIO
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-around">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Total Respostas</p>
            <p className="text-xl font-black text-slate-800">1.345</p>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Pesquisas Ativas</p>
            <p className="text-xl font-black text-emerald-600">3</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-1 bg-slate-200/50 rounded-xl w-fit">
        {['ATIVAS', 'RASCUNHOS', 'FINALIZADAS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${
              activeTab === tab 
              ? 'bg-white text-slate-800 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredSurveys.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSurveys.map((survey) => (
            <div 
              key={survey.id} 
              onClick={() => setSelectedSurvey(survey)}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="p-6 flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(survey.status)}`}>
                    {survey.status}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {survey.type}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-lg font-black text-slate-800 group-hover:text-amber-600 transition-colors tracking-tight">{survey.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{survey.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none tracking-tighter">Questões</p>
                      <p className="text-sm font-bold text-slate-700">{survey.questions.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none tracking-tighter">Respostas</p>
                      <p className="text-sm font-bold text-slate-700">{survey.responsesCount}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  <div className="flex items-center gap-1.5">
                    <Target size={12} className="text-slate-300" />
                    Região: {survey.targetRegion}
                  </div>
                  <div>Criada em {survey.createdAt}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast('Abrindo configurações da pesquisa...', 'info');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <Settings size={14} /> Configurar
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSurvey(survey);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
                >
                  <Eye size={14} /> Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-20 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
            <Search size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Nenhuma pesquisa encontrada</h3>
          <p className="text-sm text-slate-500 max-w-xs mt-2">
            Não existem registros com o status <span className="font-bold text-slate-700">"{activeTab}"</span> no momento.
          </p>
          <button 
            onClick={() => setIsBuilderOpen(true)}
            className="mt-6 text-amber-600 font-bold text-sm flex items-center gap-2 hover:underline"
          >
            <Plus size={16} /> Começar uma nova pesquisa
          </button>
        </div>
      )}

      {isBuilderOpen && (
        <SurveyBuilderModal 
          onClose={() => setIsBuilderOpen(false)} 
          onSave={handleSaveSurvey} 
        />
      )}

      {isReportOpen && (
        <ComparativeReportModal 
          onClose={() => setIsReportOpen(false)} 
        />
      )}

      {selectedSurvey && (
        <SurveyDetailModal 
          survey={selectedSurvey} 
          onClose={() => setSelectedSurvey(null)} 
        />
      )}
    </div>
  );
};

export default Polls;
