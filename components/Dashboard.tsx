
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Target, UserPlus, FileSearch, TrendingUp } from 'lucide-react';
import { MOCK_VOTERS, MOCK_POLLS } from '../constants';

const Dashboard: React.FC = () => {
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
      {/* Header Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className={`${s.bg} ${s.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm`}>
              <s.icon size={24} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Evolução Intenção de Voto
            </h3>
            <select className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none hover:bg-slate-100 transition-colors">
              <option>Últimos 3 Meses</option>
              <option>Semana Atual</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_POLLS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="candidateA" stroke="#3b82f6" strokeWidth={4} dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} name="Nosso Candidato" />
                <Line type="monotone" dataKey="candidateB" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} name="Oponente" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-8">
            <Users size={20} className="text-teal-500" />
            Distribuição de Apoio
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-[250px] w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={8}
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
            <div className="w-full sm:w-1/2 space-y-3">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-800">{((item.value / 1000) * 100).toFixed(0)}%</span>
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
