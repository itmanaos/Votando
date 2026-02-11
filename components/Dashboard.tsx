
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { Users, Target, UserPlus, FileSearch, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { MOCK_VOTERS, MOCK_TEAMS, MOCK_POLLS } from '../constants';
import { getCampaignInsights } from '../geminiService';

const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<{insight: string, action: string}[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const res = await getCampaignInsights(MOCK_VOTERS, MOCK_POLLS);
      setInsights(res);
      setLoadingInsights(false);
    };
    fetchInsights();
  }, []);

  const stats = [
    { label: 'Eleitores', value: '4.2k', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Apoiadores', value: '840', icon: UserPlus, color: 'text-teal-600', bg: 'bg-teal-100' },
    { label: 'Equipes', value: '12', icon: Target, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Pesquisas', value: '15', icon: FileSearch, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const pieData = [
    { name: 'Fiel', value: 400, color: '#10b981' },
    { name: 'Indeciso', value: 300, color: '#f59e0b' },
    { name: 'Oposição', value: 200, color: '#ef4444' },
    { name: 'Neutro', value: 100, color: '#94a3b8' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className={`${s.bg} ${s.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                  <s.icon size={20} />
                </div>
                <p className="text-slate-500 text-sm font-medium">{s.label}</p>
                <h3 className="text-2xl font-bold text-slate-800">{s.value}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap size={80} />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-amber-400" size={20} />
            <h3 className="font-bold text-lg">IA: Insights Estratégicos</h3>
          </div>
          <div className="space-y-4">
            {loadingInsights ? (
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded"></div>
                </div>
              </div>
            ) : (
              insights.map((ins, i) => (
                <div key={i} className="text-sm border-l-2 border-amber-400 pl-3 py-1">
                  <p className="font-medium text-slate-100">{ins.insight}</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Ação: {ins.action}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Evolução Intenção de Voto
            </h3>
            <select className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none">
              <option>Últimos 3 Meses</option>
              <option>Semana Atual</option>
            </select>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_POLLS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="candidateA" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} name="Nosso Candidato" />
                <Line type="monotone" dataKey="candidateB" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} name="Oponente" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Users size={20} className="text-teal-500" />
            Nível de Apoio (Base Cadastrada)
          </h3>
          <div className="flex items-center">
            <div className="h-[250px] w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-3 pl-4">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{((item.value / 1000) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
