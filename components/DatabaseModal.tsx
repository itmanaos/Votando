import React, { useState, useRef } from 'react';
import { 
  Database, Trash2, RefreshCw, Download, Upload, ShieldAlert, 
  CheckCircle2, AlertTriangle, X, HardDrive, FileJson, Sparkles, 
  Users, CalendarDays, UsersRound, ClipboardList, Vote, ArrowRight,
  ShieldCheck, Info, Check
} from 'lucide-react';
import { useDatabase } from './DatabaseContext';
import { useAuth } from './AuthContext';
import { useToast } from './Toast';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const { 
    voters, meetings, teams, surveys, polls, ballotReports,
    clearDatabase, clearTable, restoreDemoData, 
    exportDatabaseJSON, importDatabaseJSON, dbStats, isDatabaseEmpty 
  } = useDatabase();
  const { isGlobalAdmin, accessLogs } = useAuth();
  const { addToast } = useToast();

  const [isConfirmWipeOpen, setIsConfirmWipeOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExecuteWipe = () => {
    if (confirmInput.trim().toUpperCase() !== 'LIMPAR') {
      addToast({
        title: 'Confirmação Incorreta',
        message: 'Digite a palavra LIMPAR para confirmar a exclusão permanente dos dados.',
        type: 'error'
      });
      return;
    }

    clearDatabase();
    setIsConfirmWipeOpen(false);
    setConfirmInput('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDatabaseJSON(content);
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/10 text-rose-600 flex items-center justify-center border border-rose-200 shadow-sm">
              <Database size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 leading-tight">
                  Gerenciamento do Banco de Dados
                </h2>
                {isDatabaseEmpty ? (
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={10} />
                    Banco Limpo
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full uppercase">
                    Com Dados Ativos
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Limpeza, redefinição para novo ciclo de campanha e backup do comitê
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/40">
          
          {/* Main Action Banner */}
          <div className="bg-gradient-to-br from-rose-900 via-slate-900 to-slate-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-black rounded-full uppercase flex items-center gap-1">
                    <ShieldAlert size={10} />
                    Operação Destrutiva
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Limpar Todos os Dados do Banco
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Apaga instantaneamente todos os eleitores cadastrados, reuniões, orçamentos, metas de equipes, pesquisas e boletins, deixando o sistema 100% zerado.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsConfirmWipeOpen(true)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer"
              >
                <Trash2 size={15} />
                <span>LIMPAR BANCO COMPLETO</span>
              </button>
            </div>
          </div>

          {/* Table Breakdown Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <HardDrive size={14} className="text-slate-400" />
                Registros por Módulo da Campanha
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">
                Última sincronização: {dbStats.lastUpdated}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Eleitores */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900">Eleitores & Contatos</h5>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {voters.length} {voters.length === 1 ? 'registro' : 'registros'}
                    </p>
                  </div>
                </div>
                {voters.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearTable('voters')}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Limpar apenas Eleitores"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              {/* Reuniões */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CalendarDays size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900">Reuniões & Eventos</h5>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {meetings.length} {meetings.length === 1 ? 'evento' : 'eventos'}
                    </p>
                  </div>
                </div>
                {meetings.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearTable('meetings')}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Limpar apenas Reuniões"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              {/* Equipes */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <UsersRound size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900">Equipes & Lideranças</h5>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {teams.length} {teams.length === 1 ? 'membro' : 'membros'}
                    </p>
                  </div>
                </div>
                {teams.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearTable('teams')}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Limpar apenas Equipes"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              {/* Pesquisas */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <ClipboardList size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900">Pesquisas & Amostragens</h5>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {surveys.length} questionários • {polls.length} pesquisas
                    </p>
                  </div>
                </div>
                {(surveys.length > 0 || polls.length > 0) && (
                  <button
                    type="button"
                    onClick={() => {
                      clearTable('surveys');
                      clearTable('polls');
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Limpar Pesquisas"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Backup, Restore & Demo Tools */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileJson size={15} className="text-blue-600" />
              <span>Ferramentas de Backup & Demonstração</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Export Backup */}
              <button
                type="button"
                onClick={exportDatabaseJSON}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-left flex flex-col justify-between group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Download size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-900 mb-0.5">Exportar Backup JSON</h5>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Baixe um arquivo seguro com todos os dados da campanha.
                  </p>
                </div>
              </button>

              {/* Import Backup */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-2xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 transition-all text-left flex flex-col justify-between group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Upload size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-900 mb-0.5">Restaurar de Arquivo</h5>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Carregue um arquivo JSON de backup previamente exportado.
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
              </button>

              {/* Demo Data Seed */}
              <button
                type="button"
                onClick={restoreDemoData}
                className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all text-left flex flex-col justify-between group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-900 mb-0.5">Carregar Dados Demo</h5>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Popule com exemplos realistas para demonstrações e testes.
                  </p>
                </div>
              </button>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info size={14} />
            <span>As alterações são salvas localmente de forma segura.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
          >
            Fechar
          </button>
        </div>

      </div>

      {/* Confirmation Sub-Modal */}
      {isConfirmWipeOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4 animate-in zoom-in duration-200">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-slate-900">
                Confirmar Limpeza Total do Banco?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Esta ação apagará todos os eleitores, atas de reunião, cadastros de lideranças e pesquisas. Não é possível desfazer após confirmar.
              </p>
            </div>

            <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <label className="text-[10px] font-black text-slate-600 uppercase block text-center">
                Para confirmar, digite <b>LIMPAR</b> abaixo:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="LIMPAR"
                className="w-full text-center py-2 text-xs font-black tracking-widest bg-white border border-slate-200 rounded-xl outline-none focus:border-rose-500 uppercase"
                autoFocus
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsConfirmWipeOpen(false);
                  setConfirmInput('');
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleExecuteWipe}
                disabled={confirmInput.trim().toUpperCase() !== 'LIMPAR'}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Sim, Limpar Tudo</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
