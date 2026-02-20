
import React, { useState, useEffect, useMemo } from 'react';
import { Coins, ArrowRightLeft, TrendingUp, Info, RefreshCw, Clock, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CurrencyConverter: React.FC = () => {
  const [activeCoin, setActiveCoin] = useState<'BTC' | 'LTC' | 'USDT'>('USDT');
  const [amount, setAmount] = useState<string>('1');
  const [rate, setRate] = useState<string>('36.50');
  const [result, setResult] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [chartData, setChartData] = useState<any[]>([]);
  const [priceChange24h, setPriceChange24h] = useState<number>(0);

  const coins = [
    { id: 'USDT', geckoId: 'tether', name: 'Tether', color: 'bg-emerald-500', icon: 'U' },
    { id: 'BTC', geckoId: 'bitcoin', name: 'Bitcoin', color: 'bg-orange-500', icon: 'B' },
    { id: 'LTC', geckoId: 'litecoin', name: 'Litecoin', color: 'bg-blue-500', icon: 'L' },
  ];

  const currentCoinInfo = useMemo(() => coins.find(c => c.id === activeCoin), [activeCoin]);

  const fetchData = async (coinId: string, geckoId: string) => {
    setLoading(true);
    try {
      // Fetch Current Price
      const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${geckoId}&vs_currencies=thb&include_24hr_change=true`);
      const priceData = await priceRes.json();
      
      if (priceData[geckoId]) {
        const currentPrice = priceData[geckoId].thb;
        setRate(currentPrice.toString());
        setPriceChange24h(priceData[geckoId].thb_24h_change || 0);
        setLastUpdated(new Date().toLocaleTimeString('th-TH'));
      }

      // Fetch Historical Data (7 Days)
      const historyRes = await fetch(`https://api.coingecko.com/api/v3/coins/${geckoId}/market_chart?vs_currency=thb&days=7&interval=daily`);
      const historyData = await historyRes.json();
      
      if (historyData.prices) {
        const formattedData = historyData.prices.map((p: any) => ({
          date: new Date(p[0]).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
          price: p[1]
        }));
        setChartData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const info = coins.find(c => c.id === activeCoin);
    if (info) {
      fetchData(activeCoin, info.geckoId);
    }
  }, [activeCoin]);

  useEffect(() => {
    const calc = parseFloat(amount || '0') * parseFloat(rate || '0');
    setResult(isNaN(calc) ? 0 : calc);
  }, [amount, rate]);

  const handleRefresh = () => {
    if (currentCoinInfo) {
      fetchData(activeCoin, currentCoinInfo.geckoId);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Coins size={48} />
          </div>
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">Live Converter</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-sm font-medium">ราคาตลาดแบบ Real-time (CoinGecko API)</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Updated</p>
            <p className="text-sm font-mono text-slate-300">{lastUpdated || '--:--:--'}</p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className={`p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:bg-slate-700 transition-all shadow-xl flex items-center gap-2 ${loading ? 'opacity-50' : 'active:scale-95'}`}
          >
            <RefreshCw size={20} className={`${loading ? 'animate-spin' : ''} text-emerald-400`} />
            <span className="font-bold text-sm">อัปเดตราคา</span>
          </button>
        </div>
      </header>

      {/* Coin Selector */}
      <div className="grid grid-cols-3 gap-4">
        {coins.map((coin) => (
          <button
            key={coin.id}
            onClick={() => setActiveCoin(coin.id as any)}
            className={`p-6 rounded-[2.5rem] border transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${
              activeCoin === coin.id
                ? `${coin.color}/20 border-${coin.color.split('-')[1]}-500 shadow-2xl scale-[1.02]`
                : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 opacity-60 grayscale-[0.5] hover:grayscale-0 hover:opacity-100'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl ${coin.color} text-slate-900 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform shadow-lg`}>
              {coin.icon}
            </div>
            <div className="text-center">
              <span className={`font-black text-lg block ${activeCoin === coin.id ? 'text-white' : 'text-slate-400'}`}>{coin.id}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">{coin.name}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Converter Card */}
        <div className="xl:col-span-2 bg-[#1e293b] rounded-[3rem] p-10 border border-slate-700/50 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                จำนวนเหรียญ ({activeCoin})
              </label>
              <div className="relative group">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-3xl px-8 py-6 text-3xl font-black text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all group-hover:border-slate-500"
                  placeholder="0.00"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-600 text-xl">{activeCoin}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                <span>เรทแลกเปลี่ยนปัจจุบัน</span>
                {priceChange24h !== 0 && (
                  <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${priceChange24h > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {priceChange24h > 0 ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
                    {Math.abs(priceChange24h).toFixed(2)}% (24h)
                  </span>
                )}
              </label>
              <div className="relative group">
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-3xl px-8 py-6 text-3xl font-black text-emerald-400 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all group-hover:border-slate-500"
                  placeholder="0.00"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-600 text-xl">THB</span>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-slate-900/60 rounded-[2.5rem] border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">ยอดเงินที่จะได้รับ</p>
            <div className="flex items-baseline gap-3 overflow-hidden">
              <h3 className="text-5xl md:text-6xl font-black text-white truncate drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <span className="text-xl font-bold text-emerald-400 shrink-0">THB</span>
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="xl:col-span-3 bg-[#1e293b] rounded-[3rem] p-8 border border-slate-700/50 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black flex items-center gap-3">
              <TrendingUp className="text-emerald-400" />
              {activeCoin} Price Trend (7D)
            </h3>
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-700">
              <Clock size={14} className="text-slate-500" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">7 Days History</span>
            </div>
          </div>

          <div className="flex-1 h-[400px] w-full mt-4">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold animate-pulse">กำลังโหลดข้อมูลกราฟ...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeCoin === 'BTC' ? '#f59e0b' : activeCoin === 'LTC' ? '#3b82f6' : '#10b981'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={activeCoin === 'BTC' ? '#f59e0b' : activeCoin === 'LTC' ? '#3b82f6' : '#10b981'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={15}
                    fontFamily="Kanit"
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    hide
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Kanit' }}
                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                    formatter={(value: number) => [`฿ ${value.toLocaleString()}`, 'ราคา']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={activeCoin === 'BTC' ? '#f59e0b' : activeCoin === 'LTC' ? '#3b82f6' : '#10b981'} 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    strokeWidth={4} 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">7D High</p>
                <p className="text-lg font-bold text-emerald-400">฿ {chartData.length ? Math.max(...chartData.map(d => d.price)).toLocaleString() : '---'}</p>
             </div>
             <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">7D Low</p>
                <p className="text-lg font-bold text-red-400">฿ {chartData.length ? Math.min(...chartData.map(d => d.price)).toLocaleString() : '---'}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50 flex gap-4">
        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 h-fit border border-blue-500/20">
          <Info size={24} />
        </div>
        <div>
          <h4 className="font-bold text-blue-400 mb-1">คำแนะนำการใช้งาน</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            ระบบจะดึงราคาตลาดโดยอัตโนมัติจาก **CoinGecko** ทุกครั้งที่คุณเลือกเหรียญ 
            คุณสามารถแก้ไขช่อง "เรทแลกเปลี่ยน" เพื่อใส่ราคาที่คุณซื้อขายจริงบนแพลตฟอร์มต่างๆ เช่น Bitkub หรือ Binance เพื่อความแม่นยำในการคำนวณกำไร
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
