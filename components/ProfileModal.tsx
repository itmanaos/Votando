import React, { useState } from 'react';
import { 
  User, Shield, KeyRound, Smartphone, Bell, Users, CheckCircle2, 
  AlertCircle, X, Save, Sparkles, RefreshCw, Trash2, UserPlus, 
  ExternalLink, Globe, Lock, ShieldCheck, Check, Clock, Laptop, 
  PhoneCall, Mail, Building, MapPin, Award, LogOut
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { UserRole, UserProfile } from '../types';
import { SYSTEM_PERMISSIONS, DEFAULT_GLOBAL_USER } from '../constants';
import { useToast } from './Toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'personal' | 'rbac' | 'security' | 'users' | 'notifications';
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, initialTab = 'personal' }) => {
  const { 
    currentUser, allUsers, accessLogs, isGlobalAdmin, 
    updateProfile, createUser, deleteUser, toggleTwoFactor, 
    changePassword, quickLogin, logout 
  } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'personal' | 'rbac' | 'security' | 'users' | 'notifications'>(initialTab);
  
  // Personal Form
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    cpf: currentUser.cpf || '',
    electoralTitle: currentUser.electoralTitle || '',
    jobTitle: currentUser.jobTitle || '',
    party: currentUser.party || '',
    coalition: currentUser.coalition || '',
    territory: currentUser.territory || '',
    votingZone: currentUser.votingZone || '',
    avatarUrl: currentUser.avatarUrl || '',
    bio: currentUser.bio || ''
  });

  // Security Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notifications Form
  const [notifData, setNotifData] = useState({
    email: currentUser.notificationPreferences?.email ?? true,
    push: currentUser.notificationPreferences?.push ?? true,
    urgentAlerts: currentUser.notificationPreferences?.urgentAlerts ?? true,
    whatsapp: currentUser.notificationPreferences?.whatsapp ?? true
  });

  // New User Form (in Users tab)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: UserRole.LEADER,
    isGlobalAccess: false,
    jobTitle: 'Líder de Mobilização',
    territory: 'Zona Leste',
    votingZone: 'Zona 112'
  });

  if (!isOpen) return null;

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfile(formData);
    if (res.success) {
      addToast({
        title: 'Perfil Salvo',
        description: 'Seus dados de perfil foram atualizados com sucesso.',
        type: 'success'
      });
    }
  };

  const handleSaveNotifications = async () => {
    const res = await updateProfile({ notificationPreferences: notifData });
    if (res.success) {
      addToast({
        title: 'Preferências Salvas',
        description: 'Suas opções de notificação foram atualizadas.',
        type: 'success'
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast({
        title: 'Senhas Diferentes',
        description: 'A confirmação de senha não confere.',
        type: 'error'
      });
      return;
    }

    const res = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    if (res.success) {
      addToast({
        title: 'Senha Atualizada',
        description: 'Nova senha registrada com sucesso.',
        type: 'success'
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      addToast({
        title: 'Erro na Atualização',
        description: res.message || 'Falha ao atualizar senha.',
        type: 'error'
      });
    }
  };

  const handleToggle2FA = async () => {
    const res = await toggleTwoFactor();
    addToast({
      title: res.enabled ? '2FA Ativado!' : '2FA Desativado',
      description: res.enabled 
        ? 'Autenticação em duas etapas agora protege seus acessos.' 
        : 'Proteção em duas etapas foi desativada.',
      type: res.enabled ? 'success' : 'warning'
    });
  };

  const handleCreateNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createUser(newUserData);
    if (res.success) {
      addToast({
        title: 'Usuário Criado',
        description: `Usuário ${newUserData.name} adicionado com perfil ${newUserData.role}.`,
        type: 'success'
      });
      setIsAddUserOpen(false);
      setNewUserData({
        name: '',
        email: '',
        phone: '',
        role: UserRole.LEADER,
        isGlobalAccess: false,
        jobTitle: 'Líder de Mobilização',
        territory: 'Zona Leste',
        votingZone: 'Zona 112'
      });
    } else {
      addToast({
        title: 'Erro ao Criar Usuário',
        description: res.message || 'Não foi possível cadastrar o usuário.',
        type: 'error'
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Tem certeza que deseja remover este usuário da campanha?')) {
      const res = await deleteUser(userId);
      if (res.success) {
        addToast({
          title: 'Usuário Removido',
          description: 'A conta foi excluída da campanha.',
          type: 'info'
        });
      } else {
        addToast({
          title: 'Operação Bloqueada',
          description: res.message || 'Não é possível excluir este usuário.',
          type: 'error'
        });
      }
    }
  };

  const handleQuickSwitchUser = (userId: string) => {
    quickLogin(userId);
    addToast({
      title: 'Perfil Alterado',
      description: 'Você está navegando com o perfil selecionado.',
      type: 'info'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] max-h-[820px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={currentUser.avatarUrl || AVATAR_PRESETS[0]} 
                alt={currentUser.name} 
                className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              {isGlobalAdmin && (
                <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full shadow-sm" title="Acesso Global">
                  <ShieldCheck size={12} />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {currentUser.name}
                </h2>
                {isGlobalAdmin ? (
                  <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles size={10} />
                    Acesso Global
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md uppercase">
                    {currentUser.role}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {currentUser.jobTitle} • {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-100 transition-colors flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>Sair</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Tab Bar */}
        <div className="flex border-b border-slate-100 px-6 bg-white overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`py-3 px-3 text-xs font-black border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'personal'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User size={15} />
            <span>Dados Pessoais & Campanha</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rbac')}
            className={`py-3 px-3 text-xs font-black border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'rbac'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield size={15} />
            <span>Nível de Acesso & RBAC</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 text-xs font-black border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound size={15} />
            <span>Segurança & 2FA</span>
          </button>

          {isGlobalAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`py-3 px-3 text-xs font-black border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users size={15} />
              <span>Gerenciar Usuários ({allUsers.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`py-3 px-3 text-xs font-black border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'notifications'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell size={15} />
            <span>Notificações & Alertas</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/40">
          
          {/* ========================================================================= */}
          {/* TAB 1: DADOS PESSOAIS & CAMPANHA                                          */}
          {/* ========================================================================= */}
          {activeTab === 'personal' && (
            <form onSubmit={handleSavePersonal} className="space-y-6 max-w-3xl mx-auto">
              
              {/* Avatar Picker */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <label className="text-xs font-bold text-slate-800 block">Avatar do Usuário</label>
                <div className="flex items-center gap-4 flex-wrap">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarUrl: url })}
                      className={`relative rounded-2xl p-0.5 transition-all ${
                        formData.avatarUrl === url ? 'ring-2 ring-blue-600 scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Avatar" className="w-12 h-12 rounded-xl object-cover" />
                      {formData.avatarUrl === url && (
                        <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                          <Check size={10} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Data Fields */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Informações de Identificação
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">E-mail Corporativo *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">CPF (Cadastrado)</label>
                    <input
                      type="text"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Título de Eleitor</label>
                    <input
                      type="text"
                      value={formData.electoralTitle}
                      onChange={(e) => setFormData({ ...formData, electoralTitle: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Campaign Assignment */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Atribuição na Campanha & Território
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Cargo / Função Oficial</label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Partido / Coligação</label>
                    <input
                      type="text"
                      value={formData.party}
                      onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Território Atribuído</label>
                    <input
                      type="text"
                      value={formData.territory}
                      onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Zona Eleitoral</label>
                    <input
                      type="text"
                      value={formData.votingZone}
                      onChange={(e) => setFormData({ ...formData, votingZone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Apresentação / Bio</label>
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Save size={14} />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: NÍVEL DE ACESSO & RBAC                                             */}
          {/* ========================================================================= */}
          {activeTab === 'rbac' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              {/* Access Level Card */}
              <div className={`p-6 rounded-3xl border shadow-sm ${
                isGlobalAdmin 
                  ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-300' 
                  : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {isGlobalAdmin ? (
                        <div className="p-2 bg-amber-500 text-slate-950 rounded-2xl shadow-md">
                          <Sparkles size={20} />
                        </div>
                      ) : (
                        <div className="p-2 bg-blue-600 text-white rounded-2xl shadow-md">
                          <Shield size={20} />
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          {isGlobalAdmin ? 'Acesso Global Master (Irrestrito)' : `Perfil: ${currentUser.role}`}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {isGlobalAdmin 
                            ? 'Este usuário possui credenciais completas de superadministrador sobre toda a campanha.' 
                            : 'Acesso restrito ao seu território e permissões designadas pela coordenação.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    isGlobalAdmin 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isGlobalAdmin ? 'SUPER ADMIN' : currentUser.role}
                  </span>
                </div>
              </div>

              {/* Permissions Matrix */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Matriz de Privilégios & Módulos Habilitados
                    </h4>
                    <p className="text-xs text-slate-400">
                      Recursos liberados para esta credencial
                    </p>
                  </div>
                  {isGlobalAdmin && (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      100% dos Módulos Liberados
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SYSTEM_PERMISSIONS.map(perm => {
                    const isGranted = isGlobalAdmin || (currentUser.permissions && currentUser.permissions.includes(perm.id));
                    return (
                      <div 
                        key={perm.id} 
                        className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                          isGranted 
                            ? 'bg-slate-50/80 border-slate-200 text-slate-800' 
                            : 'bg-slate-100/40 border-slate-200/40 text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            {perm.category}
                          </span>
                          <span className="text-xs font-bold leading-tight block">
                            {perm.label}
                          </span>
                        </div>
                        {isGranted ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Check size={14} />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                            <Lock size={12} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: SEGURANÇA & CREDENCIAIS                                            */}
          {/* ========================================================================= */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              {/* 2FA Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${currentUser.twoFactorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Autenticação em Duas Etapas (2FA)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Protege sua conta exigindo um código no celular ou token eleitoral a cada novo login.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggle2FA}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${
                    currentUser.twoFactorEnabled 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {currentUser.twoFactorEnabled ? 'ATIVADO (Clique p/ Desativar)' : 'ATIVAR 2FA'}
                </button>
              </div>

              {/* Change Password Form */}
              <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                  <KeyRound size={15} className="text-blue-600" />
                  <span>Alterar Senha de Acesso</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Senha Atual</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Nova Senha</label>
                    <input
                      type="password"
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      required
                      placeholder="Repita a senha"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Salvar Nova Senha
                  </button>
                </div>
              </form>

              {/* Access & Audit Logs */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock size={15} className="text-slate-500" />
                    Registro de Auditoria de Acessos Recentes
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Últimos eventos do sistema</span>
                </h4>

                <div className="space-y-2">
                  {accessLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800">{log.action}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{log.ip} • {log.device}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-mono block">{log.timestamp}</span>
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: GERENCIAR USUÁRIOS (SUPER ADMIN)                                   */}
          {/* ========================================================================= */}
          {activeTab === 'users' && isGlobalAdmin && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Membros & Credenciais da Campanha</h3>
                  <p className="text-xs text-slate-500">Controle de quem tem acesso aos dados e relatórios do comitê</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(!isAddUserOpen)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <UserPlus size={14} />
                  <span>Novo Usuário</span>
                </button>
              </div>

              {/* Add User Modal / Box */}
              {isAddUserOpen && (
                <form onSubmit={handleCreateNewUser} className="bg-white p-5 rounded-3xl border border-blue-200 shadow-md space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-black text-blue-900 uppercase">Cadastrar Novo Membro no Comitê</h4>
                    <button type="button" onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Nome Completo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Dra. Mariana Costa"
                        value={newUserData.name}
                        onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">E-mail *</label>
                      <input
                        type="email"
                        required
                        placeholder="mariana@campanha.com.br"
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Papel / Perfil</label>
                      <select
                        value={newUserData.role}
                        onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer"
                      >
                        <option value={UserRole.ADMIN}>ADMIN (Acesso Global)</option>
                        <option value={UserRole.COORDINATOR}>COORDINATOR (Geral)</option>
                        <option value={UserRole.LEADER}>LEADER (Líder)</option>
                        <option value={UserRole.FISCAL}>FISCAL (Apuração)</option>
                        <option value={UserRole.SUPPORTER}>SUPPORTER (Apoiador)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Cargo / Função</label>
                      <input
                        type="text"
                        value={newUserData.jobTitle}
                        onChange={(e) => setNewUserData({ ...newUserData, jobTitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Território</label>
                      <input
                        type="text"
                        value={newUserData.territory}
                        onChange={(e) => setNewUserData({ ...newUserData, territory: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddUserOpen(false)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md"
                    >
                      Cadastrar Usuário
                    </button>
                  </div>
                </form>
              )}

              {/* Users List */}
              <div className="space-y-2.5">
                {allUsers.map(user => {
                  const isCurrent = user.id === currentUser.id;
                  const isGlobal = user.isGlobalAccess || user.role === UserRole.ADMIN;

                  return (
                    <div 
                      key={user.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        isCurrent 
                          ? 'bg-blue-50/60 border-blue-200 shadow-sm' 
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatarUrl || AVATAR_PRESETS[0]} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900">{user.name}</span>
                            {isGlobal ? (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-black rounded-md border border-amber-300 uppercase">
                                Acesso Global
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-bold rounded-md uppercase">
                                {user.role}
                              </span>
                            )}
                            {isCurrent && (
                              <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded-md uppercase">
                                VOCÊ
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {user.jobTitle} • {user.territory} • <span className="font-mono">{user.email}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => handleQuickSwitchUser(user.id)}
                            className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-xl transition-colors"
                            title="Alternar para este perfil para testar visualização"
                          >
                            Simular Perfil
                          </button>
                        )}

                        {user.id !== DEFAULT_GLOBAL_USER.id && !isCurrent && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Remover Usuário"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: NOTIFICAÇÕES & ALERTAS                                             */}
          {/* ========================================================================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Canais de Notificação e Mensageria
                </h4>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Alertas Críticos & Compliance TSE</span>
                      <span className="text-[11px] text-slate-500">Notificações imediatas sobre pendências de recibos ou prazos legais de reuniões</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifData.urgentAlerts}
                      onChange={(e) => setNotifData({ ...notifData, urgentAlerts: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Notificações via WhatsApp</span>
                      <span className="text-[11px] text-slate-500">Receber resumo matinal de agenda e metas batidas por líderes</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifData.whatsapp}
                      onChange={(e) => setNotifData({ ...notifData, whatsapp: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">E-mails de Relatório Executivo</span>
                      <span className="text-[11px] text-slate-500">Boletins diários de apuração e evolução de eleitores</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifData.email}
                      onChange={(e) => setNotifData({ ...notifData, email: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </label>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={handleSaveNotifications}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Salvar Preferências
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
