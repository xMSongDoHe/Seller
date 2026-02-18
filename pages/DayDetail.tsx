
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Wallet, ShoppingBag, Eye, X, CheckCircle2, ListPlus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { IDStatus } from '../types';

const DayDetail: React.FC = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const { categories, ids, addIDs } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newID, setNewID] = useState({ category: '', names: '', profit: '', details: '' });

  const dailyIDs = ids.filter(id => id.dateAdded === date);
  const dailyProfit = dailyIDs.filter(id => id.status === IDStatus.SOLD).reduce((acc, curr) => acc + curr.profit, 0);
  const soldCount = dailyIDs.filter(id => id.status === IDStatus.SOLD).length;

  const handleAddIDs = () => {
    if (newID.category && newID.names && newID.profit) {
      // Split names by new lines and filter out empty strings
      const nameList = newID.names.split('\n').map(n => n.trim()).filter(n => n.length > 0);
      
      const idsToAdd = nameList.map(name => ({
        category: newID.category,
        name: name,
        profit: parseFloat(newID.profit),
        details: newID.details,
        status: IDStatus.AVAILABLE
      }));

      addIDs(idsToAdd);
      setIsModalOpen(false);
      setNewID({ category: '', names: '', profit: '', details: '' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/status')} className="flex items-center justify-center w-10 h-10 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"><ChevronLeft /></button>
          <h2 className="text-2xl font-bold bg-slate-800 px-6 py-2 rounded-xl border border-slate-700">วันที่ {date}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/expenses" className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20"><Wallet size={18} /><span>รายจ่ายวันนี้</span></Link>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-lime-400 text-slate-900 font-bold rounded-xl shadow-lg hover:bg-lime-300 transition-all"><Plus size={18} /><span>+ID GAME (Bulk)</span></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex items-center gap-6 shadow-lg">
           <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-3xl font-bold">฿</div>
           <div><p className="text-3xl font-bold text-emerald-400">฿ {dailyProfit.toLocaleString()}</p><p className="text-slate-400">กำไรขายได้วันนี้</p></div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col justify-center shadow-lg">
            <div className="flex items-center gap-2 text-xl font-semibold mb-2"><CheckCircle2 className="text-emerald-400" /><span>ขายได้วันนี้: {soldCount} ไอดี</span></div>
            <div className="flex items-center gap-2 text-slate-400"><ShoppingBag size={18} /><span>รวมทั้งหมดในระบบ: {ids.length}</span></div>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-12 mb-4 flex items-center gap-2">
        <ListPlus className="text-cyan-400" />
        คลิกเลือกหมวดหมู่เพื่อดูไอดี
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => {
          const catIDs = ids.filter(id => id.category === cat.name);
          const catProfit = catIDs.filter(id => id.status === IDStatus.SOLD).reduce((acc, curr) => acc + curr.profit, 0);
          return (
            <Link key={cat.id} to={`/category/${cat.name}`} className="group relative bg-[#1e293b] rounded-3xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-all shadow-xl">
              <div className="aspect-[4/3] w-full relative">
                <img src={cat.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80" alt={cat.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <div className="absolute bottom-4 left-4"><h4 className="text-2xl font-bold text-cyan-400 drop-shadow-md">{cat.name}</h4></div>
              </div>
              <div className="p-4 space-y-1 bg-slate-800/80 backdrop-blur-md">
                 <div className="flex justify-between text-sm"><span className="text-slate-400 font-medium">กำไรหมวดนี้:</span><span className="text-emerald-400 font-bold">฿ {catProfit.toLocaleString()}</span></div>
                 <div className="flex justify-between text-sm"><span className="text-slate-400 font-medium">จำนวนไอดี:</span><span className="text-blue-400 font-bold">{catIDs.length}</span></div>
              </div>
            </Link>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#1e293b] w-full max-w-lg rounded-3xl p-8 border border-slate-700 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Plus className="text-lime-400" />
              เพิ่มไอดีเกมใหม่ (ทีละหลายไอดี)
            </h3>
            <p className="text-slate-400 text-sm mb-6">กรอกชื่อไอดีโดยการขึ้นบรรทัดใหม่ 1 บรรทัด = 1 ไอดี</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">หมวดหมู่</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-lime-400/50 transition-all appearance-none"
                  value={newID.category}
                  onChange={e => setNewID({...newID, category: e.target.value})}
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">รายชื่อไอดี (1 บรรทัดต่อ 1 ไอดี)</label>
                <textarea 
                  placeholder="user1:pass1&#10;user2:pass2&#10;user3:pass3" 
                  value={newID.names} 
                  onChange={e => setNewID({...newID, names: e.target.value})} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-lime-400/50 transition-all font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">กำไรต่อไอดี (฿)</label>
                  <input 
                    type="number" 
                    placeholder="Profit" 
                    value={newID.profit} 
                    onChange={e => setNewID({...newID, profit: e.target.value})} 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-lime-400/50 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">รายละเอียดเสริม</label>
                  <input 
                    placeholder="เช่น V4 Full" 
                    value={newID.details} 
                    onChange={e => setNewID({...newID, details: e.target.value})} 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-lime-400/50 transition-all" 
                  />
                </div>
              </div>

              <button 
                onClick={handleAddIDs} 
                className="w-full bg-lime-400 text-slate-900 font-bold py-4 rounded-xl mt-4 hover:bg-lime-300 active:scale-[0.98] transition-all shadow-lg shadow-lime-400/20 text-lg"
              >
                บันทึกไอดีทั้งหมด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayDetail;
