import React, { useState, useMemo } from 'react';
import { 
  UsersRound, 
  Target, 
  TrendingUp, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  X, 
  UserPlus, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Save,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  Building2,
  Users,
  Calculator,
  Download,
  FileSpreadsheet,
  Layers,
  Sparkles,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { TeamMember, UserRole } from '../types';
import { useToast } from './Toast';
import { useDatabase } from './DatabaseContext';

// ==========================================
// MODAL: CRIAR / ADICIONAR LIDERANÇA OU INTEGRANTE
// ==========================================
interface CreateMemberModalProps {
  onClose: () => void;
  onSave: (memberData: Omit<TeamMember, 'id'>) => void;
  isAudienceAccountingMode?: boolean;
}

const CreateMemberModal: React.FC<CreateMemberModalProps> = ({ onClose, onSave, isAudienceAccountingMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: UserRole.LEADER,
    territory: '',
    goals: '60',
    achieved: '0',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name.trim(),
      role: formData.role,
      territory: formData.territory.trim(),
      goals: parseInt(formData.goals, 10) || 0,
      achieved: parseInt(formData.achieved, 10) || 0,
      phone: formData.phone.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-200"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg ${
              isAudienceAccountingMode ? 'bg-blue-600 shadow-blue-500/20' : 'bg-purple-600 shadow-purple-500/20'
            }`}>
              {isAudienceAccountingMode ? <Calculator size={20} /> : <UserPlus size={20} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {isAudienceAccountingMode ? 'Nova Liderança para Contabilidade de Público' : 'Adicionar Integrante à Equipe'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAudienceAccountingMode 
                  ? 'Cadastre a liderança ou entidade responsável por metas de mobilização' 
                  : 'Vincule um novo colaborador à equipe de campanha'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase ml-1">
              Nome da Liderança / Organização ou Liga Desportiva
            </label>
            <input 
              required
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              placeholder="Ex: Liga Desportiva da Compensa ou Prof. Marcos Lima"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">Função / Papel</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <option value={UserRole.LEADER}>Líder Comunitário / Liga</option>
                <option value={UserRole.COORDINATOR}>Coordenador de Região</option>
                <option value={UserRole.FISCAL}>Fiscal / Ponto Focal</option>
                <option value={UserRole.SUPPORTER}>Apoiador / Mobilizador</option>
                <option value={UserRole.ADMIN}>Administrador de Campanha</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">Telefone / WhatsApp</label>
              <input 
                required
                type="tel" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                placeholder="(92) 98888-0000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase ml-1">Bairro / Território de Atuação</label>
            <input 
              required
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              placeholder="Ex: Compensa / Zona Oeste"
              value={formData.territory}
              onChange={e => setFormData({ ...formData, territory: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">
                {isAudienceAccountingMode ? 'Meta de Público (Pessoas)' : 'Meta de Eleitores'}
              </label>
              <input 
                required
                type="number" 
                min="1"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                placeholder="Ex: 60"
                value={formData.goals}
                onChange={e => setFormData({ ...formData, goals: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">
                {isAudienceAccountingMode ? 'Público Confirmado / Presente' : 'Eleitores Captados'}
              </label>
              <input 
                required
                type="number" 
                min="0"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-emerald-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                placeholder="Ex: 0"
                value={formData.achieved}
                onChange={e => setFormData({ ...formData, achieved: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Save size={18} /> Confirmar Cadastro
          </button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// MODAL: EDITAR REGISTRO DE LIDERANÇA
// ==========================================
interface EditMemberModalProps {
  member: TeamMember;
  onClose: () => void;
  onUpdate: (id: string, updatedData: Partial<TeamMember>) => void;
  isAudienceAccountingMode?: boolean;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ member, onClose, onUpdate, isAudienceAccountingMode }) => {
  const [formData, setFormData] = useState({
    name: member.name,
    role: member.role,
    territory: member.territory,
    goals: member.goals.toString(),
    achieved: member.achieved.toString(),
    phone: member.phone
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(member.id, {
      name: formData.name.trim(),
      role: formData.role,
      territory: formData.territory.trim(),
      goals: parseInt(formData.goals, 10) || 0,
      achieved: parseInt(formData.achieved, 10) || 0,
      phone: formData.phone.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-200"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Pencil size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {isAudienceAccountingMode ? 'Editar Registro de Liderança' : 'Editar Integrante'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAudienceAccountingMode 
                  ? 'Modifique os dados da liderança, território e contabilidade de público' 
                  : 'Atualize os dados e metas do colaborador'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase ml-1">
              Nome da Liderança / Organização
            </label>
            <input 
              required
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">Papel / Função</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <option value={UserRole.LEADER}>Líder Comunitário / Liga</option>
                <option value={UserRole.COORDINATOR}>Coordenador Regional</option>
                <option value={UserRole.FISCAL}>Fiscal de Votação</option>
                <option value={UserRole.SUPPORTER}>Apoiador / Mobilizador</option>
                <option value={UserRole.ADMIN}>Administrador</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">Telefone / WhatsApp</label>
              <input 
                required
                type="tel" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase ml-1">Território / Região de Atuação</label>
            <input 
              required
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              value={formData.territory}
              onChange={e => setFormData({ ...formData, territory: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">
                {isAudienceAccountingMode ? 'Meta de Público (Estimado)' : 'Meta de Eleitores'}
              </label>
              <input 
                required
                type="number" 
                min="1"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                value={formData.goals}
                onChange={e => setFormData({ ...formData, goals: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">
                {isAudienceAccountingMode ? 'Público Realmente Captado' : 'Eleitores Captados'}
              </label>
              <input 
                required
                type="number" 
                min="0"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-emerald-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                value={formData.achieved}
                onChange={e => setFormData({ ...formData, achieved: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Save size={18} /> Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// MODAL: ALTERAÇÃO RÁPIDA DE PÚBLICO / CONTABILIDADE
// ==========================================
interface QuickAdjustModalProps {
  member: TeamMember;
  onClose: () => void;
  onSave: (id: string, newAchieved: number, newGoal: number) => void;
}

const QuickAdjustModal: React.FC<QuickAdjustModalProps> = ({ member, onClose, onSave }) => {
  const [achieved, setAchieved] = useState<number>(member.achieved);
  const [goals, setGoals] = useState<number>(member.goals);

  const handleIncrement = (amount: number) => {
    setAchieved(prev => Math.max(0, prev + amount));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(member.id, achieved, goals);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-200"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Sliders size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Alterar Contabilidade</h3>
              <p className="text-xs text-slate-400">{member.name}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Público Confirmado / Realizado</span>
              <span className="text-2xl font-black text-emerald-700">{achieved} pax</span>
            </div>

            {/* Quick adjust buttons */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleIncrement(-10)}
                className="py-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-700 text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                -10
              </button>
              <button
                type="button"
                onClick={() => handleIncrement(-5)}
                className="py-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-700 text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => handleIncrement(5)}
                className="py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                +5
              </button>
              <button
                type="button"
                onClick={() => handleIncrement(10)}
                className="py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                +10
              </button>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold text-slate-700">Editar Manualmente Público Presente</label>
              <input 
                type="number"
                min="0"
                value={achieved}
                onChange={(e) => setAchieved(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-bold"
              />
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-xs font-bold text-slate-700">Meta Estipulada</label>
              <input 
                type="number"
                min="1"
                value={goals}
                onChange={(e) => setGoals(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-bold"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Check size={18} /> Salvar Alteração
          </button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// MODAL: EXCLUIR REGISTRO DE LIDERANÇA
// ==========================================
interface DeleteMemberModalProps {
  member: TeamMember;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isAudienceAccountingMode?: boolean;
}

const DeleteMemberModal: React.FC<DeleteMemberModalProps> = ({ member, onClose, onConfirm, isAudienceAccountingMode }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Trash2 size={32} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-slate-800">
              {isAudienceAccountingMode ? 'Excluir Registro de Liderança?' : 'Excluir Integrante da Equipe?'}
            </h3>
            <p className="text-sm text-slate-500">
              {isAudienceAccountingMode 
                ? 'Deseja remover esta liderança da contabilidade de público da campanha?' 
                : 'Tem certeza que deseja remover este integrante da equipe de campanha?'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left space-y-2.5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                member.role === UserRole.LEADER ? 'bg-purple-100 text-purple-700' : 
                member.role === UserRole.COORDINATOR ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-800 truncate">{member.name}</div>
                <div className="text-xs text-slate-400">{member.territory} • {member.phone}</div>
              </div>
            </div>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-200/60 flex justify-between">
              <span>Meta estipulada: <strong>{member.goals} pessoas</strong></span>
              <span>Captados/Presentes: <strong className="text-emerald-600">{member.achieved}</strong></span>
            </div>
          </div>

          <p className="text-xs text-rose-600 font-semibold flex items-center justify-center gap-1.5 bg-rose-50 py-2 rounded-xl border border-rose-100">
            <AlertTriangle size={15} /> Esta ação é definitiva e removerá este registro do banco.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={() => onConfirm(member.id)}
            className="flex-[1.5] flex items-center justify-center gap-2 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 shadow-lg shadow-rose-500/20 transition-all"
          >
            <Trash2 size={18} /> Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MODAL: LIMPAR TODA A EQUIPE / LIDERANÇAS
// ==========================================
interface ClearAllTeamsModalProps {
  count: number;
  onClose: () => void;
  onConfirm: () => void;
}

const ClearAllTeamsModal: React.FC<ClearAllTeamsModalProps> = ({ count, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Trash2 size={32} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-slate-800">Limpar Todos os Registros?</h3>
            <p className="text-sm text-slate-500">
              Tem certeza que deseja remover todos os <strong>{count}</strong> registros de lideranças e equipes cadastrados?
            </p>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200/70 rounded-2xl text-amber-800 text-xs text-left space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle size={15} className="text-amber-600 shrink-0" /> Atenção à Base
            </div>
            <p>Todos os dados de metas de público, contatos e territórios das lideranças serão apagados do armazenamento.</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={onConfirm}
            className="flex-[1.5] flex items-center justify-center gap-2 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 shadow-lg shadow-rose-500/20 transition-all"
          >
            <Trash2 size={18} /> Limpar Tudo
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL: GESTÃO DE EQUIPE
// ==========================================
export const Teams: React.FC = () => {
  const { teams: members, addTeamMember, updateTeamMember, deleteTeamMember, clearTeams, restoreDemoData } = useDatabase();
  const { showToast } = useToast();

  // Tab State
  const [activeTab, setActiveTab] = useState<'audience_accounting' | 'members'>('audience_accounting');

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [adjustingMember, setAdjustingMember] = useState<TeamMember | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterPerformance, setFilterPerformance] = useState<string>('ALL');

  // Audience Accounting Statistics
  const accountingStats = useMemo(() => {
    const totalGoals = members.reduce((acc, m) => acc + (m.goals || 0), 0);
    const totalAchieved = members.reduce((acc, m) => acc + (m.achieved || 0), 0);
    const avgQuorum = totalGoals > 0 ? (totalAchieved / totalGoals) * 100 : 0;
    
    // Top mobilizing leader
    const sorted = [...members].sort((a, b) => (b.achieved || 0) - (a.achieved || 0));
    const topLeader = sorted[0] || null;

    const leadersCount = members.filter(m => m.role === UserRole.LEADER || m.role === UserRole.COORDINATOR).length;
    const goalsReachedCount = members.filter(m => m.goals > 0 && m.achieved >= m.goals).length;

    return {
      totalMembers: members.length,
      leadersCount,
      totalGoals,
      totalAchieved,
      avgQuorum: avgQuorum.toFixed(1),
      goalsReachedCount,
      topLeader
    };
  }, [members]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = !q || 
                            m.name.toLowerCase().includes(q) ||
                            m.territory.toLowerCase().includes(q) ||
                            m.phone.toLowerCase().includes(q) ||
                            m.id.toLowerCase().includes(q);
      
      const matchesRole = filterRole === 'ALL' || m.role === filterRole;

      const percent = m.goals > 0 ? (m.achieved / m.goals) * 100 : 0;
      let matchesPerformance = true;
      if (filterPerformance === 'SUPERIOR') matchesPerformance = percent >= 100;
      else if (filterPerformance === 'HIGH') matchesPerformance = percent >= 75 && percent < 100;
      else if (filterPerformance === 'MEDIUM') matchesPerformance = percent >= 40 && percent < 75;
      else if (filterPerformance === 'LOW') matchesPerformance = percent < 40;

      return matchesSearch && matchesRole && matchesPerformance;
    });
  }, [members, searchTerm, filterRole, filterPerformance]);

  // Handlers
  const handleCreateMember = (data: Omit<TeamMember, 'id'>) => {
    const created = addTeamMember(data);
    setIsCreateModalOpen(false);
    showToast(`Registro de "${created.name}" cadastrado com sucesso!`, 'success');
  };

  const handleUpdateMember = (id: string, updatedData: Partial<TeamMember>) => {
    updateTeamMember(id, updatedData);
    setEditingMember(null);
    showToast(`Registro de liderança atualizado com sucesso!`, 'success');
  };

  const handleQuickAdjust = (id: string, newAchieved: number, newGoal: number) => {
    updateTeamMember(id, { achieved: newAchieved, goals: newGoal });
    setAdjustingMember(null);
    showToast(`Contabilidade de público alterada com sucesso!`, 'success');
  };

  const handleDeleteMember = (id: string) => {
    const memberName = deletingMember?.name || 'Registro';
    deleteTeamMember(id);
    setDeletingMember(null);
    showToast(`Registro de "${memberName}" excluído com sucesso.`, 'info');
  };

  const handleClearAllConfirm = () => {
    clearTeams();
    setIsClearAllModalOpen(false);
    showToast('Todos os registros de equipe e liderança foram limpos.', 'info');
  };

  const handleWhatsApp = (phone: string, name: string, achieved: number, goal: number) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone) {
      const msg = `Olá ${name}! Passando para acompanhar a contabilidade de público da sua liderança: temos ${achieved} pessoas confirmadas da meta de ${goal}. Conte com o nosso apoio da coordenação!`;
      window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    } else {
      showToast(`Telefone de ${name} não possui formato válido.`, 'warning');
    }
  };

  const handleExportCSV = () => {
    if (members.length === 0) {
      showToast('Não há registros para exportar.', 'warning');
      return;
    }

    const headers = ['ID', 'Nome da Liderança', 'Papel', 'Território', 'Telefone', 'Meta de Público', 'Público Captado', 'Quórum (%)'];
    const rows = members.map(m => {
      const percent = m.goals > 0 ? ((m.achieved / m.goals) * 100).toFixed(1) : '0';
      return [
        `"${m.id}"`,
        `"${m.name.replace(/"/g, '""')}"`,
        `"${m.role}"`,
        `"${m.territory.replace(/"/g, '""')}"`,
        `"${m.phone}"`,
        m.goals,
        m.achieved,
        `"${percent}%"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contabilidade_publico_liderancas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Boletim de contabilidade exportado em CSV com sucesso!', 'success');
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case UserRole.COORDINATOR:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case UserRole.LEADER:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case UserRole.FISCAL:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case UserRole.ADMIN:
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Top Banner & Module Navigation Tabs */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black rounded-full uppercase flex items-center gap-1.5">
              <Building2 size={13} />
              Gestão de Equipe & Lideranças
            </span>
            <span className="text-xs text-slate-400 font-medium">• Ligas Desportivas & Mobilização</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestão de Equipe & Contabilidade de Público
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Acompanhe o headcount de mobilização de cada liderança, registre presenças, ajuste metas e edite ou exclua registros com auditoria em tempo real.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('audience_accounting')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'audience_accounting'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Calculator size={16} />
            <span>Contabilidade de Público</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'audience_accounting' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {accountingStats.totalAchieved} pax
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'members'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <UsersRound size={16} />
            <span>Quadro de Integrantes</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'members' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {accountingStats.totalMembers}
            </span>
          </button>
        </div>
      </div>

      {/* Top Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Lideranças Cadastradas */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Lideranças Ativas</p>
            <h3 className="text-2xl font-black text-slate-800">{accountingStats.leadersCount}</h3>
            <p className="text-[11px] text-slate-500 font-medium">De {accountingStats.totalMembers} membros totais</p>
          </div>
          <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
            <ShieldCheck size={24} />
          </div>
        </div>

        {/* Card 2: Meta Geral de Público */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Meta Geral de Público</p>
            <h3 className="text-2xl font-black text-slate-800">{accountingStats.totalGoals.toLocaleString('pt-BR')}</h3>
            <p className="text-[11px] text-slate-500 font-medium">Capacidade total de mobilização</p>
          </div>
          <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
            <Target size={24} />
          </div>
        </div>

        {/* Card 3: Público Confirmado / Realizado */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Público Confirmado</p>
            <h3 className="text-2xl font-black text-emerald-600">{accountingStats.totalAchieved.toLocaleString('pt-BR')}</h3>
            <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 size={12} /> {accountingStats.goalsReachedCount} metas atingidas
            </p>
          </div>
          <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
            <UserCheck size={24} />
          </div>
        </div>

        {/* Card 4: Quórum Médio / Conversão */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Quórum Médio</p>
            <h3 className="text-2xl font-black text-blue-600">{accountingStats.avgQuorum}%</h3>
            <p className="text-[11px] text-slate-500 font-medium">Conversão das lideranças</p>
          </div>
          <div className="bg-amber-50 text-amber-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: GESTÃO DE CONTABILIDADE DE PÚBLICO                                 */}
      {/* ========================================================================= */}
      {activeTab === 'audience_accounting' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden space-y-0">
          
          {/* Header & Action Bar */}
          <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-md uppercase tracking-wider">
                  Módulo Operacional
                </span>
                <span className="text-xs text-slate-400 font-medium">Contabilidade em Tempo Real</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
                <Calculator className="text-blue-600" size={20} />
                Contabilidade de Público por Liderança
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Edite dados, altere quantidades de público confirmado ou exclua registros com validação imediata.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-sm"
                title="Exportar boletim de contabilidade em planilha CSV"
              >
                <Download size={15} />
                <span>Exportar CSV</span>
              </button>

              {members.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsClearAllModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all"
                  title="Limpar todos os registros de liderança"
                >
                  <Trash2 size={15} />
                  <span>Limpar Registros</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
              >
                <Plus size={16} />
                <span>Nova Liderança</span>
              </button>
            </div>
          </div>

          {/* Filters Ribbon */}
          <div className="p-4 border-b border-slate-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por liderança, liga desportiva, bairro ou telefone..." 
                className="pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500 w-full transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <Filter size={13} className="text-slate-400" />
                <select 
                  value={filterRole}
                  onChange={e => setFilterRole(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-2"
                >
                  <option value="ALL">Todas as Funções</option>
                  <option value={UserRole.LEADER}>Líderes de Liga</option>
                  <option value={UserRole.COORDINATOR}>Coordenadores</option>
                  <option value={UserRole.FISCAL}>Fiscais</option>
                  <option value={UserRole.SUPPORTER}>Mobilizadores</option>
                  <option value={UserRole.ADMIN}>Administradores</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <Sliders size={13} className="text-slate-400" />
                <select 
                  value={filterPerformance}
                  onChange={e => setFilterPerformance(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-2"
                >
                  <option value="ALL">Todos os Desempenhos</option>
                  <option value="SUPERIOR">Meta Batida (≥ 100%)</option>
                  <option value="HIGH">Alta Mobilização (75% - 99%)</option>
                  <option value="MEDIUM">Mobilização Média (40% - 74%)</option>
                  <option value="LOW">Início de Mobilização (&lt; 40%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table of Leaders & Audience Accounting */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/90 text-slate-500 text-[10px] uppercase tracking-widest font-black border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Liderança / Entidade</th>
                  <th className="px-6 py-4">Território / Papel</th>
                  <th className="px-6 py-4">Contabilidade de Público</th>
                  <th className="px-6 py-4">Quórum & Progresso</th>
                  <th className="px-6 py-4 text-center">Ações no Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => {
                    const percent = member.goals > 0 ? (member.achieved / member.goals) * 100 : 0;
                    const diff = member.goals - member.achieved;

                    return (
                      <tr key={member.id} className="hover:bg-slate-50/80 transition-colors group">
                        
                        {/* Liderança Name & Contact */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${
                              member.role === UserRole.LEADER ? 'bg-purple-100 text-purple-800' :
                              member.role === UserRole.COORDINATOR ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                <span>{member.name}</span>
                                {percent >= 100 && (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-full uppercase">
                                    Meta Atingida
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Phone size={11} /> {member.phone || 'Sem telefone'}
                                </span>
                                <span>• ID: {member.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Território & Papel */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1 w-fit px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getRoleBadgeStyle(member.role)}`}>
                              {member.role === UserRole.LEADER && <Award size={11} />}
                              {member.role === UserRole.COORDINATOR && <ShieldCheck size={11} />}
                              {member.role}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                              <MapPin size={13} className="text-slate-400 shrink-0" />
                              <span>{member.territory}</span>
                            </div>
                          </div>
                        </td>

                        {/* Contabilidade de Público & Ajuste Rápido */}
                        <td className="px-6 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-black text-emerald-700">{member.achieved}</span>
                              <span className="text-xs text-slate-400 font-medium">de {member.goals} pessoas</span>
                            </div>
                            
                            {/* Inline quick adjustments */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                title="Diminuir 5 pessoas"
                                onClick={() => handleQuickAdjust(member.id, Math.max(0, member.achieved - 5), member.goals)}
                                className="px-2 py-0.5 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 text-[10px] font-bold rounded-md transition-colors"
                              >
                                -5
                              </button>
                              <button
                                type="button"
                                title="Adicionar 5 pessoas"
                                onClick={() => handleQuickAdjust(member.id, member.achieved + 5, member.goals)}
                                className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 text-[10px] font-bold rounded-md transition-colors"
                              >
                                +5
                              </button>
                              <button
                                type="button"
                                title="Adicionar 10 pessoas"
                                onClick={() => handleQuickAdjust(member.id, member.achieved + 10, member.goals)}
                                className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 text-[10px] font-bold rounded-md transition-colors"
                              >
                                +10
                              </button>
                              <button
                                type="button"
                                title="Ajuste numérico detalhado"
                                onClick={() => setAdjustingMember(member)}
                                className="p-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors text-[10px]"
                              >
                                <Sliders size={11} />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Quórum & Progress Bar */}
                        <td className="px-6 py-4">
                          <div className="w-full max-w-[140px] space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase">
                              <span className="font-black text-slate-800">{percent.toFixed(0)}%</span>
                              <span className="text-[9px] text-slate-400">
                                {diff <= 0 ? 'Concluída' : `Faltam ${diff}`}
                              </span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                              <div 
                                className={`h-full rounded-full transition-all duration-700 ${
                                  percent >= 100 ? 'bg-emerald-500' :
                                  percent >= 75 ? 'bg-emerald-400' : 
                                  percent >= 40 ? 'bg-blue-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.min(percent, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Actions (Edição, Alteração, Exclusão e WhatsApp) */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* WhatsApp Fast Dispatch */}
                            <button 
                              type="button"
                              title={`Enviar WhatsApp para ${member.name}`}
                              onClick={() => handleWhatsApp(member.phone, member.name, member.achieved, member.goals)}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                            >
                              <MessageSquare size={16} />
                            </button>

                            {/* Alteração Rápida */}
                            <button 
                              type="button"
                              title={`Alterar contabilidade de ${member.name}`}
                              onClick={() => setAdjustingMember(member)}
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                            >
                              <Sliders size={16} />
                            </button>

                            {/* Edição Completa do Registro */}
                            <button 
                              type="button"
                              title={`Editar registro de ${member.name}`}
                              onClick={() => setEditingMember(member)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            >
                              <Pencil size={16} />
                            </button>

                            {/* Exclusão do Registro */}
                            <button 
                              type="button"
                              title={`Excluir ${member.name}`}
                              onClick={() => setDeletingMember(member)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                          <Calculator size={26} />
                        </div>
                        <h4 className="font-bold text-slate-700 text-base">Nenhuma liderança encontrada</h4>
                        <p className="text-xs text-slate-400">
                          {searchTerm || filterRole !== 'ALL' || filterPerformance !== 'ALL'
                            ? 'Ajuste os filtros ou os termos de pesquisa digitados acima.' 
                            : 'Ainda não há lideranças cadastradas para contabilidade de público.'}
                        </p>
                        {searchTerm || filterRole !== 'ALL' || filterPerformance !== 'ALL' ? (
                          <button 
                            onClick={() => { setSearchTerm(''); setFilterRole('ALL'); setFilterPerformance('ALL'); }}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                          >
                            Limpar Filtros
                          </button>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                            <button 
                              onClick={() => setIsCreateModalOpen(true)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                            >
                              <Plus size={15} /> Cadastrar Nova Liderança
                            </button>
                            <button 
                              onClick={restoreDemoData}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                              <RefreshCw size={14} className="text-blue-600" /> Carregar Ligas de Demonstração
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Ribbon */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Exibindo {filteredMembers.length} de {members.length} lideranças
            </span>
            <div className="flex items-center gap-3">
              <span className="text-slate-600">
                Público Acumulado Filtrado: <strong className="text-emerald-700 font-black">{filteredMembers.reduce((acc, m) => acc + (m.achieved || 0), 0)} pessoas</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: QUADRO GERAL DE MEMBROS E METAS                                    */}
      {/* ========================================================================= */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header & Controls */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="text-purple-600" size={20} /> Quadro Geral da Equipe de Campanha
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Visão unificada de membros, papéis hierárquicos e metas territoriais</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar por nome, território ou telefone..." 
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 w-full sm:w-72 transition-all font-medium"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all"
              >
                <Plus size={16} /> Novo Integrante
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Integrante</th>
                  <th className="px-6 py-4">Papel / Território</th>
                  <th className="px-6 py-4">Meta de Eleitores</th>
                  <th className="px-6 py-4">Progresso</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => {
                    const percent = member.goals > 0 ? (member.achieved / member.goals) * 100 : 0;
                    return (
                      <tr key={member.id} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                              member.role === UserRole.LEADER ? 'bg-purple-100 text-purple-700' :
                              member.role === UserRole.COORDINATOR ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-sm group-hover:text-purple-700 transition-colors">
                                {member.name}
                              </div>
                              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                                <Phone size={11} /> {member.phone || 'Sem telefone'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1 w-fit px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getRoleBadgeStyle(member.role)}`}>
                              {member.role}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                              <MapPin size={12} className="text-slate-400" /> {member.territory}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-slate-800">{member.achieved}</span>
                            <span className="text-xs text-slate-400 font-medium">/ {member.goals}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="w-full max-w-[130px] space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase">
                              <span>{percent.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                              <div 
                                className={`h-full rounded-full transition-all duration-700 ${
                                  percent >= 100 ? 'bg-emerald-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${Math.min(percent, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              type="button"
                              title={`Editar ${member.name}`}
                              onClick={() => setEditingMember(member)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              type="button"
                              title={`Excluir ${member.name}`}
                              onClick={() => setDeletingMember(member)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs">
                      Nenhum integrante encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Criar */}
      {isCreateModalOpen && (
        <CreateMemberModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSave={handleCreateMember}
          isAudienceAccountingMode={activeTab === 'audience_accounting'}
        />
      )}

      {/* Modal: Editar Registro de Liderança */}
      {editingMember && (
        <EditMemberModal 
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onUpdate={handleUpdateMember}
          isAudienceAccountingMode={activeTab === 'audience_accounting'}
        />
      )}

      {/* Modal: Alteração Rápida de Público */}
      {adjustingMember && (
        <QuickAdjustModal
          member={adjustingMember}
          onClose={() => setAdjustingMember(null)}
          onSave={handleQuickAdjust}
        />
      )}

      {/* Modal: Excluir Registro */}
      {deletingMember && (
        <DeleteMemberModal 
          member={deletingMember}
          onClose={() => setDeletingMember(null)}
          onConfirm={handleDeleteMember}
          isAudienceAccountingMode={activeTab === 'audience_accounting'}
        />
      )}

      {/* Modal: Limpar Tudo */}
      {isClearAllModalOpen && (
        <ClearAllTeamsModal 
          count={members.length}
          onClose={() => setIsClearAllModalOpen(false)}
          onConfirm={handleClearAllConfirm}
        />
      )}
    </div>
  );
};

export default Teams;
