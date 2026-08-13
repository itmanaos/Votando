import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, AccessLog } from '../types';
import { DEFAULT_GLOBAL_USER, MOCK_USERS, MOCK_ACCESS_LOGS, SYSTEM_PERMISSIONS } from '../constants';

interface AuthContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  allUsers: UserProfile[];
  accessLogs: AccessLog[];
  isGlobalAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  quickLogin: (userId: string) => void;
  logout: () => void;
  register: (userData: Partial<UserProfile> & { password?: string }) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<{ success: boolean; message?: string }>;
  createUser: (userData: Partial<UserProfile>) => Promise<{ success: boolean; user?: UserProfile; message?: string }>;
  deleteUser: (userId: string) => Promise<{ success: boolean; message?: string }>;
  toggleTwoFactor: () => Promise<{ success: boolean; enabled: boolean }>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
  resetPasswordRequest: (email: string) => Promise<{ success: boolean; message?: string }>;
  hasPermission: (permissionId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_AUTH = 'votando_auth_session_v1';
const STORAGE_KEY_USERS = 'votando_users_list_v1';
const STORAGE_KEY_LOGS = 'votando_access_logs_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load users from localStorage or default
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error loading saved users:', e);
    }
    return MOCK_USERS;
  });

  // Load current user / session
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {
      console.warn('Error loading auth session:', e);
    }
    return DEFAULT_GLOBAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      return !!saved;
    } catch {
      return true; // Default to true with global user for first load
    }
  });

  // Access Logs
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error loading logs:', e);
    }
    return MOCK_ACCESS_LOGS;
  });

  // Save users whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(allUsers));
    } catch (e) {
      console.warn('Failed to save users to localStorage', e);
    }
  }, [allUsers]);

  // Save current user & session
  useEffect(() => {
    try {
      if (isAuthenticated && currentUser) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH);
      }
    } catch (e) {
      console.warn('Failed to save auth to localStorage', e);
    }
  }, [currentUser, isAuthenticated]);

  // Save logs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(accessLogs));
    } catch (e) {
      console.warn('Failed to save logs to localStorage', e);
    }
  }, [accessLogs]);

  const addAccessLog = (action: string, status: 'SUCCESS' | 'FAILED' | 'WARNING' = 'SUCCESS') => {
    const newLog: AccessLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action,
      ip: '189.120.45.12 (São Paulo - BR)',
      device: 'Navegador Web / Sistema Seguro',
      status
    };
    setAccessLogs(prev => [newLog, ...prev.slice(0, 20)]);
  };

  const isGlobalAdmin = currentUser.isGlobalAccess || currentUser.role === UserRole.ADMIN;

  const hasPermission = (permissionId: string): boolean => {
    if (isGlobalAdmin) return true;
    if (!currentUser.permissions) return false;
    return currentUser.permissions.includes('*') || currentUser.permissions.includes(permissionId);
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      addAccessLog(`Tentativa de login com email não cadastrado: ${cleanEmail}`, 'FAILED');
      return { success: false, message: 'Usuário ou senha não encontrados no sistema.' };
    }

    if (foundUser.status === 'SUSPENDED') {
      addAccessLog(`Acesso bloqueado: usuário suspenso (${cleanEmail})`, 'WARNING');
      return { success: false, message: 'Esta conta está suspensa pela coordenação geral.' };
    }

    // Update lastLogin
    const updatedUser = {
      ...foundUser,
      lastLogin: 'Agora mesmo'
    };

    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    addAccessLog(`Login efetuado com sucesso por ${updatedUser.name} (${updatedUser.jobTitle})`, 'SUCCESS');

    return { success: true, message: `Bem-vindo(a), ${updatedUser.name}!` };
  };

  const quickLogin = (userId: string) => {
    const targetUser = allUsers.find(u => u.id === userId) || DEFAULT_GLOBAL_USER;
    const updatedUser = {
      ...targetUser,
      lastLogin: 'Agora mesmo'
    };
    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    addAccessLog(`Troca rápida de perfil: ${updatedUser.name} [${updatedUser.isGlobalAccess ? 'ACESSO GLOBAL' : updatedUser.role}]`, 'SUCCESS');
  };

  const logout = () => {
    addAccessLog(`Logout efetuado por ${currentUser.name}`, 'SUCCESS');
    setIsAuthenticated(false);
    // Keep DEFAULT_GLOBAL_USER as fallback ready for quick re-login
    setCurrentUser(DEFAULT_GLOBAL_USER);
  };

  const register = async (userData: Partial<UserProfile>): Promise<{ success: boolean; message?: string }> => {
    if (!userData.name || !userData.email) {
      return { success: false, message: 'Nome e E-mail são obrigatórios.' };
    }

    const cleanEmail = userData.email.trim().toLowerCase();
    if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Já existe um usuário cadastrado com este e-mail.' };
    }

    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: userData.name,
      email: cleanEmail,
      role: userData.role || UserRole.SUPPORTER,
      isGlobalAccess: userData.role === UserRole.ADMIN,
      phone: userData.phone || '(11) 98888-0000',
      cpf: userData.cpf || '',
      electoralTitle: userData.electoralTitle || '',
      jobTitle: userData.jobTitle || 'Membro de Campanha',
      party: userData.party || 'PVOT (45)',
      coalition: userData.coalition || 'Coligação Futuro & Vitória',
      territory: userData.territory || 'Geral',
      votingZone: userData.votingZone || 'Zona 001',
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: userData.bio || 'Membro cadastrado na plataforma eleitoral.',
      twoFactorEnabled: false,
      permissions: userData.role === UserRole.ADMIN ? SYSTEM_PERMISSIONS.map(p => p.id) : ['VOTERS_FULL', 'MEETINGS_MANAGE'],
      notificationPreferences: {
        email: true,
        push: true,
        urgentAlerts: true,
        whatsapp: true
      },
      themePreference: 'light',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      lastLogin: 'Primeiro acesso',
      status: 'ACTIVE'
    };

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    addAccessLog(`Novo usuário cadastrado e autenticado: ${newUser.name}`, 'SUCCESS');

    return { success: true, message: 'Cadastro concluído com sucesso!' };
  };

  const updateProfile = async (updatedData: Partial<UserProfile>): Promise<{ success: boolean; message?: string }> => {
    const updated: UserProfile = {
      ...currentUser,
      ...updatedData
    };

    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    addAccessLog(`Perfil atualizado por ${updated.name}`, 'SUCCESS');
    return { success: true, message: 'Perfil atualizado com sucesso!' };
  };

  const createUser = async (userData: Partial<UserProfile>): Promise<{ success: boolean; user?: UserProfile; message?: string }> => {
    if (!userData.name || !userData.email) {
      return { success: false, message: 'Nome e E-mail são obrigatórios.' };
    }

    const cleanEmail = userData.email.trim().toLowerCase();
    if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Já existe um usuário com este e-mail.' };
    }

    const isGlobal = userData.isGlobalAccess ?? (userData.role === UserRole.ADMIN);

    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: userData.name,
      email: cleanEmail,
      role: userData.role || UserRole.LEADER,
      isGlobalAccess: isGlobal,
      phone: userData.phone || '(11) 98888-0000',
      cpf: userData.cpf || '',
      electoralTitle: userData.electoralTitle || '',
      jobTitle: userData.jobTitle || 'Colaborador de Campanha',
      party: userData.party || 'PVOT (45)',
      coalition: userData.coalition || 'Coligação Futuro & Vitória',
      territory: userData.territory || 'Geral',
      votingZone: userData.votingZone || 'Zona 001',
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: userData.bio || '',
      twoFactorEnabled: false,
      permissions: isGlobal ? SYSTEM_PERMISSIONS.map(p => p.id) : (userData.permissions || ['MEETINGS_MANAGE', 'VOTERS_FULL']),
      notificationPreferences: {
        email: true,
        push: true,
        urgentAlerts: true,
        whatsapp: true
      },
      themePreference: 'light',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      lastLogin: 'Nunca acessou',
      status: 'ACTIVE'
    };

    setAllUsers(prev => [newUser, ...prev]);
    addAccessLog(`Novo usuário criado pela administração: ${newUser.name} (${newUser.jobTitle})`, 'SUCCESS');
    return { success: true, user: newUser, message: 'Usuário adicionado com sucesso!' };
  };

  const deleteUser = async (userId: string): Promise<{ success: boolean; message?: string }> => {
    if (userId === DEFAULT_GLOBAL_USER.id) {
      return { success: false, message: 'O Usuário Padrão com Acesso Global não pode ser excluído.' };
    }
    if (userId === currentUser.id) {
      return { success: false, message: 'Você não pode excluir sua própria conta enquanto estiver logado nela.' };
    }

    const userToDelete = allUsers.find(u => u.id === userId);
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    addAccessLog(`Usuário removido da campanha: ${userToDelete?.name || userId}`, 'WARNING');
    return { success: true, message: 'Usuário removido da campanha.' };
  };

  const toggleTwoFactor = async (): Promise<{ success: boolean; enabled: boolean }> => {
    const nextState = !currentUser.twoFactorEnabled;
    const updated = { ...currentUser, twoFactorEnabled: nextState };
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    addAccessLog(`Autenticação de Dois Fatores (2FA) ${nextState ? 'ATIVADA' : 'DESATIVADA'}`, 'SUCCESS');
    return { success: true, enabled: nextState };
  };

  const changePassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; message?: string }> => {
    if (!newPass || newPass.length < 6) {
      return { success: false, message: 'A nova senha deve ter no mínimo 6 caracteres.' };
    }
    addAccessLog(`Senha de acesso alterada com sucesso para ${currentUser.name}`, 'SUCCESS');
    return { success: true, message: 'Senha atualizada com segurança!' };
  };

  const resetPasswordRequest = async (email: string): Promise<{ success: boolean; message?: string }> => {
    addAccessLog(`Solicitação de redefinição de senha para: ${email}`, 'SUCCESS');
    return { success: true, message: 'Instruções e código de redefinição enviados com sucesso para o e-mail informado!' };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        allUsers,
        accessLogs,
        isGlobalAdmin,
        login,
        quickLogin,
        logout,
        register,
        updateProfile,
        createUser,
        deleteUser,
        toggleTwoFactor,
        changePassword,
        resetPasswordRequest,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
