
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Map as MapIcon, Shield, BarChart3, 
  UsersRound, Settings, Menu, X, Bell, User, ClipboardList, 
  Vote, CalendarDays, LogOut, Sparkles, ShieldCheck, KeyRound, 
  UserCheck, ChevronRight
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import VoterList from './components/VoterList';
import MapView from './components/MapView';
import Teams from './components/Teams';
import Polls from './components/Polls';
import VotingResults from './components/VotingResults';
import Meetings from './components/Meetings';
import { UserRole } from './types';
import { ToastProvider } from './components/Toast';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { ProfileModal } from './components/ProfileModal';

const AppContent: React.FC = () => {
  const { currentUser, isAuthenticated, isGlobalAdmin, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('meetings');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<'personal' | 'rbac' | 'security' | 'users' | 'notifications'>('personal');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.LEADER] },
    { id: 'meetings', label: 'Reuniões & Agenda', icon: CalendarDays, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.LEADER, UserRole.SUPPORTER] },
    { id: 'voters', label: 'Eleitores', icon: Users, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.LEADER, UserRole.SUPPORTER] },
    { id: 'teams', label: 'Equipes', icon: UsersRound, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.LEADER] },
    { id: 'polls', label: 'Pesquisas', icon: ClipboardList, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.LEADER] },
    { id: 'tally', label: 'Apuração', icon: Vote, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.FISCAL] },
    { id: 'maps', label: 'Mapas & BI', icon: MapIcon, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.LEADER] },
    { id: 'security', label: 'Acessos & Perfis', icon: Shield, roles: [UserRole.ADMIN] },
  ];

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const filteredNavItems = navItems.filter(item => isGlobalAdmin || item.roles.includes(currentUser.role));

  const handleOpenProfile = (tab: 'personal' | 'rbac' | 'security' | 'users' | 'notifications' = 'personal') => {
    setProfileTab(tab);
    setIsProfileOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'meetings': return <Meetings />;
      case 'voters': return <VoterList />;
      case 'teams': return <Teams />;
      case 'polls': return <Polls />;
      case 'tally': return <VotingResults />;
      case 'maps': return <MapView />;
      case 'security': 
        return (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black rounded-full uppercase flex items-center gap-1.5">
                    <Sparkles size={12} />
                    Controle de Acessos & RBAC
                  </span>
                </div>
                <h2 className="text-2xl font-black">Gerenciamento de Perfis & Segurança</h2>
                <p className="text-xs text-slate-300 max-w-xl">
                  Administre todos os usuários cadastrados, atribua níveis de privilégio (Admin Global, Coordenador, Líder, Fiscal e Apoiador) e audite os acessos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenProfile('users')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <Users size={16} />
                  <span>Gerenciar Usuários</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenProfile('security')}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
                >
                  <KeyRound size={16} />
                  <span>Auditoria & 2FA</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div 
                onClick={() => handleOpenProfile('personal')}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <User size={20} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">Meu Perfil</h3>
                <p className="text-xs text-slate-500 mb-4">Atualize dados cadastrais, cargo na campanha e território de atuação.</p>
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1">Editar Dados <ChevronRight size={14} /></span>
              </div>

              <div 
                onClick={() => handleOpenProfile('rbac')}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">Privilégios & RBAC</h3>
                <p className="text-xs text-slate-500 mb-4">Consulte a matriz de permissões ativas e status de Acesso Global.</p>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">Ver Permissões <ChevronRight size={14} /></span>
              </div>

              <div 
                onClick={() => handleOpenProfile('security')}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <KeyRound size={20} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">Segurança & 2FA</h3>
                <p className="text-xs text-slate-500 mb-4">Autenticação em duas etapas, histórico de logs e alteração de senha.</p>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">Configurar <ChevronRight size={14} /></span>
              </div>
            </div>
          </div>
        );
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
           <BarChart3 size={64} className="mb-4 opacity-20" />
           <p className="text-lg font-medium">Módulo "{activeTab.toUpperCase()}" em desenvolvimento</p>
           <button 
             onClick={() => setActiveTab('dashboard')}
             className="mt-4 text-blue-600 font-semibold hover:underline"
           >
             Voltar ao Dashboard
           </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Profile & Users Management Modal */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        initialTab={profileTab}
      />

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-4">
          
          {/* Logo & Header */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">V</div>
            <div>
               <h1 className="font-black text-lg leading-tight tracking-tight uppercase">VOTANDO</h1>
               <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Electoral Tech</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            {filteredNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
                  activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'group-hover:text-blue-400'} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Bottom Profile & Settings Section */}
          <div className="mt-auto pt-4 border-t border-slate-800 space-y-2">
            <button 
              onClick={() => handleOpenProfile('personal')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-xs font-medium cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Settings size={16} />
                <span>Configurar Perfil</span>
              </span>
              <ChevronRight size={14} />
            </button>

            {/* Profile Pill in Sidebar */}
            <div 
              onClick={() => handleOpenProfile('personal')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-2xl cursor-pointer transition-all group"
            >
               <div className="flex items-center gap-3">
                  <img 
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                    alt={currentUser.name} 
                    className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold truncate text-white group-hover:text-blue-300">
                        {currentUser.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {isGlobalAdmin ? (
                        <span className="text-[9px] font-black text-amber-300 flex items-center gap-0.5 uppercase tracking-tighter">
                          <Sparkles size={9} />
                          Acesso Global
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium truncate">
                          {currentUser.jobTitle}
                        </span>
                      )}
                    </div>
                  </div>
               </div>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
            >
              <LogOut size={14} />
              <span>Encerrar Sessão</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
             <button 
               className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
               onClick={() => setIsSidebarOpen(true)}
             >
               <Menu size={24} />
             </button>
             <h2 className="text-slate-500 font-bold text-sm hidden md:block">
               {activeTab === 'dashboard' ? 'Visão Geral do Comitê Central' : `Módulo: ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
             </h2>
          </div>

          <div className="flex items-center gap-3">
             {/* Global Access Status Chip */}
             {isGlobalAdmin && (
               <div 
                 onClick={() => handleOpenProfile('rbac')}
                 className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-xs font-black cursor-pointer hover:bg-amber-100 transition-colors shadow-xs"
               >
                 <Sparkles size={13} className="text-amber-600" />
                 <span>ACESSO GLOBAL MASTER</span>
               </div>
             )}

             {/* Notifications Dropdown */}
             <div className="relative group">
                <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-2xl rounded-2xl p-4 border border-slate-100 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                   <p className="text-xs font-bold text-slate-800 mb-2">Notificações & Alertas</p>
                   <div className="space-y-2">
                     <p className="text-[11px] text-slate-600 border-l-2 border-emerald-500 pl-2">
                       Check-in de lideranças registrado para a Plenária Central.
                     </p>
                     <p className="text-[11px] text-slate-600 border-l-2 border-blue-500 pl-2">
                       Usuário Admin Master efetuou login com sucesso.
                     </p>
                   </div>
                </div>
             </div>

             {/* Logged User Button */}
             <button 
               onClick={() => handleOpenProfile('personal')}
               className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 transition-all cursor-pointer"
             >
               <img 
                 src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                 alt={currentUser.name} 
                 className="w-6 h-6 rounded-full object-cover"
               />
               <div className="text-left hidden sm:block">
                 <span className="text-xs font-black text-slate-800 block leading-tight">
                   {currentUser.name.split(' ')[0]}
                 </span>
               </div>
             </button>
          </div>
        </header>

        {/* Tab Page Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {renderContent()}
        </div>

        {/* Mobile Navigation Bottom Bar */}
        <nav className="lg:hidden h-16 bg-white border-t border-slate-100 flex items-center justify-around px-4 sticky bottom-0 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
           {filteredNavItems.slice(0, 5).map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`flex flex-col items-center gap-1 transition-colors ${
                 activeTab === item.id ? 'text-blue-600' : 'text-slate-400'
               }`}
             >
               <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
               <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
             </button>
           ))}
        </nav>
      </main>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;

