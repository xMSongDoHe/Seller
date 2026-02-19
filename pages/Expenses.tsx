
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, ArrowDownRight, TrendingDown, X, Edit2, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Expense } from '../types';

const Expenses: React.FC = () => {
  const { expenses, addExpense, updateExpense, deleteExpense } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({ title: '', amount: '' });

  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  // จัดกลุ่มรายจ่ายตามเดือน/ปี
  const groupedExpenses = useMemo(() => {
    const groups: Record<string, { label: string; total: number; items: Expense[] }> = {};
    
    expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).forEach(exp => {
      const date = new Date(exp.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const label = `${monthNames[date.getMonth()]} ${date.getFullYear() + 543}`;
      
      if (!groups[key]) {
        groups[key] = { label, total: 0, items: [] };
      }
      groups[key].items.push(exp);
      groups[key].total += exp.amount;
    });
    
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [expenses]);

  const totalAllTime = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleOpenAdd = () => {
    setEditingExp(null);
    setFormData({ title: '', amount: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Expense) => {
    setEditingExp(exp);
    setFormData({ title: exp.title, amount: exp.amount.toString() });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (formData.title && formData.amount) {
      if (editingExp) {
        updateExpense(editingExp.id, formData.title, parseFloat(formData.amount));
      } else {
        addExpense(formData.title, parseFloat(formData.amount));
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Banner Action Button moved to Top */}
      <button 
        onClick={handleOpenAdd}
        className="w-full py-8 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-[2.5rem] border-2 border-dashed border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 transition-all flex items-center justify-center gap-4 text-slate-400 hover:text-red-400 group shadow-2xl active:scale-[0.99]"
      >
        <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all shadow-lg">
          <Plus size={28} />
        </div>
        <div className="text-left">
          <span className="font-black text-xl block text-white group-hover:text-red-400 transition-colors">เพิ่มรายการรายจ่ายใหม่</span>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Add New Expense Record</span>
        </div>
      </button>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
        <div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">Expense Management</h2>
          <p className="text-slate-400">ตรวจสอบและบันทึกรายจ่ายทั้งหมดในระบบของคุณ</p>
        </div>
        <div className="bg-red-500/10 p-6 px-8 rounded-[2rem] border border-red-500/20 text-right min-w-[280px] shadow-xl shadow-red-500/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingDown size={64} className="text-red-400" />
           </div>
           <div className="flex items-center justify-end gap-2 text-red-400 mb-1 relative z-10">
             <span className="text-[10px] uppercase font-black tracking-[0.2em]">Total Accumulation</span>
           </div>
           <p className="text-4xl font-black text-red-400 relative z-10">฿ {totalAllTime.toLocaleString()}</p>
        </div>
      </header>

      {/* Expense List Grouped by Month */}
      <div className="space-y-12">
        {groupedExpenses.length === 0 ? (
          <div className="text-center py-20 text-slate-600 italic">ยังไม่มีรายการรายจ่ายในขณะนี้</div>
        ) : (
          groupedExpenses.map(([key, group]) => (
            <div key={key} className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 px-4">
                <div className="flex items-center gap-3 text-slate-100">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <Calendar size={20} />
                  </div>
                  <h3 className="font-black text-xl uppercase tracking-wider">{group.label}</h3>
                </div>
                <div className="bg-slate-800 px-4 py-1.5 rounded-full text-red-400 text-xs font-black border border-slate-700">
                  Total: ฿ {group.total.toLocaleString()}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {group.items.map(exp => (
                  <div key={exp.id} className="bg-[#1e293b] p-6 rounded-3xl border border-slate-700/50 flex items-center justify-between group hover:border-red-500/40 transition-all hover:translate-x-1 shadow-xl">
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 shadow-inner group-hover:scale-110 transition-transform">
                           <ArrowDownRight size={28} />
                        </div>
                        <div>
                           <p className="font-black text-xl text-slate-100">{exp.title}</p>
                           <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mt-0.5">
                              <Clock size={12} />
                              <span>{exp.date}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-8">
                        <p className="text-2xl font-black text-red-400">- ฿ {exp.amount.toLocaleString()}</p>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => handleOpenEdit(exp)} className="p-3 text-slate-400 hover:text-emerald-400 transition-all bg-slate-900/50 rounded-xl hover:bg-slate-900 border border-transparent hover:border-emerald-500/30">
                              <Edit2 size={18} />
                           </button>
                           <button onClick={() => deleteExpense(exp.id)} className="p-3 text-slate-400 hover:text-red-400 transition-all bg-slate-900/50 rounded-xl hover:bg-slate-900 border border-transparent hover:border-red-500/30">
                              <Trash2 size={18} />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#1e293b] w-full max-w-md rounded-[2.5rem] p-8 border border-slate-700 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              {editingExp ? <Edit2 className="text-emerald-400" /> : <Plus className="text-red-400" />}
              {editingExp ? 'แก้ไขรายจ่าย' : 'บันทึกรายจ่าย'}
            </h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">ชื่อรายการ</label>
                <input 
                  type="text" 
                  placeholder="เช่น ค่าโฆษณา, ค่าน้ำมัน"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-red-500/50 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">จำนวนเงิน (฿)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-red-500/50 transition-all outline-none font-black text-red-400 text-2xl"
                />
              </div>
              <button 
                onClick={handleSave} 
                className={`w-full ${editingExp ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-red-500 hover:bg-red-400'} text-slate-900 font-bold py-5 rounded-2xl mt-4 transition-all shadow-xl shadow-red-500/10 text-xl flex items-center justify-center gap-2`}
              >
                {editingExp ? <Edit2 size={24} /> : <Plus size={24} />}
                <span>{editingExp ? 'บันทึกการแก้ไข' : 'ยืนยันบันทึก'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Clock: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default Expenses;
