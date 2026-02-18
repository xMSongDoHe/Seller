
import React, { useState } from 'react';
import { Plus, Trash2, ArrowDownRight, TrendingDown, X } from 'lucide-react';
import { useData } from '../context/DataContext';

const Expenses: React.FC = () => {
  const { expenses, addExpense, deleteExpense } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExp, setNewExp] = useState({ title: '', amount: '' });

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleAdd = () => {
    if (newExp.title && newExp.amount) {
      addExpense(newExp.title, parseFloat(newExp.amount));
      setNewExp({ title: '', amount: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold">Expenses</h2>
          <p className="text-slate-400">รายการรายจ่ายและการลงทุน</p>
        </div>
        <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20 text-right min-w-[200px]">
           <div className="flex items-center justify-end gap-2 text-red-400 mb-1">
             <TrendingDown size={18} />
             <span className="text-sm uppercase font-bold tracking-widest">Total Out</span>
           </div>
           <p className="text-4xl font-bold text-red-400">฿ {totalExpenses.toLocaleString()}</p>
        </div>
      </header>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full py-4 bg-slate-800 rounded-2xl border-2 border-dashed border-slate-700 hover:border-red-500/50 hover:bg-slate-700/50 transition-all flex items-center justify-center gap-3 text-slate-400 hover:text-red-400 group"
      >
        <Plus size={20} />
        <span className="font-semibold">เพิ่มรายการรายจ่ายใหม่</span>
      </button>

      <div className="space-y-4">
        {expenses.map(exp => (
          <div key={exp.id} className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 flex items-center justify-between group">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                   <ArrowDownRight size={24} />
                </div>
                <div>
                   <p className="font-bold text-lg">{exp.title}</p>
                   <p className="text-sm text-slate-500">{exp.date}</p>
                </div>
             </div>
             <div className="flex items-center gap-6">
                <p className="text-xl font-bold text-red-400">- ฿ {exp.amount.toLocaleString()}</p>
                <button onClick={() => deleteExpense(exp.id)} className="p-2 text-slate-600 hover:text-red-400 transition-all">
                   <Trash2 size={20} />
                </button>
             </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e293b] w-full max-w-md rounded-3xl p-8 border border-slate-700 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X /></button>
            <h3 className="text-2xl font-bold mb-6">บันทึกรายจ่าย</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="รายการ (เช่น ค่าแอด, ค่าน้ำมัน)"
                value={newExp.title}
                onChange={e => setNewExp({...newExp, title: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
              />
              <input 
                type="number" 
                placeholder="จำนวนเงิน"
                value={newExp.amount}
                onChange={e => setNewExp({...newExp, amount: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
              />
              <button onClick={handleAdd} className="w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-400 mt-4">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
