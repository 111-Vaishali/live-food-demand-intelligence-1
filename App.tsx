import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VelocityStats, FoodEvent } from './types';
import { demandEngine } from './services/demandEngine';
import { UPDATE_INTERVAL_MS, EVENT_GEN_RATE_MS } from './constants';
import StatsCard from './components/StatsCard';
import InsightPanel from './components/InsightPanel';

const App: React.FC = () => {
  const [stats, setStats] = useState<VelocityStats[]>([]);
  const [events, setEvents] = useState<FoodEvent[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [isDark, setIsDark] = useState<boolean>(true);
  const eventIntervalRef = useRef<number | null>(null);
  const statsIntervalRef = useRef<number | null>(null);

  const processEvents = useCallback(() => {
    const newEvent = demandEngine.generateMockEvent();
    demandEngine.addEvent(newEvent);
    setEvents(prev => [newEvent, ...prev].slice(0, 50));
  }, []);

  const refreshStats = useCallback(() => {
    const newStats = demandEngine.getStats();
    setStats(newStats);
    setLastUpdate(Date.now());
  }, []);

  useEffect(() => {
    // Initial data hydration
    for (let i = 0; i < 300; i++) {
        const pastEvent = demandEngine.generateMockEvent();
        pastEvent.timestamp = Date.now() - (Math.random() * 20 * 60 * 1000);
        demandEngine.addEvent(pastEvent);
    }
    refreshStats();

    eventIntervalRef.current = window.setInterval(processEvents, EVENT_GEN_RATE_MS);
    statsIntervalRef.current = window.setInterval(refreshStats, UPDATE_INTERVAL_MS);

    return () => {
      if (eventIntervalRef.current) clearInterval(eventIntervalRef.current);
      if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    };
  }, [processEvents, refreshStats]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  const risingItems = stats.filter(s => s.velocity > 0);
  const heroItem = risingItems[0];
  const otherRising = risingItems.slice(1, 7);
  const coolingItems = stats.filter(s => s.velocity < 0).sort((a, b) => a.velocity - b.velocity).slice(0, 8);

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {isDark && <div className="scanline" />}
      
      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-grid text-slate-200/5 dark:text-white/5 relative">
        
        {/* Sleek Command Header */}
        <header className="h-16 border-b border-slate-200 dark:border-white/5 px-8 flex items-center justify-between bg-white/95 dark:bg-black/60 backdrop-blur-2xl z-20">
          <div className="flex items-center space-x-5">
            <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 transform -rotate-3 hover:rotate-0 transition-transform cursor-default">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white drop-shadow-md"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase italic dark:text-white text-slate-900 leading-none">Food Demand Intelligence</h1>
              <div className="flex items-center space-x-3 mt-1.5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-gray-500 font-mono uppercase tracking-[0.25em] leading-none">Control Node 04 // Monitoring Global Velocity</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            {/* Executive Theme Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-inner">
              <button 
                onClick={() => setIsDark(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${!isDark ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.344l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
                <span className="text-[10px] uppercase tracking-widest hidden lg:block">Executive</span>
              </button>
              <button 
                onClick={() => setIsDark(true)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${isDark ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span className="text-[10px] uppercase tracking-widest hidden lg:block">Premium Ops</span>
              </button>
            </div>
            
            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
            
            <div className="text-right hidden sm:block">
              <p className="text-[9px] text-slate-500 dark:text-gray-600 font-mono uppercase tracking-[0.2em] font-black">Sync Ledger</p>
              <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-500">{new Date(lastUpdate).toLocaleTimeString()}</p>
            </div>
          </div>
        </header>

        {/* Live Insight Strip */}
        <div className="h-10 bg-blue-600/[0.04] dark:bg-blue-600/10 border-b border-slate-200 dark:border-blue-500/20 px-8 flex items-center overflow-hidden">
          <div className="flex items-center space-x-5 animate-in fade-in slide-in-from-left-6 duration-1000">
            <span className="bg-blue-700 dark:bg-blue-600 text-[9px] font-black text-white px-2.5 py-0.5 rounded-md uppercase tracking-[0.2em]">Operational Pulse</span>
            <p className="text-xs font-bold text-blue-900 dark:text-blue-200/90 tracking-tight">
              {heroItem ? `URGENT: ${heroItem.itemName} demand velocity is peaking at +${heroItem.velocity}% – adjust prep cycles immediately.` : 'System stabilization complete. Ingesting demand packets...'}
            </p>
          </div>
        </div>

        {/* Command Center Content */}
        <main className="flex-1 overflow-y-auto p-10 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-12">
              {/* Surge Section */}
              <section>
                <div className="flex items-center space-x-5 mb-8">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-500">Velocity Peaks</h2>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-emerald-500/15" />
                </div>
                {heroItem && (
                  <StatsCard stats={heroItem} variant="rising" isHero={true} />
                )}
              </section>

              {/* Grid Trends */}
              <section>
                <div className="flex items-center space-x-5 mb-8">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.35em] text-slate-400 dark:text-gray-600">Secondary Momentum</h2>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-white/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {otherRising.map(item => (
                    <StatsCard key={item.itemId} stats={item} variant="rising" />
                  ))}
                </div>
              </section>
            </div>

            {/* Right-Hand Sidebar Metrics */}
            <div className="space-y-10">
              <section className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl p-7 shadow-2xl shadow-slate-900/5 dark:shadow-none">
                <div className="flex items-center space-x-4 mb-8">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.35em] text-rose-600 dark:text-rose-500/80">Cooling Signals</h2>
                  <div className="w-2 h-2 rounded-full bg-rose-500/20" />
                </div>
                <div className="space-y-4">
                  {coolingItems.map(item => (
                    <StatsCard key={item.itemId} stats={item} variant="cooling" />
                  ))}
                </div>
              </section>

              {/* Data Ingestion Ledger */}
              <section className="bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-3xl p-7 overflow-hidden shadow-sm dark:shadow-none">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-gray-700">Raw Event Ledger</h3>
                  <div className="flex items-center space-x-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                     <span className="font-mono text-[9px] text-slate-400 dark:text-gray-700 uppercase tracking-widest">{events.length} Streamed</span>
                  </div>
                </div>
                <div className="h-64 overflow-y-auto font-mono text-[10px] space-y-3 pr-3 custom-scrollbar scroll-smooth">
                  {events.slice(0, 25).map((e) => (
                    <div key={e.id} className="flex justify-between items-center border-b border-slate-50 dark:border-white/[0.03] pb-3 group">
                      <div className="flex items-center space-x-3 truncate">
                         <div className={`w-1.5 h-1.5 rounded-full ${e.type === 'ORDER' ? 'bg-emerald-500' : 'bg-blue-400/50'}`} />
                         <span className="text-slate-800 dark:text-slate-300 truncate w-36 group-hover:text-blue-500 transition-colors font-medium">{e.itemName}</span>
                      </div>
                      <span className="text-slate-300 dark:text-gray-800 text-[8px] uppercase tracking-widest font-black">{e.type}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Decision Assistant Panel */}
      <aside className="w-[440px] hidden xl:block z-30 shadow-[-20px_0_50px_rgba(0,0,0,0.05)] dark:shadow-none relative">
        <InsightPanel stats={stats} />
      </aside>
    </div>
  );
};

export default App;