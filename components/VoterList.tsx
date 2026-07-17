
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  MapPin, 
  MessageSquare, 
  Landmark, 
  Tag, 
  UserCheck, 
  X, 
  Calendar, 
  User, 
  Target, 
  Compass, 
  ExternalLink,
  History,
  Phone,
  Plus,
  Save,
  ChevronRight,
  Hash,
  CheckSquare,
  Square,
  Trash2,
  ListFilter,
  Download,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import { MOCK_VOTERS } from '../constants';
import { SupportLevel, Voter } from '../types';
import { useToast } from './Toast';

interface DetailModalProps {
  voter: Voter;
  onClose: () => void;
}

const VoterDetailModal: React.FC<DetailModalProps> = ({ voter, onClose }) => {
  const getBadgeColor = (level: SupportLevel) => {
    switch (level) {
      case SupportLevel.LOYAL: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case SupportLevel.INDECISIVE: return 'bg-amber-100 text-amber-700 border-amber-200';
      case SupportLevel.OPPOSITION: return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleWhatsApp = () => {
    const cleanPhone = voter.phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative flex flex-col animate-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${
              voter.supportLevel === SupportLevel.LOYAL ? 'bg-emerald-500' : 
              voter.supportLevel === SupportLevel.OPPOSITION ? 'bg-rose-500' : 'bg-blue-500'
            }`}>
              <User size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{voter.name}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Calendar size={14} /> Cadastrado em Outubro 2023
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Target size={14} /> Status de Engajamento
              </h4>
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <Phone size={12} className="text-blue-500" /> {voter.phone}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border flex flex-col gap-1 ${getBadgeColor(voter.supportLevel)}`}>
                <span className="text-[10px] font-bold uppercase opacity-70">Nível de Apoio</span>
                <span className="font-bold">{voter.supportLevel}</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Última Interação</span>
                <span className="font-bold text-slate-700">{voter.lastContact}</span>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Compass size={14} /> Perfil & Demografia
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Idade / Gênero</span>
                  <span className="font-semibold text-slate-800">{voter.age} anos / {voter.gender === 'M' ? 'Masculino' : 'Feminino'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Socioeconômico</span>
                  <span className="font-semibold text-slate-800">{voter.socioEconomic}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Local Eleitoral</span>
                  <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Z-{voter.votingZone} S-{voter.votingSection}
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Tag size={14} /> Interesses Prioritários
              </h4>
              <div className="flex flex-wrap gap-2">
                {voter.interests.map((interest, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <section>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <MapPin size={14} /> Localização Georreferenciada
            </h4>
            <div className="bg-slate-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{voter.neighborhood}</p>
                  <p className="text-[10px] text-slate-500 font-mono">LAT: {voter.coordinates.lat} / LNG: {voter.coordinates.lng}</p>
                </div>
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <ExternalLink size={14} /> Abrir no Maps
              </button>
            </div>
          </section>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <a 
            href={`tel:${voter.phone.replace(/\D/g, '')}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            <Phone size={16} /> Ligar Agora
          </a>
          <button 
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
          >
            <MessageSquare size={16} /> WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

interface CreateModalProps {
  onClose: () => void;
  onSave: (voter: any) => void;
}

const CreateVoterModal: React.FC<CreateModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'F',
    neighborhood: '',
    votingZone: '',
    votingSection: '',
    supportLevel: SupportLevel.NEUTRAL,
    socioEconomic: 'Classe C',
    interests: [] as string[]
  });

  const availableInterests = ['Saúde', 'Educação', 'Segurança', 'Emprego', 'Saneamento', 'Transporte', 'Economia', 'Cultura'];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden relative flex flex-col animate-in slide-in-from-bottom-4 duration-300"
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Novo Eleitor</h3>
              <p className="text-xs text-slate-400">Preencha os dados estratégicos para o registro</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome Completo</label>
              <input 
                required
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Ex: João da Silva"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Telefone / WhatsApp</label>
              <input 
                required
                type="tel" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Idade</label>
              <input 
                required
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="34"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Gênero</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
                <option value="O">Outro</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Bairro / Região</label>
              <input 
                required
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Ex: Centro"
                value={formData.neighborhood}
                onChange={e => setFormData({...formData, neighborhood: e.target.value})}
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Landmark size={12} /> Localização Eleitoral
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Zona</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    required
                    type="number" 
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="Ex: 102"
                    value={formData.votingZone}
                    onChange={e => setFormData({...formData, votingZone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Seção</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    required
                    type="number" 
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="Ex: 045"
                    value={formData.votingSection}
                    onChange={e => setFormData({...formData, votingSection: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nível de Apoio</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                value={formData.supportLevel}
                onChange={e => setFormData({...formData, supportLevel: e.target.value as SupportLevel})}
              >
                {Object.values(SupportLevel).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Perfil Socioeconômico</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                value={formData.socioEconomic}
                onChange={e => setFormData({...formData, socioEconomic: e.target.value})}
              >
                <option value="Classe A">Classe A</option>
                <option value="Classe B">Classe B</option>
                <option value="Classe C">Classe C</option>
                <option value="Classe D">Classe D</option>
                <option value="Classe E">Classe E</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Interesses Principais</label>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              {availableInterests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    formData.interests.includes(interest)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
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
            className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            <Save size={18} /> Salvar Registro
          </button>
        </div>
      </form>
    </div>
  );
};

type SortKey = 'name' | 'socioEconomic' | 'interests' | 'neighborhood' | 'supportLevel' | 'lastContact';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const VoterList: React.FC = () => {
  const [voters, setVoters] = useState<Voter[]>(MOCK_VOTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedSupportLevel, setSelectedSupportLevel] = useState('');
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedVoterIds, setSelectedVoterIds] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const { showToast } = useToast();

  const votingZonesData = useMemo(() => {
    const counts: Record<string, number> = {};
    voters.forEach(v => {
      counts[v.votingZone] = (counts[v.votingZone] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([zone, count]) => ({ zone, count }))
      .sort((a, b) => a.zone.localeCompare(b.zone));
  }, [voters]);

  const supportLevelOptions = Object.values(SupportLevel);

  const getBadgeColor = (level: SupportLevel) => {
    switch (level) {
      case SupportLevel.LOYAL: return 'bg-emerald-100 text-emerald-700';
      case SupportLevel.INDECISIVE: return 'bg-amber-100 text-amber-700';
      case SupportLevel.OPPOSITION: return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleRequestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredVoters = useMemo(() => {
    let result = voters.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            v.votingZone.includes(searchTerm) ||
                            v.votingSection.includes(searchTerm);
      const matchesZone = selectedZone === '' || v.votingZone === selectedZone;
      const matchesSupport = selectedSupportLevel === '' || v.supportLevel === selectedSupportLevel;
      return matchesSearch && matchesZone && matchesSupport;
    });

    // Custom sorting weight for support level
    const supportLevelWeight: Record<SupportLevel, number> = {
      [SupportLevel.LOYAL]: 0,
      [SupportLevel.INDECISIVE]: 1,
      [SupportLevel.NEUTRAL]: 2,
      [SupportLevel.OPPOSITION]: 3
    };

    result.sort((a, b) => {
      let valA: any = a[sortConfig.key as keyof Voter] || '';
      let valB: any = b[sortConfig.key as keyof Voter] || '';

      // Special handling for nested or complex fields
      if (sortConfig.key === 'interests') {
        valA = a.interests.length;
        valB = b.interests.length;
      } else if (sortConfig.key === 'supportLevel') {
        valA = supportLevelWeight[a.supportLevel];
        valB = supportLevelWeight[b.supportLevel];
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [voters, searchTerm, selectedZone, selectedSupportLevel, sortConfig]);

  const handleSaveNewVoter = (newData: any) => {
    // 1. Validação de Dados Básicos
    if (!newData.name.trim() || !newData.phone.trim()) {
      showToast("Nome e telefone são obrigatórios para o cadastro.", "error");
      return;
    }

    const cleanPhone = newData.phone.replace(/\D/g, '');
    const cleanName = newData.name.trim().toLowerCase();

    // 2. Validação de Cadastro Duplicado
    const isDuplicate = voters.some(v => 
      v.phone.replace(/\D/g, '') === cleanPhone || 
      v.name.trim().toLowerCase() === cleanName
    );

    if (isDuplicate) {
      showToast("Erro: Já existe um eleitor cadastrado com este nome ou telefone.", "error");
      return;
    }

    // 3. Validação de Idade e Zona/Seção
    const ageNum = parseInt(newData.age);
    if (isNaN(ageNum) || ageNum < 16) {
      showToast("A idade mínima para cadastro eleitoral é 16 anos.", "error");
      return;
    }

    // 4. Criação do Registro
    const newVoter: Voter = {
      ...newData,
      id: Math.random().toString(36).substr(2, 9),
      name: newData.name.trim(), // Salva formatado corretamente
      age: ageNum,
      lastContact: new Date().toISOString().split('T')[0],
      leaderId: 'L1',
      coordinates: { lat: -23.55, lng: -46.63 }
    };

    setVoters([newVoter, ...voters]);
    setIsCreateModalOpen(false);
    showToast(`Eleitor ${newVoter.name} cadastrado com sucesso!`, 'success');
  };

  const toggleSelectVoter = (id: string) => {
    const newSelected = new Set(selectedVoterIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedVoterIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedVoterIds.size === filteredVoters.length && filteredVoters.length > 0) {
      setSelectedVoterIds(new Set());
    } else {
      setSelectedVoterIds(new Set(filteredVoters.map(v => v.id)));
    }
  };

  const bulkUpdateSupportLevel = (level: SupportLevel) => {
    const count = selectedVoterIds.size;
    const updatedVoters = voters.map(v => 
      selectedVoterIds.has(v.id) ? { ...v, supportLevel: level } : v
    );
    setVoters(updatedVoters);
    setSelectedVoterIds(new Set());
    showToast(`${count} eleitores atualizados para ${level}`, 'info');
  };

  const bulkAddTag = (tag: string) => {
    const count = selectedVoterIds.size;
    const updatedVoters = voters.map(v => 
      selectedVoterIds.has(v.id) ? { ...v, interests: Array.from(new Set([...v.interests, tag])) } : v
    );
    setVoters(updatedVoters);
    setSelectedVoterIds(new Set());
    showToast(`Tag "${tag}" adicionada a ${count} eleitores`, 'success');
  };

  const handleBulkDelete = () => {
    const count = selectedVoterIds.size;
    const remaining = voters.filter(v => !selectedVoterIds.has(v.id));
    setVoters(remaining);
    setSelectedVoterIds(new Set());
    showToast(`${count} registros removidos da base.`, 'error');
  };

  const handleExportCSV = () => {
    if (filteredVoters.length === 0) {
      showToast("Nenhum dado para exportar.", "info");
      return;
    }

    const headers = ["ID", "Nome", "Idade", "Gênero", "Bairro", "Zona", "Seção", "Nível de Apoio", "Último Contato", "Telefone", "Interesses"];
    const csvRows = filteredVoters.map(v => [
      v.id,
      v.name,
      v.age,
      v.gender,
      v.neighborhood,
      v.votingZone,
      v.votingSection,
      v.supportLevel,
      v.lastContact,
      v.phone,
      `"${v.interests.join(', ')}"`
    ].join(','));

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `votando_eleitores_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("Base de eleitores exportada com sucesso!", "success");
  };

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={12} className="opacity-30 group-hover:opacity-100" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-blue-600" /> : <ChevronDown size={14} className="text-blue-600" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col relative min-h-[500px]">
      {selectedVoter && (
        <VoterDetailModal 
          voter={selectedVoter} 
          onClose={() => setSelectedVoter(null)} 
        />
      )}

      {isCreateModalOpen && (
        <CreateVoterModal 
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveNewVoter}
        />
      )}

      {selectedVoterIds.size > 0 && (
        <div className="absolute top-0 inset-x-0 h-16 bg-blue-600 z-20 flex items-center justify-between px-6 animate-in slide-in-from-top-full duration-300">
          <div className="flex items-center gap-4 text-white">
            <button onClick={() => setSelectedVoterIds(new Set())} className="p-2 hover:bg-white/10 rounded-full">
              <X size={20} />
            </button>
            <span className="font-bold text-sm uppercase tracking-wider">{selectedVoterIds.size} Selecionados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-4 border-r border-white/20 pr-4">
              <span className="text-[10px] font-black uppercase tracking-tighter text-blue-100">Atualizar Apoio:</span>
              <div className="flex gap-1">
                {supportLevelOptions.map(level => (
                  <button 
                    key={level}
                    onClick={() => bulkUpdateSupportLevel(level)}
                    className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[9px] font-black uppercase text-white border border-white/20 transition-colors"
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative group/tags">
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold shadow-lg hover:bg-blue-50 transition-all">
                <Tag size={16} /> <span className="hidden md:inline">Adicionar Tag</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 opacity-0 invisible group-hover/tags:opacity-100 group-hover/tags:visible transition-all z-30">
                <p className="text-[10px] font-black text-slate-400 uppercase p-2 border-b border-slate-50 mb-1">Tags Sugeridas</p>
                {['Saúde', 'Educação', 'Segurança', 'Emprego', 'Saneamento'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => bulkAddTag(tag)}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleBulkDelete}
              className="p-2 text-white/80 hover:text-white hover:bg-rose-500 rounded-lg transition-all" 
              title="Remover Selecionados"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Base de Eleitores
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {voters.length} Registros
            </span>
          </h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, zona ou seção..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none text-slate-600 font-medium cursor-pointer"
              >
                <option value="">Zonas</option>
                {votingZonesData.map(({ zone, count }) => (
                  <option key={zone} value={zone}>Zona {zone} ({count})</option>
                ))}
              </select>
            </div>

            <div className="relative flex-1 sm:flex-none">
              <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select
                value={selectedSupportLevel}
                onChange={(e) => setSelectedSupportLevel(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none text-slate-600 font-medium cursor-pointer"
              >
                <option value="">Apoio</option>
                {supportLevelOptions.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={handleExportCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all active:scale-[0.97]"
              title="Exportar lista atual filtrada para CSV"
            >
              <Download size={18} className="text-slate-400" /> <span className="hidden sm:inline">Exportar CSV</span>
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-all active:scale-[0.97]"
            >
              <Plus size={18} /> Novo Cadastro
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 w-10">
                <button onClick={toggleSelectAll} className="p-1 hover:bg-slate-200 rounded transition-colors">
                  {selectedVoterIds.size === filteredVoters.length && filteredVoters.length > 0 ? (
                    <CheckSquare size={18} className="text-blue-600" />
                  ) : (
                    <Square size={18} />
                  )}
                </button>
              </th>
              <th className="px-6 py-4 cursor-pointer group" onClick={() => handleRequestSort('name')}>
                <div className="flex items-center gap-2">
                  Eleitor
                  <SortIndicator column="name" />
                </div>
              </th>
              <th className="px-6 py-4 cursor-pointer group" onClick={() => handleRequestSort('socioEconomic')}>
                <div className="flex items-center gap-2">
                  Socioeconômico
                  <SortIndicator column="socioEconomic" />
                </div>
              </th>
              <th className="px-6 py-4 cursor-pointer group" onClick={() => handleRequestSort('interests')}>
                <div className="flex items-center gap-2">
                  Interesses
                  <SortIndicator column="interests" />
                </div>
              </th>
              <th className="px-6 py-4 cursor-pointer group" onClick={() => handleRequestSort('neighborhood')}>
                <div className="flex items-center gap-2">
                  Localização Eleitoral
                  <SortIndicator column="neighborhood" />
                </div>
              </th>
              <th className="px-6 py-4 cursor-pointer group" onClick={() => handleRequestSort('supportLevel')}>
                <div className="flex items-center gap-2">
                  Nível de Apoio
                  <SortIndicator column="supportLevel" />
                </div>
              </th>
              <th className="px-6 py-4 cursor-pointer group" onClick={() => handleRequestSort('lastContact')}>
                <div className="flex items-center gap-2">
                  Último Contato
                  <SortIndicator column="lastContact" />
                </div>
              </th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredVoters.length > 0 ? (
              filteredVoters.map((voter) => (
                <tr 
                  key={voter.id} 
                  className={`transition-colors group cursor-pointer ${selectedVoterIds.has(voter.id) ? 'bg-blue-50' : 'hover:bg-slate-50/50'}`}
                  onClick={() => setSelectedVoter(voter)}
                >
                  <td className="px-6 py-4" onClick={(e) => { e.stopPropagation(); toggleSelectVoter(voter.id); }}>
                    <div className="p-1">
                      {selectedVoterIds.has(voter.id) ? (
                        <CheckSquare size={18} className="text-blue-600 animate-in zoom-in duration-200" />
                      ) : (
                        <Square size={18} className="text-slate-300 group-hover:text-slate-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{voter.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{voter.age} anos • {voter.gender}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {voter.socioEconomic}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {voter.interests.map((interest, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[9px] font-bold border border-blue-100">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5 text-slate-600 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin size={10} className="text-slate-400" />
                        {voter.neighborhood}
                      </div>
                      <div className="flex items-center gap-1.5 ml-3.5">
                        <span className="bg-blue-50 text-blue-700 px-1 rounded font-bold text-[9px]">Z-{voter.votingZone}</span>
                        <span className="bg-slate-100 text-slate-700 px-1 rounded font-bold text-[9px]">S-{voter.votingSection}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${getBadgeColor(voter.supportLevel)}`}>
                      {voter.supportLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                    {voter.lastContact}
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => showToast(`Iniciando chat com ${voter.name}...`, 'info')}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-300">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p className="text-sm font-medium">Nenhum eleitor encontrado</p>
                    <p className="text-xs opacity-60">Ajuste os filtros ou crie um novo cadastro</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <p>Exibindo {filteredVoters.length} de {voters.length} eleitores</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors">Anterior</button>
          <button className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">Próximo</button>
        </div>
      </div>
    </div>
  );
};

export default VoterList;
