import React, { useState, useMemo } from 'react';
import { SlideType, CalculationLog } from '../App';

interface MeterData {
  value: number;
  label: string;
  description: string;
}

interface Props {
  onLog: (log: Omit<CalculationLog, 'id' | 'timestamp'>) => void;
}

const SelectionSlide: React.FC<Props> = ({ onLog }) => {
  const [hourlyLoadM3, setHourlyLoadM3] = useState<string>('142');
  const [pressurePsig, setPressurePsig] = useState<string>('8');
  const [customerCode, setCustomerCode] = useState<string>('3');

  // Official G-Series Available Meters from G-1.6 to G-25000
  const availableMeters: MeterData[] = [
    { value: 1.6, label: 'G-1.6', description: 'Natural Gas Meter 3/4" X 3/4" (2.5 m³/h)' },
    { value: 2.5, label: 'G-2.5', description: 'Diaphragm Meter Screwed NPT Male 3/4" X 3/4"' },
    { value: 4, label: 'G-4', description: 'Diaphragm Meter Screwed NPT Male 3/4" X 3/4"' },
    { value: 6, label: 'G-6', description: 'Diaphragm Meter Screwed NPT Male 3/4" X 3/4"' },
    { value: 10, label: 'G-10', description: 'Rotary Meter Screwed NPT Female 1-1/2" x 1-1/2"' },
    { value: 16, label: 'G-16', description: 'Rotary Meter Screwed NPT Female 1-1/2"x 1-1/2"' },
    { value: 25, label: 'G-25', description: 'Rotary Meter CL 125 RF 2" X 2" (40 m³/h)' },
    { value: 40, label: 'G-40', description: 'Rotary Meter CL 125 RF 2" X 2" (65 m³/h rating)' },
    { value: 65, label: 'G-65', description: 'Rotary Meter CL 125 RF 2" X 2" (100 m³/h rating)' },
    { value: 100, label: 'G-100', description: 'Turbine Meter CL 125 RF 3" X 3" (160 m³/h)' },
    { value: 160, label: 'G-160', description: 'Turbine Meter With EVC CL 150 RF 3"X3"' },
    { value: 250, label: 'G-250', description: 'Turbine Meter CL 150 RF 4" X 4" (400 m³/h)' },
    { value: 400, label: 'G-400', description: 'Turbine Meter (CL 150/600) 4" X 4"' },
    { value: 650, label: 'G-650', description: 'Turbine Meter With EVC CL 150 RF 6" X 6"' },
    { value: 1000, label: 'G-1000', description: 'Turbine & Rotary (CL 150/300/600) 6" X 6" / 8" X 8"' },
    { value: 1600, label: 'G-1600', description: 'Turbine Meter (CL 150/300/600) 8" X 8"' },
    { value: 2500, label: 'G-2500', description: 'Turbine Meter (CL 150/300/600) 10" X 10" / 12" X 12"' },
    { value: 4000, label: 'G-4000', description: 'Turbine & Rotary (CL 150/300/600) 12" X 12"' },
    { value: 6500, label: 'G-6500', description: 'Turbine Meter With EVC CL 150 RF 16" X 16"' },
    { value: 10000, label: 'G-10000', description: 'Turbine Meter With EVC ANSI 8" x 8"' },
    { value: 25000, label: 'G-25000', description: 'Turbine Meter With EVC ANSI 10" x 10"' }
  ];

  const categories: Record<string, string> = {
    '1': 'Metered Domestic',
    '2': 'Commercial',
    '3': 'Industrial',
    '7': 'CNG (EVC Preferred)',
    '8': 'Captive (EVC Mandatory)',
    '9': 'Commercial'
  };

  const analysis = useMemo(() => {
    const load = parseFloat(hourlyLoadM3 || '0');
    const pressure = parseFloat(pressurePsig || '0');
    
    const pf = (14.73 + pressure) / 14.73;
    const qCalc = load / (1.6 * pf * 0.85);
    
    const selectedMeter = availableMeters.find(m => m.value >= qCalc) || availableMeters[availableMeters.length - 1];
    const meterCapacity = selectedMeter.value * 1.6 * pf;
    const loadSCFH = load * 35.3147;

    return {
      pf: pf.toFixed(4),
      qCalc: qCalc.toFixed(4),
      meterLabel: selectedMeter.label,
      meterDesc: selectedMeter.description,
      meterCapacity: meterCapacity.toFixed(2),
      loadSCFH: loadSCFH.toFixed(0)
    };
  }, [hourlyLoadM3, pressurePsig, customerCode]);

  const handleLog = () => {
    onLog({
      type: SlideType.SELECTION,
      inputs: { 'Load(m³)': hourlyLoadM3, 'P.F': pressurePsig, 'Code': customerCode },
      result: `${analysis.meterLabel} (Cap: ${analysis.meterCapacity}m³)`,
      unit: 'METER'
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50">
        <div className="flex items-center gap-2 mb-8 text-blue-600">
          <span className="text-xl">🎯</span>
          <h2 className="text-sm font-black uppercase tracking-widest">Meter Calculation</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Category</label>
            <select 
              value={customerCode} 
              onChange={e => setCustomerCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-bold text-slate-700 outline-none"
            >
              {Object.entries(categories).map(([code, name]) => (
                <option key={code} value={code}>Code {code}: {name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hourly Load (m³)</label>
              <input 
                type="number" 
                value={hourlyLoadM3} 
                onChange={e => setHourlyLoadM3(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-xl font-black text-slate-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outlet Pressure</label>
              <input 
                type="number" 
                value={pressurePsig} 
                onChange={e => setPressurePsig(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-xl font-black text-slate-800"
              />
              <p className="text-[9px] font-bold text-blue-500 uppercase mt-1">P. F = (14.73 + Ap)/14.73</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0c1322] rounded-[40px] p-8 text-white relative shadow-2xl overflow-hidden">
        <div className="space-y-8 relative z-10">
          <div className="text-center">
            <p className="text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase mb-2">Required Meter Type</p>
            <div className="bg-blue-600/20 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
              <h2 className="text-6xl font-black tracking-tighter">{analysis.meterLabel}</h2>
              <p className="text-[10px] font-bold text-slate-300 mt-3 px-4 leading-relaxed uppercase tracking-tighter">
                {analysis.meterDesc}
              </p>
              <p className="text-[9px] font-bold text-slate-500 mt-4 uppercase tracking-widest">Calculated Qcalc: {analysis.qCalc}</p>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex justify-between items-center">
             <div className="space-y-1">
                <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Max Meter Capacity</p>
                <p className="text-[10px] text-slate-400 italic">G-Value × 1.6 × PF</p>
             </div>
             <div className="text-right">
                <p className="text-2xl font-black text-emerald-400 leading-none">{analysis.meterCapacity}</p>
                <p className="text-[8px] font-bold text-emerald-600 uppercase">m³ / Hour</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Pressure Factor</p>
              <p className="text-lg font-black">{analysis.pf}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Load (SCFH)</p>
              <p className="text-lg font-black">{analysis.loadSCFH}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handleLog} className="flex-1 py-4 bg-white/10 rounded-2xl font-black text-[10px] uppercase border border-white/10 hover:bg-white/20 transition-all">SAVE LOG</button>
            <button onClick={() => { setHourlyLoadM3('0'); setPressurePsig('0'); }} className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">RESET</button>
          </div>
        </div>
      </section>

      <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100">
        <h3 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span>📋</span> তথ্য: EVC মিটার স্থাপনের জন্য গ্রাহক নির্বাচন
        </h3>
        <div className="space-y-3 text-[11px] font-medium text-emerald-950/90 leading-relaxed text-justify">
          <p className="font-black text-emerald-800">নিম্ন বর্ণিত গ্রাহকদের ক্ষেত্রে পর্যায়ক্রমে EVC যুক্ত মিটার স্থাপন করা হবেঃ</p>
          <ul className="space-y-2 list-disc pl-4">
            <li>সরকার কর্তৃক গৃহীত সিদ্ধান্ত অনুযায়ী নির্দেশিত গ্রাহকদের (যেমনঃ CNG Station সমূহে);</li>
            <li>গ্যাস সংযোগের উৎস লাইনে স্বল্পচাপজনিত সমস্যাগ্রস্ত গ্রাহকদের ক্ষেত্রে;</li>
            <li>যে সকল গ্রাহকদের Load Variation বেশী এবং Diversity Factor বেশী সে সকল গ্রাহকদের ক্ষেত্রে;</li>
            <li>Energy Efficient স্থাপনাযুক্ত গ্রাহক, গ্যাস বিক্রয় চুক্তি শর্ত অনুযায়ী নিয়মিত বিল প্রদানকারী গ্রাহকদের ক্ষেত্রে;</li>
            <li>বৃহৎ বিদ্যুৎ এবং সার শ্রেণী ব্যতীত ন্যূনতম ০৮ (আট) psig অনুমোদিত চাপে গ্যাস ব্যবহার এবং ৫০০০ ঘনফুট/ঘন্টা বা ততোধিক অনুমোদিত লোড ব্যবহার করে এরূপ শিল্প, Small Independent Power Plant (10MW & below), Captive Power Plant etc, গ্রাহকদের ক্ষেত্রে। সকল প্রকার Captive Power Plant এর ক্ষেত্রে EVC যুক্ত মিটার ব্যবহার করা বাঞ্ছনীয়।</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SelectionSlide;