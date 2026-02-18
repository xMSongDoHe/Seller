
import React from 'react';
import { TrendingUp, DollarSign, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';
import { IDStatus } from '../types';

const Home: React.FC = () => {
  const { ids, expenses } = useData();

  const totalProfit = ids
    .filter(id => id.status === IDStatus.SOLD)
    .reduce((acc, curr) => acc + curr.profit, 0);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalProfit - totalExpenses;

  const data = [
    { name: 'Jan', profit: totalProfit * 0.2 },
    { name: 'Feb', profit: totalProfit * 0.4 },
    { name: 'Mar', profit: totalProfit * 0.3 },
    { name: 'Current', profit: totalProfit },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-slate-400">สรุปภาพรวมกำไรและสถานะทั้งหมด</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="กำไรรวม (ยังไม่หักลบ)" value={`฿ ${totalProfit.toLocaleString()}`} change="+100%" icon={<DollarSign className="text-emerald-400" />} color="emerald" />
        <StatCard title="รายจ่ายทั้งหมด" value={`฿ ${totalExpenses.toLocaleString()}`} change="Cost" icon={<TrendingUp className="text-red-400" />} color="red" />
        <StatCard title="กำไรสุทธิ" value={`฿ ${netProfit.toLocaleString()}`} change="Net" icon={<Package className="text-cyan-400" />} color="cyan" />
      </div>

      <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
        <h3 className="text-xl font-semibold mb-6">แนวโน้มกำไรสะสม</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; change: string; icon: React.ReactNode; color: string }> = ({ title, value, change, icon }) => (
  <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-slate-800">{icon}</div>
      <span className="text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-lg">{change}</span>
    </div>
    <p className="text-slate-400 text-sm">{title}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

export default Home;
