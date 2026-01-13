
import React, { useState, useMemo } from 'react';
import { SlideType, CalculationLog } from '../App';

interface Props {
  onLog: (log: Omit<CalculationLog, 'id' | 'timestamp'>) => void;
}

const GeneratorSlide: React.FC<Props> = ({ onLog }) => {
  const [kwOutput, setKwOutput] = useState<string>('8425');
  const [efficiency, setEfficiency] = useState<number>(42);

  const results = useMemo(() => {
    const kw = parseFloat(kwOutput || '0');
    const effDecimal = efficiency / 100;

    // Step 1: Input Power = kW / Efficiency
    const inputPower = effDecimal > 0 ? kw / effDecimal : 0;

    // Step 2: Heat (BTU/hr) = (Input Power * 1000 * 3600) / (4.2 * 252)
    const heatConstant = (1000 * 3600) / (4.2 * 252);
    const inputHeatBTU = inputPower * heatConstant;

    // Step 3: SCF = Heat / 930
    const scf = inputHeatBTU / 930;

    // Step 4: Benchmark 1kW = 12cft
    const benchmark = kw * 12;

    return {
      inputPower: inputPower.toFixed(2),
      inputHeat: Math.round(inputHeatBTU).toLocaleString(),
      scf: scf.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      benchmark: benchmark.toLocaleString(),
      scfRaw: scf.toFixed(2)
    };
  }, [kwOutput, efficiency]);

  const resetFields = () => {
    setKwOutput('');
    setEfficiency(42);
  };

  const handleLog = () => {
    onLog({
      type: SlideType.GENERATOR,
      inputs: { 'kW': kwOutput, 'Eff': `${efficiency}%` },
      result: results.scfRaw,
      unit: 'SCF/HR'
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Settings Section Card */}
      <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-sm font-bold uppercase tracking-widest">GENERATOR SETTINGS</h2>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase tracking-wider">IDEAL: 42%</span>
        </div>

        <div className="space-y-8">
          {/* KW Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Electrical Output (KW)</label>
            <div className="relative group">
              <input 
                type="number" 
                value={kwOutput} 
                onChange={e => setKwOutput(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-[24px] px-8 py-6 text-4xl font-black text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center"
              />
            </div>
          </div>

          {/* Efficiency Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <label>Efficiency: <span className="text-blue-600">{efficiency}%</span></label>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={efficiency} 
              onChange={e => setEfficiency(parseInt(e.target.value))} 
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer custom-slider" 
            />
          </div>

          {/* Formula Logic Breakdown */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-2 text-blue-600/80">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-[10px] font-black uppercase tracking-widest">CATALOG FORMULA LOGIC</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-slate-50/80 rounded-2xl p-4 flex justify-between items-center border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Step 1: Input Power</p>
                  <p className="text-[9px] font-bold text-slate-600 uppercase">kW / Efficiency</p>
                </div>
                <p className="text-lg font-black text-slate-800">{results.inputPower} kW</p>
              </div>

              <div className="flex justify-center -my-1">
                <svg className="w-4 h-4 text-slate-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>

              <div className="bg-slate-50/80 rounded-2xl p-4 flex justify-between items-center border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Step 2: Input Heat</p>
                  <p className="text-[9px] font-bold text-slate-600 uppercase">Btu/hr</p>
                </div>
                <p className="text-lg font-black text-slate-800">{results.inputHeat}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Result Card */}
      <section className="bg-[#0c1322] rounded-[40px] p-10 text-white relative shadow-2xl overflow-hidden">
        {/* Decorative Flame Icon Background */}
        <div className="absolute top-4 right-8 opacity-5">
           <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.989 7.989 0 01-2.343 5.657z" />
           </svg>
        </div>

        <div className="relative z-10 space-y-10">
          <div className="text-center space-y-4">
            <p className="text-blue-400 text-[10px] font-black tracking-[0.3em] uppercase">CALCULATED GAS CONSUMPTION</p>
            <div className="bg-blue-900/20 rounded-[32px] p-8 border border-white/5 backdrop-blur-sm">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">SCF / HR (BASED ON {efficiency}%)</p>
              <h2 className="text-6xl font-black tracking-tighter mb-2">{results.scf}</h2>
              <p className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase">STANDARD CUBIC FEET</p>
            </div>
          </div>

          {/* Benchmarking Subsection */}
          <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">BENCHMARKING</p>
              <p className="text-sm font-black text-white">Rule: 1 kW = 12 cft</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-white leading-none">{results.benchmark}</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">ESTIMATED CFT/HR</p>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex gap-4">
            <button 
              onClick={handleLog}
              className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center gap-2 transition-all font-black text-[10px] uppercase border border-white/10"
            >
              SAVE LOG
            </button>
            <button 
              onClick={resetFields}
              className="flex-1 py-4 bg-white text-[#0c1322] hover:bg-blue-50 active:scale-95 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-[10px] uppercase shadow-2xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              RESET
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GeneratorSlide;
