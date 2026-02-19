
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Settings, CreditCard, Menu, X, Coins } from 'lucide-react';
import { DataProvider } from './context/DataContext';
import Home from './pages/Home';
import Status from './pages/Status';
import DayDetail from './pages/DayDetail';
import CategoryDetail from './pages/CategoryDetail';
import Management from './pages/Management';
import Expenses from './pages/Expenses';
import CurrencyConverter from './pages/CurrencyConverter';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <DataProvider>
      <HashRouter>
        <div className="flex h-screen bg-[#0f172a] text-slate-100 overflow-hidden">
          {/* Sidebar for Desktop */}
          <aside className="hidden lg:flex flex-col w-64 bg-[#1e293b] border-r border-slate-700">
            <div className="p-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                ID PROFIT
              </h1>
            </div>
            <nav className="flex-1 px-4 space-y-2 mt-4">
              <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="HOME" />
              <SidebarLink to="/status" icon={<Calendar size={20} />} label="STATUS" />
              <SidebarLink to="/management" icon={<Settings size={20} />} label="MANAGE" />
              <SidebarLink to="/expenses" icon={<CreditCard size={20} />} label="EXPENSES" />
              <SidebarLink to="/converter" icon={<Coins size={20} />} label="CONVERTER" />
            </nav>
          </aside>

          {/* Mobile Nav */}
          <div className="lg:hidden fixed top-4 left-4 z-50">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-[#1e293b] rounded-lg shadow-lg"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
          </div>

          {isSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}>
              <aside className="w-64 h-full bg-[#1e293b] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                 <h1 className="text-xl font-bold mb-8">ID PROFIT</h1>
                 <nav className="space-y-4">
                  <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="HOME" onClick={() => setIsSidebarOpen(false)} />
                  <SidebarLink to="/status" icon={<Calendar size={20} />} label="STATUS" onClick={() => setIsSidebarOpen(false)} />
                  <SidebarLink to="/management" icon={<Settings size={20} />} label="MANAGE" onClick={() => setIsSidebarOpen(false)} />
                  <SidebarLink to="/expenses" icon={<CreditCard size={20} />} label="EXPENSES" onClick={() => setIsSidebarOpen(false)} />
                  <SidebarLink to="/converter" icon={<Coins size={20} />} label="CONVERTER" onClick={() => setIsSidebarOpen(false)} />
                </nav>
              </aside>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/status" element={<Status />} />
              <Route path="/status/:date" element={<DayDetail />} />
              <Route path="/category/:categoryName" element={<CategoryDetail />} />
              <Route path="/management" element={<Management />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/converter" element={<CurrencyConverter />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </DataProvider>
  );
};

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; label: string; onClick?: () => void }> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        isActive 
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
          : 'hover:bg-slate-800 text-slate-400'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default App;
