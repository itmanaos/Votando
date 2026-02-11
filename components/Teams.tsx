
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
  MoreVertical, 
  X, 
  UserPlus, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Save
} from 'lucide-react';
import { MOCK_TEAMS } from '../constants';
import { TeamMember, UserRole } from '../types';

interface CreateMemberModalProps {
  onClose: () => void;
  onSave: (member: any) => void;
}

const CreateMemberModal: React.FC<CreateMemberModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: UserRole.SUPPORTER,
    territory: '',
    goals: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col animate-in zoom-in duration-200"
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Adicionar Integrante</h3>
              <p className="text-xs text-slate-400">Vincule um novo colaborador à campanha</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome Completo</label>
            <input 
              required
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder="Nome do integrante"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Papel</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500/20"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
              >
                <option value={UserRole.LEADER}>Líder de Equipe</option>
                <option value={UserRole.SUPPORTER}>Apoiador / Cabo</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Telefone</label>
              <input 
                required
                type="tel" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Território</label>
              <input 
                required
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Ex: Zona Sul"
                value={formData.territory}
                onChange={e => setFormData({...formData, territory: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Meta de Cadastros</label>
              <input 
                required
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Ex: 200"
                value={formData.goals}
                onChange={e => setFormData({...formData, goals: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
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

const Teams: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(MOCK_TEAMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => {
    const totalGoals = members.reduce((acc, m) => acc + m.goals, 0);
    const totalAchieved = members.reduce((acc, m) => acc + m.achieved, 0);
    const avgPerformance = totalGoals > 0 ? (totalAchieved / totalGoals) * 100 : 0;
    
    return {
      total: members.length,
      leaders: members.filter(m => m.role === UserRole.LEADER).length,
      avgPerformance: avgPerformance.toFixed(1),
      totalAchieved
    };
  }, [members]);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.territory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveMember = (data: any) => {
    const newMember: TeamMember = {
      id: `L${members.length + 1}`,
      name: data.name,
      role: data.role,
      territory: data.territory,
      goals: parseInt(data.goals),
      achieved: 0,
      phone: data.phone
    };
    setMembers([newMember, ...members]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <UsersRound size={20} />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Equipe</p>
          <h3 className="text-2xl font-black text-slate-800">{stats.total}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <ShieldCheck size={20} />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Lideranças</p>
          <h3 className="text-2xl font-black text-slate-800">{stats.leaders}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="bg-emerald-100 text-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <TrendingUp size={20} />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Performance</p>
          <h3 className="text-2xl font-black text-slate-800">{stats.avgPerformance}%</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="bg-amber-100 text-amber-600 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <Target size={20} />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Captado</p>
          <h3 className="text-2xl font-black text-slate-800">{stats.totalAchieved}</h3>
        </div>
      </div>

      {/* Main List Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Membros e Colaboradores</h2>
            <p className="text-xs text-slate-500">Monitoramento de metas e engajamento territorial</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar membro ou território..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 w-full md:w-64"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
            >
              <Plus size={18} /> Novo Membro
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Integrante</th>
                <th className="px-6 py-4">Papel / Território</th>
                <th className="px-6 py-4">Meta (Atingido / Total)</th>
                <th className="px-6 py-4">Progresso</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => {
                const percent = member.goals > 0 ? (member.achieved / member.goals) * 100 : 0;
                return (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                          member.role === UserRole.LEADER ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{member.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{member.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          member.role === UserRole.LEADER ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {member.role === UserRole.LEADER && <Award size={10} />}
                          {member.role}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={12} /> {member.territory}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-end gap-1">
                        <span className="text-sm font-black text-slate-800">{member.achieved}</span>
                        <span className="text-xs text-slate-400 font-medium">/ {member.goals}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full max-w-[120px] space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                          <span>{percent.toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              percent >= 80 ? 'bg-emerald-500' : percent >= 40 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <a 
                          href={`tel:${member.phone.replace(/\D/g, '')}`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Phone size={16} />
                        </a>
                        <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                          <MessageSquare size={16} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CreateMemberModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveMember} 
        />
      )}
    </div>
  );
};

export default Teams;
