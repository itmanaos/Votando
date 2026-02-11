
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
  Search
} from 'lucide-react';
import { MOCK_SURVEYS } from '../constants';
import { Survey, SurveyType, Question, QuestionType } from '../types';

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
          {/* Informações Básicas */}
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

          {/* Construtor de Questões */}
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

                        {/* Opções para Múltipla Escolha */}
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
  const [activeTab, setActiveTab] = useState<'ATIVAS' | 'RASCUNHOS' | 'FINALIZADAS'>('ATIVAS');

  const filteredSurveys = useMemo(() => {
    // Mapeia o rótulo da aba para o status interno do dado
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
      {/* Header e Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Módulo de Pesquisas</h1>
            <p className="text-sm text-slate-500">Inteligência de campo e monitoramento de opinião</p>
          </div>
          <button 
            onClick={() => setIsBuilderOpen(true)}
            className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={20} /> CRIAR QUESTIONÁRIO
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-around">
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Respostas</p>
            <p className="text-xl font-black text-slate-800">1.345</p>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pesquisas Ativas</p>
            <p className="text-xl font-black text-emerald-600">3</p>
          </div>
        </div>
      </div>

      {/* Tabs de Filtro */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        {['ATIVAS', 'RASCUNHOS', 'FINALIZADAS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === tab 
              ? 'bg-white text-slate-800 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid de Pesquisas */}
      {filteredSurveys.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSurveys.map((survey) => (
            <div key={survey.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden flex flex-col">
              <div className="p-6 flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(survey.status)}`}>
                    {survey.status}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {survey.type}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-lg font-black text-slate-800 group-hover:text-amber-600 transition-colors">{survey.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{survey.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Questões</p>
                      <p className="text-sm font-bold text-slate-700">{survey.questions.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Respostas</p>
                      <p className="text-sm font-bold text-slate-700">{survey.responsesCount}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <div className="flex items-center gap-1.5">
                    <Target size={12} className="text-slate-300" />
                    Região: {survey.targetRegion}
                  </div>
                  <div>Criada em {survey.createdAt}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all">
                  <Settings size={14} /> Editar
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                  <BarChart size={14} /> Resultados
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
    </div>
  );
};

export default Polls;
