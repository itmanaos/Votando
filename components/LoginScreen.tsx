import React, { useState } from 'react';
import { 
  Shield, Lock, Mail, User, Phone, CheckCircle2, ArrowRight, 
  Sparkles, KeyRound, Globe, Eye, EyeOff, AlertCircle, RefreshCw,
  UserCheck, ShieldAlert, Vote, Award, Building2
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { UserRole } from '../types';
import { useToast } from './Toast';

interface LoginScreenProps {
  onSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const { login, register, quickLogin, resetPasswordRequest, allUsers } = useAuth();
  const { addToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@votando.eleicoes.br');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    phone: '',
    role: UserRole.LEADER,
    jobTitle: 'Líder de Mobilização',
    territory: 'Zona Sul',
    password: '',
    confirmPassword: ''
  });

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        addToast({
          title: 'Autenticado com Sucesso!',
          description: res.message || 'Sessão iniciada na plataforma eleitoral.',
          type: 'success'
        });
        if (onSuccess) onSuccess();
      } else {
        setError(res.message || 'Erro ao realizar login.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado no servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (regData.password && regData.password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (regData.password !== regData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: regData.name,
        email: regData.email,
        phone: regData.phone,
        role: regData.role,
        jobTitle: regData.jobTitle,
        territory: regData.territory,
        password: regData.password
      });

      if (res.success) {
        addToast({
          title: 'Cadastro Concluído!',
          description: 'Sua conta foi criada e autenticada com sucesso.',
          type: 'success'
        });
        if (onSuccess) onSuccess();
      } else {
        setError(res.message || 'Erro ao realizar cadastro.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await resetPasswordRequest(forgotEmail);
      if (res.success) {
        setForgotSent(true);
        addToast({
          title: 'Instruções Enviadas',
          description: 'Verifique a caixa de entrada do e-mail informado.',
          type: 'info'
        });
      } else {
        setError(res.message || 'Erro ao solicitar redefinição.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar solicitação.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLoginClick = (userId: string) => {
    quickLogin(userId);
    addToast({
      title: 'Acesso Rápido Ativado',
      description: 'Você entrou no sistema com o perfil selecionado.',
      type: 'success'
    });
    if (onSuccess) onSuccess();
  };

  const globalAdminUser = allUsers.find(u => u.isGlobalAccess || u.role === UserRole.ADMIN);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background Graphic Accents */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="w-full max-w-5xl z-10 flex flex-col lg:flex-row bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Left Side: Brand & Global User Quick Highlight */}
        <div className="lg:w-5/12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-500/30 text-white">
                V
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-black text-xl tracking-tight uppercase">VOTANDO</h1>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-black rounded-md uppercase">
                    PRO 2024
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Electoral Intelligence & Command</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h2 className="text-2xl font-black text-white leading-tight">
                Plataforma de Gestão Eleitoral & Inteligência Política
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Acesse o painel central de comando da campanha com controle de eleitores, auditoria de público (Jacobs), compliance do TSE e coordenação de equipes em campo.
              </p>
            </div>

            {/* DEFAULT GLOBAL USER BANNER */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-teal-500/20 border border-blue-500/40 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-300">
                  <CrownIcon />
                  Usuário Padrão com Acesso Global
                </span>
                <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-black rounded-md">
                  SUPER ADMIN
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nome:</span>
                  <strong className="text-white">Administrador Master</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">E-mail:</span>
                  <span className="font-mono text-blue-300 font-bold">{globalAdminUser?.email || 'admin@votando.eleicoes.br'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Senha Padrão:</span>
                  <span className="font-mono text-emerald-300 font-bold">admin123</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1 border-t border-white/10">
                  <span className="text-slate-400">Escopo:</span>
                  <span className="text-amber-200 font-semibold">Irrestrito (Todos os Módulos)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickLoginClick(globalAdminUser?.id || 'usr-admin-global')}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Sparkles size={14} className="text-amber-300" />
                <span>Entrar Imediatamente como Admin Global</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Quick Switch Profiles Carousel */}
          <div className="pt-6 mt-6 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              Outros Perfis de Demonstração (RBAC):
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {allUsers.filter(u => !u.isGlobalAccess && u.role !== UserRole.ADMIN).slice(0, 4).map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickLoginClick(user.id)}
                  className="p-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl text-left transition-all group cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-white group-hover:text-blue-300 truncate">
                    {user.name.split(' ')[0]} ({user.role})
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">
                    {user.territory}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form Authentication Container */}
        <div className="lg:w-7/12 p-8 sm:p-10 flex flex-col justify-center bg-slate-900/60">
          
          {/* Navigation Tabs (Login / Cadastro / Recuperação) */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Acessar Conta
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${
                  mode === 'register'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Novo Cadastro
              </button>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Shield size={13} />
              <span>Conexão Segura</span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-2.5 text-rose-300 text-xs animate-shake">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. LOGIN FORM                                                             */}
          {/* ========================================================================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-white">Entrar no Sistema</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Informe suas credenciais ou use o botão de login rápido com o usuário global.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail size={14} className="text-blue-400" />
                  <span>E-mail Corporativo ou de Campanha</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="seu.email@campanha.com.br"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock size={14} className="text-blue-400" />
                    <span>Senha de Acesso</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); }}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-11 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400">Permanecer conectado</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('admin@votando.eleicoes.br');
                    setLoginPassword('admin123');
                  }}
                  className="text-xs text-slate-400 hover:text-blue-400 underline font-medium"
                >
                  Preencher Admin Global
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar no Comitê Eleitoral</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 2. REGISTER FORM                                                          */}
          {/* ========================================================================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <h3 className="text-xl font-black text-white">Criar Nova Conta</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cadastre um membro da equipe com função e território específicos.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">E-mail *</label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@campanha.com.br"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Papel / Role</label>
                  <select
                    value={regData.role}
                    onChange={(e) => setRegData({ ...regData, role: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-medium cursor-pointer"
                  >
                    <option value={UserRole.ADMIN}>ADMIN (Acesso Global)</option>
                    <option value={UserRole.COORDINATOR}>COORDINATOR (Geral)</option>
                    <option value={UserRole.LEADER}>LEADER (Líder Territorial)</option>
                    <option value={UserRole.FISCAL}>FISCAL (Apuração)</option>
                    <option value={UserRole.SUPPORTER}>SUPPORTER (Apoiador)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Cargo / Função</label>
                  <input
                    type="text"
                    placeholder="Ex: Coordenador de Bairro"
                    value={regData.jobTitle}
                    onChange={(e) => setRegData({ ...regData, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Território / Zona</label>
                  <input
                    type="text"
                    placeholder="Ex: Zona Sul"
                    value={regData.territory}
                    onChange={(e) => setRegData({ ...regData, territory: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Senha de Acesso *</label>
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Confirmar Senha *</label>
                  <input
                    type="password"
                    required
                    placeholder="Repita a senha"
                    value={regData.confirmPassword}
                    onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  {loading ? 'Cadastrando...' : 'Concluir Cadastro & Entrar'}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 3. FORGOT PASSWORD FORM                                                   */}
          {/* ========================================================================= */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-white">Recuperar Acesso</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Informe o e-mail cadastrado para receber instruções de recuperação segura.
                </p>
              </div>

              {forgotSent ? (
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Link de Recuperação Enviado!</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Enviamos um token seguro para <strong className="text-white">{forgotEmail}</strong> com validade de 30 minutos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setForgotSent(false); }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
                  >
                    Voltar ao Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">E-mail Cadastrado</label>
                    <input
                      type="email"
                      required
                      placeholder="seu.email@campanha.com.br"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md"
                    >
                      {loading ? 'Enviando...' : 'Enviar Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Footer Security Notice */}
          <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Votando Electoral v2.4</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Lock size={11} /> Criptografia AES-256
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

const CrownIcon = () => (
  <svg className="w-3.5 h-3.5 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
);
