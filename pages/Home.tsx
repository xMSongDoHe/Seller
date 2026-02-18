
import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, CreditCard, Calendar, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';
import { IDStatus } from '../types';

const Home: React.FC = () => {
  const { ids, expenses } = useData();

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const thisMonthStr = todayStr.substring(0, 7); // YYYY-MM
  const thisYearStr = todayStr.substring(0, 4); // YYYY

  const stats = useMemo(() => {
    const calculate = (periodIds: any[], periodExpenses: any[]) => {
      const profit = periodIds
        .filter(id => id.status === IDStatus.SOLD)
        .reduce((acc, curr) => acc + curr.profit, 0);
      const expense = periodExpenses.reduce((acc, curr) => acc + curr.amount, 0);
      return { profit, expense, net: profit - expense };
    };

    return {
      today: calculate(
        ids.filter(id => id.dateAdded === todayStr),
        expenses.filter(e => e.date === todayStr)
      ),
      month: calculate(
        ids.filter(id => id.dateAdded.startsWith(thisMonthStr)),
        expenses.filter(e => e.date.startsWith(thisMonthStr))
      ),
      year: calculate(
        ids.filter(id => id.dateAdded.startsWith(thisYearStr)),
        expenses.filter(e => e.date.startsWith(thisYearStr))
      )
    };
  }, [ids, expenses, todayStr, thisMonthStr, thisYearStr]);

  // สรุปข้อมูลรายเดือนสำหรับกราฟ (6 เดือนย้อนหลัง)
  const chartData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStr = d.toISOString().substring(0, 7);
      const mName = d.toLocaleDateString('th-TH', { month: 'short' });
      
      const mProfit = ids
        .filter(id => id.dateAdded.startsWith(mStr) && id.status === IDStatus.SOLD)
        .reduce((acc, curr) => acc + curr.profit, 0);
        
      months.push({ name: mName, profit: mProfit });
    }
    return months;
  }, [ids]);

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Financial Dashboard</h2>
          <p className="text-slate-400 flex items-center gap-2">
            <Calendar size={16} className="text-emerald-400" />
            ข้อมูลอัปเดต ณ วันที่ {new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today Section */}
        <PeriodSection title="วันนี้ (TODAY)" stats={stats.today} accentColor="emerald" />
        {/* Monthly Section */}
        <PeriodSection title="เดือนนี้ (MONTHLY)" stats={stats.month} accentColor="blue" />
        {/* Yearly Section */}
        <PeriodSection title="ปีนี้ (YEARLY)" stats={stats.year} accentColor="purple" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="xl:col-span-2 bg-[#1e293b] p-6 rounded-[2rem] border border-slate-700/50 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <BarChart3 className="text-emerald-400" />
              แนวโน้มรายได้ (6 เดือนล่าสุด)
            </h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `฿${value >= 1000 ? value/1000 + 'k' : value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  cursor={{ stroke: '#334155', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                  strokeWidth={4} 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-[#1e293b] p-6 rounded-[2rem] border border-slate-700/50 shadow-xl flex flex-col space-y-6">
          <h3 className="text-xl font-bold">ข้อมูลเสริม</h3>
          <div className="space-y-4 flex-1">
            <InsightCard 
              label="ไอดีที่ขายได้ทั้งหมด" 
              value={ids.filter(id => id.status === IDStatus.SOLD).length} 
              subValue="รายการ"
              icon={<ArrowUpRight className="text-emerald-400" />}
            />
            <InsightCard 
              label="ไอดีพร้อมขาย" 
              value={ids.filter(id => id.status === IDStatus.AVAILABLE).length} 
              subValue="รายการ"
              icon={<DollarSign className="text-blue-400" />}
            />
            <InsightCard 
              label="รวมรายจ่ายสะสม" 
              value={`฿${expenses.reduce((a, b) => a + b.amount, 0).toLocaleString()}`} 
              subValue=""
              icon={<ArrowDownRight className="text-red-400" />}
            />
          </div>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Tip</p>
            <p className="text-sm text-slate-300 italic leading-relaxed">"หมั่นตรวจสอบรายจ่ายแฝงเพื่อให้กำไรสุทธิของคุณสูงที่สุด"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PeriodSection: React.FC<{ title: string; stats: { profit: number; expense: number; net: number }; accentColor: string }> = ({ title, stats, accentColor }) => {
  const colors: any = {
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20'
  };

  return (
    <div className="bg-[#1e293b] rounded-[2.5rem] p-8 border border-slate-700/50 shadow-2xl space-y-6 hover:shadow-emerald-500/5 transition-all group overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${accentColor}-500/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-emerald-500/10 transition-all`}></div>
      
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${colors[accentColor]}`}>
          <Calendar size={18} />
        </div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
      </div>

      <div className="space-y-5">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span>รายได้ (Gross)</span>
            <DollarSign size={14} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400">฿ {stats.profit.toLocaleString()}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span>รายจ่าย (Cost)</span>
            <CreditCard size={14} className="text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">฿ {stats.expense.toLocaleString()}</p>
        </div>

        <div className="pt-5 border-t border-slate-700/50 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span>กำไรสุทธิ (Net)</span>
            <TrendingUp size={14} className="text-indigo-400" />
          </div>
          <p className="text-4xl font-black text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]">฿ {stats.net.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

const InsightCard: React.FC<{ label: string; value: string | number; subValue: string; icon: React.ReactNode }> = ({ label, value, subValue, icon }) => (
  <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl flex items-center justify-between hover:bg-slate-800 transition-colors">
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-white">{value}</span>
        <span className="text-xs text-slate-400">{subValue}</span>
      </div>
    </div>
    <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
      {icon}
    </div>
  </div>
);

export default Home;
