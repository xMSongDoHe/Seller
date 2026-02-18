
import React, { useState } from 'react';
import { Plus, Trash2, X, Edit2, Save, Image as ImageIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Category } from '../types';

const Management: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', imageUrl: '' });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', imageUrl: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, imageUrl: cat.imageUrl });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.imageUrl) {
      if (editingCategory) {
        updateCategory(editingCategory.id, formData.name, formData.imageUrl);
      } else {
        addCategory(formData.name, formData.imageUrl);
      }
      setIsModalOpen(false);
      setFormData({ name: '', imageUrl: '' });
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCategory(id);
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">จัดการหมวดหมู่</h2>
        <p className="text-slate-400 max-w-lg">เพิ่ม แก้ไข หรือลบหมวดหมู่ไอดีเกมของคุณ เพื่อการจัดระเบียบข้อมูลที่ดียิ่งขึ้น</p>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-8 py-4 bg-lime-400 text-slate-900 font-bold rounded-2xl hover:bg-lime-300 transition-all shadow-xl shadow-lime-400/20 active:scale-95"
        >
          <Plus size={20} />
          <span>เพิ่มหมวดหมู่ใหม่</span>
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {categories.map((cat) => (
          <div key={cat.id} className="relative group">
            <div className="relative w-full aspect-[16/10] rounded-[2rem] overflow-hidden border border-slate-700/50 shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:border-lime-400/30">
              <img 
                src={cat.imageUrl} 
                alt={cat.name} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex flex-col justify-end p-6">
                <h4 className="text-2xl font-bold text-white text-center mb-2 drop-shadow-lg">{cat.name}</h4>
              </div>

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-transform">
                <button 
                  onClick={() => handleOpenEdit(cat)}
                  className="p-3 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-lime-400 hover:text-slate-900 transition-all shadow-lg"
                  title="แก้ไข"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={(e) => handleDelete(cat.id, e)}
                  className="p-3 bg-white/10 backdrop-blur-md text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                  title="ลบ"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <form onSubmit={handleSubmit} className="bg-[#1e293b] w-full max-w-md rounded-[2.5rem] p-8 border border-slate-700 shadow-2xl relative animate-in zoom-in-95">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              {editingCategory ? <Edit2 className="text-lime-400" /> : <Plus className="text-lime-400" />}
              {editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">ชื่อหมวดหมู่</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-lime-400/50 transition-all text-white"
                  placeholder="เช่น Blox Fruit, Cyborg..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">ลิงก์รูปภาพ (URL)</label>
                <div className="relative">
                  <input 
                    type="url" 
                    required
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-lime-400/50 transition-all text-white text-sm"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                </div>
              </div>

              {formData.imageUrl && (
                <div className="mt-2 rounded-2xl overflow-hidden border border-slate-700 aspect-video relative">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-50" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=Invalid+Image+URL'; }} />
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 font-bold uppercase tracking-widest bg-black/20">Preview Image</div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-lime-400 text-slate-900 font-bold py-4 rounded-2xl hover:bg-lime-300 transition-all mt-4 shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2 text-lg active:scale-95"
              >
                {editingCategory ? <Save size={20} /> : <Plus size={20} />}
                <span>{editingCategory ? 'บันทึกการแก้ไข' : 'บันทึกหมวดหมู่'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Management;
