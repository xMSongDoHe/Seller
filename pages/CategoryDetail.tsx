
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Trash2, CheckCircle, XCircle, Search, Edit3, X, Save } from 'lucide-react';
import { useData } from '../context/DataContext';
import { IDStatus, GameID } from '../types';

const CategoryDetail: React.FC = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { ids, categories, deleteID, toggleIDStatus, bulkUpdateIDs } = useData();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for Bulk Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bulkEditData, setBulkEditData] = useState({
    category: '',
    profit: '',
    details: '',
    status: ''
  });

  const filteredIDs = ids
    .filter(id => id.category === categoryName)
    .filter(id => id.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredIDs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredIDs.map(id => id.id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${selectedIds.length} รายการนี้?`)) {
      selectedIds.forEach(id => deleteID(id));
      setSelectedIds([]);
    }
  };

  const handleBulkToggle = () => {
    selectedIds.forEach(id => toggleIDStatus(id));
    setSelectedIds([]);
  };

  const handleApplyBulkEdit = () => {
    const updates: Partial<GameID> = {};
    if (bulkEditData.category) updates.category = bulkEditData.category;
    if (bulkEditData.profit) updates.profit = parseFloat(bulkEditData.profit);
    if (bulkEditData.details) updates.details = bulkEditData.details;
    if (bulkEditData.status) updates.status = bulkEditData.status as IDStatus;

    bulkUpdateIDs(selectedIds, updates);
    setIsEditModalOpen(false);
    setSelectedIds([]);
    setBulkEditData({ category: '', profit: '', details: '', status: '' });
  };

  return (
    <div className="p-6 space-y-6 pb-32">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"><ChevronLeft /></button>
          <h2 className="text-3xl font-bold">หมวดหมู่: {categoryName}</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-4">
           <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700 w-full md:w-64">
              <Search size={18} className="text-slate-500 ml-2" />
              <input type="text" placeholder="ค้นหาไอดี..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-transparent border-none text-sm w-full focus:outline-none" />
           </div>
           <div className="text-sm text-slate-500">
             พบทั้งหมด {filteredIDs.length} ไอดี
           </div>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={filteredIDs.length > 0 && selectedIds.length === filteredIDs.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-600 bg-slate-800 text-emerald-500" 
                  />
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">ชื่อไอดี</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">กำไร</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">รายละเอียด</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">สถานะ</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredIDs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500 italic">ไม่พบข้อมูลไอดีในหมวดหมู่นี้</td>
                </tr>
              ) : (
                filteredIDs.map((item) => (
                  <tr key={item.id} className={`hover:bg-slate-800/50 transition-colors ${selectedIds.includes(item.id) ? 'bg-emerald-500/10' : ''}`}>
                    <td className="p-4 text-center">
                      <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} className="rounded border-slate-600 bg-slate-800 text-emerald-500" />
                    </td>
                    <td className="p-4 font-mono text-sm text-slate-200">{item.name}</td>
                    <td className="p-4 font-bold text-emerald-400">฿ {item.profit.toLocaleString()}</td>
                    <td className="p-4 text-sm text-slate-400">{item.details || '-'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === IDStatus.SOLD ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'}`}>
                        {item.status === IDStatus.SOLD ? 'SOLD' : 'AVAILABLE'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-4 justify-center">
                         <button title="สลับสถานะ" onClick={() => toggleIDStatus(item.id)} className="text-slate-500 hover:text-emerald-400 transition-colors"><CheckCircle size={18} /></button>
                         <button title="ลบ" onClick={() => deleteID(item.id)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#0f172a]/95 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl px-8 py-5 flex items-center gap-10 animate-in slide-in-from-bottom-10 z-50 ring-2 ring-emerald-500/30">
          <div className="flex flex-col">
            <span className="text-emerald-400 font-bold text-lg">{selectedIds.length} รายการ</span>
            <span className="text-xs text-slate-500">เลือกอยู่ขณะนี้</span>
          </div>
          <div className="h-8 w-px bg-slate-700"></div>
          <div className="flex items-center gap-8">
             <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2 text-slate-200 hover:text-emerald-400 font-semibold transition-all group">
               <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20"><Edit3 size={18} /></div>
               <span>แก้ไขที่เลือก</span>
             </button>
             <button onClick={handleBulkToggle} className="flex items-center gap-2 text-slate-200 hover:text-blue-400 font-semibold transition-all group">
               <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20"><CheckCircle size={18} /></div>
               <span>สลับสถานะ</span>
             </button>
             <button onClick={handleBulkDelete} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold transition-all group">
               <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20"><Trash2 size={18} /></div>
               <span>ลบทิ้ง</span>
             </button>
             <button onClick={() => setSelectedIds([])} className="text-slate-500 hover:text-white ml-2 transition-colors"><XCircle size={24} /></button>
          </div>
        </div>
      )}

      {/* Bulk Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#1e293b] w-full max-w-lg rounded-3xl p-8 border border-slate-700 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Edit3 className="text-emerald-400" />
              แก้ไข {selectedIds.length} ไอดีพร้อมกัน
            </h3>
            <p className="text-slate-400 text-sm mb-6">ทิ้งว่างไว้หากไม่ต้องการแก้ไขฟิลด์นั้นๆ</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1 tracking-wider">ย้ายหมวดหมู่</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none text-slate-200"
                  value={bulkEditData.category}
                  onChange={e => setBulkEditData({...bulkEditData, category: e.target.value})}
                >
                  <option value="">-- ไม่เปลี่ยนแปลง --</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1 tracking-wider">แก้ไขกำไร (฿)</label>
                  <input 
                    type="number" 
                    placeholder="ใส่จำนวนเงินใหม่" 
                    value={bulkEditData.profit} 
                    onChange={e => setBulkEditData({...bulkEditData, profit: e.target.value})} 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 transition-all text-emerald-400 font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1 tracking-wider">เปลี่ยนสถานะ</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none text-slate-200"
                    value={bulkEditData.status}
                    onChange={e => setBulkEditData({...bulkEditData, status: e.target.value})}
                  >
                    <option value="">-- ไม่เปลี่ยนแปลง --</option>
                    <option value={IDStatus.AVAILABLE}>AVAILABLE</option>
                    <option value={IDStatus.SOLD}>SOLD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1 tracking-wider">แก้ไขรายละเอียด</label>
                <input 
                  placeholder="ใส่รายละเอียดใหม่" 
                  value={bulkEditData.details} 
                  onChange={e => setBulkEditData({...bulkEditData, details: e.target.value})} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 transition-all text-slate-200" 
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-slate-700 text-slate-300 font-bold py-4 rounded-xl hover:bg-slate-600 transition-all"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={handleApplyBulkEdit} 
                  className="flex-[2] bg-emerald-500 text-slate-900 font-bold py-4 rounded-xl hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 text-lg flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;
