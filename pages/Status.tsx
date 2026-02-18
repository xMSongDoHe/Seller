
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { IDStatus } from '../types';

const Status: React.FC = () => {
  const { ids } = useData();
  const [viewDate, setViewDate] = useState(new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const currentMonthName = monthNames[viewDate.getMonth()];
  const currentYear = viewDate.getFullYear();

  // คำนวณวันในเดือน
  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [viewDate]);

  // สรุปข้อมูลรายวันจาก ids จริงในระบบ
  const dailyStats = useMemo(() => {
    const stats: Record<string, { profit: number, count: number }> = {};
    ids.forEach(id => {
      const dateStr = id.dateAdded; // YYYY-MM-DD
      if (!stats[dateStr]) {
        stats[dateStr] = { profit: 0, count: 0 };
      }
      if (id.status === IDStatus.SOLD) {
        stats[dateStr].profit += id.profit;
        stats[dateStr].count += 1;
      }
    });
    return stats;
  }, [ids]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(newDate);
  };

  const handleYearChange = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
  };

  const handleMonthChange = (monthIdx: number) => {
    setViewDate(new Date(viewDate.getFullYear(), monthIdx, 1));
    setIsPickerOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Status</h2>
          <p className="text-slate-400">เลือกดูสถานะและกำไรรายวันตามปฏิทิน</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={() => setIsPickerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors shadow-lg"
           >
            <Filter size={18} className="text-emerald-400" />
            <span>เลือกเดือน / ปี</span>
          </button>
        </div>
      </div>

      {/* แถบควบคุมเดือน */}
      <div className="flex items-center justify-between bg-slate-800/40 p-4 rounded-2xl border border-slate-700 backdrop-blur-md shadow-xl">
        <button 
          onClick={() => changeMonth(-1)}
          className="p-3 hover:bg-slate-700 rounded-xl transition-all active:scale-95"
        >
          <ChevronLeft />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-emerald-400">
            <CalendarIcon size={22} />
            <span>{currentMonthName} {currentYear + 543}</span>
          </div>
          <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-semibold">Monthly Calendar View</span>
        </div>
        <button 
          onClick={() => changeMonth(1)}
          className="p-3 hover:bg-slate-700 rounded-xl transition-all active:scale-95"
        >
          <ChevronRight />
        </button>
      </div>

      {/* ตารางวันที่ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
        {daysInMonth.map((dateObj, idx) => {
          const dateKey = dateObj.toISOString().split('T')[0];
          const stats = dailyStats[dateKey] || { profit: 0, count: 0 };
          const isToday = new Date().toISOString().split('T')[0] === dateKey;

          return (
            <Link 
              key={idx} 
              to={`/status/${dateKey}`}
              className={`group relative bg-slate-900 border ${isToday ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-slate-800'} rounded-2xl p-4 hover:border-emerald-400 hover:bg-slate-800/50 transition-all cursor-pointer overflow-hidden shadow-lg`}
            >
              <div className={`absolute top-0 right-0 p-2 text-[10px] font-bold rounded-bl-xl ${isToday ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {dateObj.getDate()} {monthNames[dateObj.getMonth()].substring(0, 3)}
              </div>
              
              <div className="mt-4 space-y-3">
                 <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter mb-0.5 font-bold">กำไร</p>
                    <h4 className={`text-xl font-bold ${stats.profit > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
                      ฿ {stats.profit.toLocaleString()}
                    </h4>
                 </div>
                 
                 <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${stats.count > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`}></div>
                      <span className="text-[10px] text-slate-400">ขายได้ <span className="text-slate-200 font-bold">{stats.count}</span></span>
                    </div>
                 </div>
              </div>

              {/* ตกแต่งพื้นหลังเล็กน้อยเมื่อ hover */}
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
            </Link>
          );
        })}
      </div>

      {/* Modal เลือกเดือน/ปี */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1e293b] w-full max-w-md rounded-3xl p-8 border border-slate-700 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsPickerOpen(false)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CalendarIcon className="text-emerald-400" />
              เลือกช่วงเวลา
            </h3>

            <div className="space-y-6">
              {/* เลือกปี */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 tracking-widest">ปี พ.ศ.</label>
                <div className="grid grid-cols-3 gap-2">
                  {[2023, 2024, 2025].map(year => (
                    <button 
                      key={year}
                      onClick={() => handleYearChange(year)}
                      className={`py-2 rounded-xl border font-bold transition-all ${currentYear === year ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                    >
                      {year + 543}
                    </button>
                  ))}
                </div>
              </div>

              {/* เลือกเดือน */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 tracking-widest">เดือน</label>
                <div className="grid grid-cols-3 gap-2">
                  {monthNames.map((name, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleMonthChange(idx)}
                      className={`py-2 text-sm rounded-xl border transition-all ${viewDate.getMonth() === idx ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;
