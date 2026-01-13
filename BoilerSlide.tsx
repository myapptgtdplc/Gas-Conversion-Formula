import React, { useState, useMemo } from 'react';
import { SlideType, CalculationLog } from '../App';

interface Props {
  onLog: (log: Omit<CalculationLog, 'id' | 'timestamp'>) => void;
}

const BoilerSlide: React.FC<Props> = ({ onLog }) => {
  const [lengthFt, setLengthFt] = useState<string>('4');
  const [lengthIn, setLengthIn] = useState<string>('3');
  const [diameterFt, setDiameterFt] = useState<string>('2');
  const [diameterIn, setDiameterIn] = useState<string>('4');
  const [boilerType, setBoilerType] = useState<'OLD' | 'NEW'>('NEW');

  const stats = useMemo(() => {
    const L = parseFloat(lengthFt || '0') + (parseFloat(lengthIn || '0') / 12);
    const D = parseFloat(diameterFt || '0') + (parseFloat(diameterIn || '0') / 12);
    
    const multiplier = boilerType === 'NEW' ? 5.57 : 4.46;
    const capacity = multiplier * Math.pow(D, 2) * L;
    const gasRequired = capacity * 3;

    return {
      capacity: capacity.toFixed(2),
      gasRequired: gasRequired.toFixed(2),
      multiplier
    };
  }, [lengthFt, lengthIn, diameterFt, diameterIn, boilerType]);

  const resetFields = () => {
    setLengthFt('');
    setLengthIn('');
    setDiameterFt('');
    setDiameterIn('');
  };

  const handleLog = () => {
    onLog({
      type: SlideType.BOILER,
      inputs: { L: `${lengthFt}'${lengthIn}"`, D: `${diameterFt}'${diameterIn}"`, Type: boilerType },
      result: stats.gasRequired,
      unit: 'CFT GAS'
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50">
        <div className="flex items-center gap-2 mb-8 text-blue-600/80">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 className="text-lg font-bold uppercase tracking-wide">Boiler Input Values</h2>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
              <svg className="w-4 h-4 text-blue-400 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Length (L)</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <input type="number" value={lengthFt} onChange={e => setLengthFt(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-5 py-4 text-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold uppercase text-xs">ft</span>
              </div>
              <div className="relative group">
                <input type="number" value={lengthIn} onChange={e => setLengthIn(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-5 py-4 text-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold uppercase text-xs">in</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
              <svg className="w-4 h-4 text-blue-400 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Diameter (D)</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <input type="number" value={diameterFt} onChange={e => setDiameterFt(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-5 py-4 text-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold uppercase text-xs">ft</span>
              </div>
              <div className="relative group">
                <input type="number" value={diameterIn} onChange={e => setDiameterIn(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-5 py-4 text-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold uppercase text-xs">in</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-slate-500 font-bold text-sm uppercase">
              <span>Efficiency Standard</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md">{boilerType === 'NEW' ? '25%' : '20%'}</span>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setBoilerType('OLD')} className={`flex-1 py-4 rounded-xl text-xs font-black transition-all border-2 ${boilerType === 'OLD' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>OLD (&lt;20%)</button>
              <button onClick={() => setBoilerType('NEW')} className={`flex-1 py-4 rounded-xl text-xs font-black transition-all border-2 ${boilerType === 'NEW' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>NEW (&lt;25%)</button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0c1322] rounded-[40px] p-10 text-white relative shadow-2xl overflow-hidden">
        <div className="relative z-10 space-y-8 text-center">
          <div className="space-y-2">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-blue-400">Steam Capacity</p>
            <div className="flex items-baseline justify-center gap-4">
              <h2 className="text-7xl font-black tracking-tighter">{stats.capacity}</h2>
              <h2 className="text-sm font-bold text-slate-500">KG STEAM</h2>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 space-y-2">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-400">Gas Required</p>
            <div className="flex items-baseline justify-center gap-4">
              <h2 className="text-5xl font-black text-white/90 tracking-tighter">{stats.gasRequired}</h2>
              <p className="text-sm font-bold text-slate-500 uppercase">CFT</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl py-3 border border-white/5">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Industrial Standard</p>
            <p className="text-xs font-black text-blue-300">1kg Steam = 3cft gas</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleLog} className="py-4 bg-white/10 rounded-2xl font-black text-[10px] uppercase border border-white/10">SAVE LOG</button>
            <button onClick={resetFields} className="py-4 bg-white text-[#0c1322] rounded-2xl font-black text-[10px] uppercase">RESET</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BoilerSlide;