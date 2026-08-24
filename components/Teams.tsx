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
  Users
} from 'lucide-react';
import { TeamMember, UserRole } from '../types';
import { useToast } from './Toast';
import { useDatabase } from './DatabaseContext';

// ==========================================
// MODAL: CRIAR INTEGRANTE
// ==========================================
interface CreateMemberModalProps {
  onClose: () => void;
  onSave: (memberData: Omit<TeamMember, 'id'>) => void;
}

const CreateMemberModal: React.FC<CreateMemberModalProps> = ({ onClose, onSave }) => {
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-200"
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Adicionar Integrante</h3>
              <p className="text-xs text-slate-400">Vincule um novo colaborador à equipe de campanha</p>
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
            <label className="text-xs font-bold text-slate-600 uppercase ml-1">Nome Completo</label>
            <input 
              required
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              placeholder="Ex: Dra. Juliana Fernandes"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">Papel na Campanha</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <option value={UserRole.COORDINATOR}>Coordenador Regional</option>
                <option value={UserRole.LEADER}>Líder de Equipe</option>
                <option value={UserRole.FISCAL}>Fiscal de Votação</option>
                <option value={UserRole.SUPPORTER}>Apoiador / Multiplicador</option>
                <option value={UserRole.ADMIN}>Administrador</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">Telefone / WhatsApp</label>
              <input 
                required
                type="tel" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="(11) 98888-0000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">Território / Região</label>
              <input 
                required
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Ex: Zona Sul / Santo Amaro"
                value={formData.territory}
                onChange={e => setFormData({ ...formData, territory: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">Meta de Eleitores</label>
              <input 
                required
                type="number" 
                min="1"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Ex: 60"
                value={formData.goals}
                onChange={e => setFormData({ ...formData, goals: e.target.value })}
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
            className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all"
          >
            <Save size={18} /> Confirmar Cadastro
          </button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// MODAL: EDITAR INTEGRANTE
// ==========================================
interface EditMemberModalProps {
  member: TeamMember;
  onClose: () => void;
  onUpdate: (id: string, updatedData: Partial<TeamMember>) => void;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ member, onClose, onUpdate }) => {
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-200"
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Pencil size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Editar Integrante</h3>
              <p className="text-xs text-slate-400">Atualize os dados e metas do colaborador</p>
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
            <label className="text-xs font-bold text-slate-600 uppercase ml-1">Nome Completo</label>
            <input 
              required
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">Papel na Campanha</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <option value={UserRole.COORDINATOR}>Coordenador Regional</option>
                <option value={UserRole.LEADER}>Líder de Equipe</option>
                <option value={UserRole.FISCAL}>Fiscal de Votação</option>
                <option value={UserRole.SUPPORTER}>Apoiador / Multiplicador</option>
                <option value={UserRole.ADMIN}>Administrador</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">Telefone / WhatsApp</label>
              <input 
                required
                type="tel" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase ml-1">Território / Região</label>
            <input 
              required
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={formData.territory}
              onChange={e => setFormData({ ...formData, territory: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">Meta de Eleitores</label>
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
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">Eleitores Captados</label>
              <input 
                required
                type="number" 
                min="0"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-emerald-600"
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
// MODAL: EXCLUIR INTEGRANTE
// ==========================================
interface DeleteMemberModalProps {
  member: TeamMember;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

const DeleteMemberModal: React.FC<DeleteMemberModalProps> = ({ member, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Trash2 size={28} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-slate-800">Excluir Integrante?</h3>
            <p className="text-sm text-slate-500">
              Tem certeza que deseja remover este integrante da equipe de campanha?
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-left space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
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
            <div className="text-xs text-slate-500 pt-1 border-t border-slate-200/60 flex justify-between">
              <span>Meta atribuída: <strong>{member.goals} eleitores</strong></span>
              <span>Captados: <strong>{member.achieved}</strong></span>
            </div>
          </div>

          <p className="text-xs text-rose-600 font-medium flex items-center justify-center gap-1">
            <AlertTriangle size={14} /> Esta ação não poderá ser desfeita.
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
// MODAL: LIMPAR TODA A EQUIPE
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Trash2 size={28} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-slate-800">Limpar Registros de Equipe?</h3>
            <p className="text-sm text-slate-500">
              Tem certeza que deseja remover todos os <strong>{count}</strong> integrantes cadastrados na equipe de campanha?
            </p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl text-amber-800 text-xs text-left space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle size={14} className="text-amber-600 shrink-0" /> Atenção
            </div>
            <p>Todos os dados de metas, contatos e territórios das lideranças serão apagados do banco de dados ativo.</p>
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
            <Trash2 size={18} /> Limpar Todos os Registros
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL TEAMS
// ==========================================
const Teams: React.FC = () => {
  const { teams: members, addTeamMember, updateTeamMember, deleteTeamMember, clearTeams, restoreDemoData } = useDatabase();
  const { showToast } = useToast();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  // Stats calculation
  const stats = useMemo(() => {
    const totalGoals = members.reduce((acc, m) => acc + (m.goals || 0), 0);
    const totalAchieved = members.reduce((acc, m) => acc + (m.achieved || 0), 0);
    const avgPerformance = totalGoals > 0 ? (totalAchieved / totalGoals) * 100 : 0;
    
    return {
      total: members.length,
      leaders: members.filter(m => m.role === UserRole.LEADER || m.role === UserRole.COORDINATOR).length,
      avgPerformance: avgPerformance.toFixed(1),
      totalAchieved,
      totalGoals
    };
  }, [members]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = m.name.toLowerCase().includes(q) ||
                            m.territory.toLowerCase().includes(q) ||
                            m.phone.toLowerCase().includes(q);
      const matchesRole = filterRole === 'ALL' || m.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [members, searchTerm, filterRole]);

  // Handlers
  const handleCreateMember = (data: Omit<TeamMember, 'id'>) => {
    const created = addTeamMember(data);
    setIsCreateModalOpen(false);
    showToast(`${created.name} cadastrado com sucesso na equipe!`, 'success');
  };

  const handleUpdateMember = (id: string, updatedData: Partial<TeamMember>) => {
    updateTeamMember(id, updatedData);
    setEditingMember(null);
    showToast(`Cadastro de ${updatedData.name || 'integrante'} atualizado com sucesso!`, 'success');
  };

  const handleDeleteMember = (id: string) => {
    const memberName = deletingMember?.name || 'Integrante';
    deleteTeamMember(id);
    setDeletingMember(null);
    showToast(`${memberName} foi removido da equipe.`, 'info');
  };

  const handleClearAllConfirm = () => {
    clearTeams();
    setIsClearAllModalOpen(false);
    showToast('Todos os registros de equipe foram limpos com sucesso.', 'info');
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone) {
      window.open(`https://wa.me/55${cleanPhone}?text=Olá%20${encodeURIComponent(name)},%20tudo%20bem?%20Mensagem%20da%20Coordenação%20de%20Campanha.`, '_blank');
    } else {
      showToast(`Telefone de ${name} não possui formato válido.`, 'warning');
    }
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
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Integrantes</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{stats.total}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Membros ativos</p>
          </div>
          <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
            <UsersRound size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Lideranças & Coord.</p>
            <h3 className="text-2xl font-black text-purple-700 mt-1">{stats.leaders}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Pontos focais territoriais</p>
          </div>
          <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Performance Média</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats.avgPerformance}%</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Do total das metas</p>
          </div>
          <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Eleitores Captados</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{stats.totalAchieved}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Meta total: {stats.totalGoals}</p>
          </div>
          <div className="bg-amber-100 text-amber-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
            <Target size={24} />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header & Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users className="text-purple-600" size={20} /> Membros e Colaboradores da Campanha
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Gestão de integrantes, metas territoriais, edição e exclusão de cadastros</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por nome, território ou telefone..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 w-full sm:w-72 transition-all"
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

            {/* Role Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <Filter size={14} className="text-slate-400" />
              <select 
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer pr-2"
              >
                <option value="ALL">Todos os Papéis</option>
                <option value={UserRole.COORDINATOR}>Coordenadores</option>
                <option value={UserRole.LEADER}>Líderes</option>
                <option value={UserRole.FISCAL}>Fiscais</option>
                <option value={UserRole.SUPPORTER}>Apoiadores</option>
                <option value={UserRole.ADMIN}>Administradores</option>
              </select>
            </div>

            {/* Clear All Button */}
            {members.length > 0 && (
              <button 
                type="button"
                onClick={() => setIsClearAllModalOpen(true)}
                className="flex items-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                title="Limpar todos os registros de integrantes e lideranças"
              >
                <Trash2 size={15} /> Limpar Equipe
              </button>
            )}

            {/* Create Button */}
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all ml-auto sm:ml-0"
            >
              <Plus size={18} /> Novo Membro
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
                <th className="px-6 py-4">Meta (Captado / Meta)</th>
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
                            member.role === UserRole.FISCAL ? 'bg-indigo-100 text-indigo-700' :
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
                            {member.role === UserRole.LEADER && <Award size={11} />}
                            {member.role === UserRole.COORDINATOR && <ShieldCheck size={11} />}
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
                          <span className="text-xs text-slate-400 font-medium">/ {member.goals} eleitores</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {member.goals - member.achieved > 0 
                            ? `Faltam ${member.goals - member.achieved} para meta` 
                            : 'Meta superada!'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="w-full max-w-[130px] space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase">
                            <span>{percent.toFixed(0)}%</span>
                            {percent >= 100 && (
                              <span className="text-emerald-600 flex items-center gap-0.5 text-[9px]">
                                <CheckCircle2 size={11} /> 100%
                              </span>
                            )}
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
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

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* WhatsApp */}
                          <button 
                            type="button"
                            title={`Enviar WhatsApp para ${member.name}`}
                            onClick={() => handleWhatsApp(member.phone, member.name)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          >
                            <MessageSquare size={16} />
                          </button>

                          {/* Ligar */}
                          <a 
                            href={`tel:${member.phone.replace(/\D/g, '')}`}
                            title={`Ligar para ${member.name}`}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          >
                            <Phone size={16} />
                          </a>

                          {/* Editar */}
                          <button 
                            type="button"
                            title={`Editar dados de ${member.name}`}
                            onClick={() => setEditingMember(member)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium"
                          >
                            <Pencil size={16} />
                          </button>

                          {/* Excluir */}
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
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <UsersRound size={24} />
                      </div>
                      <h4 className="font-bold text-slate-700">Nenhum integrante encontrado</h4>
                      <p className="text-xs text-slate-400">
                        {searchTerm || filterRole !== 'ALL' 
                          ? 'Tente ajustar os termos da busca ou os filtros aplicados.' 
                          : 'Ainda não há integrantes cadastrados na equipe de campanha.'}
                      </p>
                      {searchTerm || filterRole !== 'ALL' ? (
                        <button 
                          onClick={() => { setSearchTerm(''); setFilterRole('ALL'); }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                        >
                          Limpar Filtros
                        </button>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                          <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5"
                          >
                            <Plus size={15} /> Adicionar Integrante
                          </button>
                          <button 
                            onClick={restoreDemoData}
                            className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                          >
                            <ShieldCheck size={15} className="text-purple-600" /> Carregar Dados de Exemplo
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
      </div>

      {/* Modal: Criar */}
      {isCreateModalOpen && (
        <CreateMemberModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSave={handleCreateMember} 
        />
      )}

      {/* Modal: Editar */}
      {editingMember && (
        <EditMemberModal 
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onUpdate={handleUpdateMember}
        />
      )}

      {/* Modal: Excluir */}
      {deletingMember && (
        <DeleteMemberModal 
          member={deletingMember}
          onClose={() => setDeletingMember(null)}
          onConfirm={handleDeleteMember}
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
