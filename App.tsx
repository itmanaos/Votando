
import React, { useState } from 'react';
import { LayoutDashboard, Users, Map as MapIcon, Shield, BarChart3, UsersRound, Settings, Menu, X, Bell, User, ClipboardList, Vote } from 'lucide-react';
import Dashboard from './components/Dashboard';
import VoterList from './components/VoterList';
import MapView from './components/MapView';
import Teams from './components/Teams';
import Polls from './components/Polls';
import VotingResults from './components/VotingResults';
import { UserRole } from './types';
import { ToastProvider } from './components/Toast';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUserRole] = useState<UserRole>(UserRole.ADMIN);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.LEADER] },
    { id: 'voters', label: 'Eleitores', icon: Users, roles: [UserRole.ADMIN, UserRole.LEADER, UserRole.SUPPORTER] },
    { id: 'teams', label: 'Equipes', icon: UsersRound, roles: [UserRole.ADMIN, UserRole.LEADER] },
    { id: 'polls', label: 'Pesquisas', icon: ClipboardList, roles: [UserRole.ADMIN, UserRole.LEADER] },
    { id: 'tally', label: 'Apuração', icon: Vote, roles: [UserRole.ADMIN, UserRole.LEADER] },
    { id: 'maps', label: 'Mapas & BI', icon: MapIcon, roles: [UserRole.ADMIN, UserRole.LEADER] },
    { id: 'security', label: 'Controle', icon: Shield, roles: [UserRole.ADMIN] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentUserRole));

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'voters': return <VoterList />;
      case 'teams': return <Teams />;
      case 'polls': return <Polls />;
      case 'tally': return <VotingResults />;
      case 'maps': return <MapView />;
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">V</div>
            <div>
               <h1 className="font-bold text-lg leading-tight tracking-tight uppercase">VOTANDO</h1>
               <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Electoral Tech</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {filteredNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
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

          <div className="mt-auto pt-6 border-t border-slate-800 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
              <Settings size={20} />
              <span className="font-medium text-sm">Configurações</span>
            </button>
            <div className="p-4 bg-slate-800/50 rounded-2xl mt-4">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold truncate">Admin Master</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Gabinete Central</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
             <button 
               className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
               onClick={() => setIsSidebarOpen(true)}
             >
               <Menu size={24} />
             </button>
             <h2 className="text-slate-400 font-medium text-sm hidden md:block">
               {activeTab === 'dashboard' ? 'Visão Geral do Comitê' : `Módulo: ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
             </h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group">
                <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-2xl rounded-xl p-4 border border-slate-100 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                   <p className="text-xs font-bold text-slate-800 mb-2">Notificações</p>
                   <div className="space-y-2">
                     <p className="text-[10px] text-slate-500 border-l-2 border-blue-500 pl-2">Nova meta atingida pela equipe Norte.</p>
                     <p className="text-[10px] text-slate-500 border-l-2 border-amber-500 pl-2">Alerta: Queda de intenção na Zona 12.</p>
                   </div>
                </div>
             </div>
             <button className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
               <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">AM</div>
               <span className="text-xs font-semibold text-slate-700">Eleição 2024</span>
             </button>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>

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
      <AppContent />
    </ToastProvider>
  );
};

export default App;
