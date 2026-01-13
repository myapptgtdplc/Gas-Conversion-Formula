import React, { useState, useEffect } from 'react';
import BoilerSlide from './components/BoilerSlide';
import GeneratorSlide from './components/GeneratorSlide';
import ConverterSlide from './components/ConverterSlide';
import HistorySlide from './components/HistorySlide';
import SelectionSlide from './components/SelectionSlide';
import UniversalConverterSlide from './components/UniversalConverterSlide';
import DeveloperNoteSlide from './components/DeveloperNoteSlide';

export enum SlideType {
  BOILER = 'BOILER',
  GENERATOR = 'GENERATOR',
  CONVERTER = 'CONVERTER',
  SELECTION = 'SELECTION',
  UNIVERSAL = 'UNIVERSAL',
  HISTORY = 'HISTORY',
  DEVELOPER = 'DEVELOPER'
}

export interface CalculationLog {
  id: string;
  type: SlideType;
  timestamp: number;
  inputs: Record<string, string | number>;
  result: string;
  unit: string;
}

const App: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState<SlideType>(SlideType.BOILER);
  const [history, setHistory] = useState<CalculationLog[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('industrial_calc_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem('industrial_calc_history', JSON.stringify(history));
  }, [history]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Installation Guide:\n\nAndroid/Chrome: Click 3-dots > Install app\niPhone/Safari: Click Share > Add to Home Screen");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const logCalculation = (log: Omit<CalculationLog, 'id' | 'timestamp'>) => {
    const newEntry: CalculationLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 50));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('industrial_calc_history');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-transparent relative shadow-2xl overflow-x-hidden flex flex-col border-x border-slate-200/50 backdrop-blur-[2px]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl px-4 pt-4 pb-2 border-b border-slate-200/60 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200/50">
             <span className="text-base font-black text-white">T</span>
          </div>
          <div>
            <h1 className="text-[9px] font-black text-slate-800 tracking-tight leading-none mb-1 uppercase">TITAS GAS CONVERSION</h1>
            <div className="flex items-center gap-1">
              <span className="text-[7px] font-black text-blue-700 uppercase tracking-wider">MD. NAZIM UDDIN</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleInstallClick}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-300 ${
            deferredPrompt 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 animate-pulse active:scale-95' 
              : 'bg-slate-100 text-slate-500 active:scale-95'
          }`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003 3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="text-[7px] font-black uppercase tracking-tighter">Install</span>
        </button>
      </header>

      <nav className="sticky top-[57px] z-40 bg-transparent p-1">
        <div className="flex bg-white/95 backdrop-blur-lg rounded-xl p-0.5 shadow-xl border border-white/60 justify-between items-stretch gap-0.5">
          {[
            { id: SlideType.BOILER, label: 'BOILER', icon: '🌬️' },
            { id: SlideType.GENERATOR, label: 'GEN', icon: '⚡' },
            { id: SlideType.CONVERTER, label: 'CONV', icon: '⇄' },
            { id: SlideType.SELECTION, label: 'METER', icon: '🎯' },
            { id: SlideType.UNIVERSAL, label: 'UNIV', icon: '📐' },
            { id: SlideType.HISTORY, label: 'LOG', icon: '📋' },
            { id: SlideType.DEVELOPER, label: 'DEV', icon: '✍️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSlide(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 px-0 transition-all ${
                activeSlide === tab.id
                  ? 'bg-blue-600 text-white rounded-lg shadow-md z-10 scale-105'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="text-2xl leading-none mb-1 transform transition-transform duration-300">{tab.icon}</span>
              <span className={`text-[6px] font-black tracking-tighter uppercase leading-none transition-all ${activeSlide === tab.id ? 'opacity-100' : 'opacity-70'}`}>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="px-4 pb-20 z-10 flex-grow relative">
        {activeSlide === SlideType.BOILER && <BoilerSlide onLog={logCalculation} />}
        {activeSlide === SlideType.GENERATOR && <GeneratorSlide onLog={logCalculation} />}
        {activeSlide === SlideType.CONVERTER && <ConverterSlide onLog={logCalculation} />}
        {activeSlide === SlideType.SELECTION && <SelectionSlide onLog={logCalculation} />}
        {activeSlide === SlideType.UNIVERSAL && <UniversalConverterSlide />}
        {activeSlide === SlideType.HISTORY && <HistorySlide history={history} onClear={clearHistory} />}
        {activeSlide === SlideType.DEVELOPER && <DeveloperNoteSlide />}
        
        {/* Conditional Footer: Omitted for Slide 7 (DEVELOPER) */}
        {activeSlide !== SlideType.DEVELOPER && (
          <footer className="mt-12 py-12 flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-16 bg-slate-300"></div>
              <p className="text-[12px] font-bold text-slate-500 tracking-[0.25em] uppercase">DEVELOPED BY</p>
              <div className="h-[1px] w-16 bg-slate-300"></div>
            </div>
            
            <div className="space-y-1">
              <p className="text-[18px] font-black text-slate-800 uppercase tracking-tight">MD. NAZIM UDDIN</p>
              <p className="text-[14px] font-bold text-blue-600 uppercase tracking-wide">SAE (TGTDPLC)</p>
            </div>
            
            <div className="mt-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Titas Gas Transmission & Distribution PLC
              </p>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
};

export default App;