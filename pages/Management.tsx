
import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useData } from '../context/DataContext';

const Management: React.FC = () => {
  const { categories, addCategory } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', imageUrl: '' });

  const handleAdd = () => {
    if (newCat.name && newCat.imageUrl) {
      addCategory(newCat.name, newCat.imageUrl);
      setNewCat({ name: '', imageUrl: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <header className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-5xl font-bold tracking-tight">จัดการหมวดหมู่</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-8 py-3 bg-lime-400 text-slate-900 font-bold rounded-2xl hover:bg-lime-300 transition-all shadow-xl shadow-lime-400/10"
        >
          <Plus size={20} />
          <span>+ID GAME (เพิ่มหมวดหมู่)</span>
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {categories.map((cat) => (
          <div key={cat.id} className="flex flex-col items-center group">
            <div className="relative w-full aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-slate-700 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
              <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent flex flex-col justify-end p-6">
                <h4 className="text-3xl font-bold text-cyan-400 text-center mb-4">{cat.name}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal เพิ่มหมวดหมู่ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e293b] w-full max-w-md rounded-3xl p-8 border border-slate-700 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X /></button>
            <h3 className="text-2xl font-bold mb-6">เพิ่มหมวดหมู่ใหม่</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">ชื่อหมวดหมู่</label>
                <input 
                  type="text" 
                  value={newCat.name}
                  onChange={e => setNewCat({...newCat, name: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="เช่น Cyborg, Leopard..."
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">ลิงก์รูปภาพ (URL)</label>
                <input 
                  type="text" 
                  value={newCat.imageUrl}
                  onChange={e => setNewCat({...newCat, imageUrl: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="https://..."
                />
              </div>
              <button 
                onClick={handleAdd}
                className="w-full bg-lime-400 text-slate-900 font-bold py-3 rounded-xl hover:bg-lime-300 transition-all mt-4"
              >
                บันทึกหมวดหมู่
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;
