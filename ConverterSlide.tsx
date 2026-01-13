
import React, { useState, useMemo } from 'react';
import { SlideType, CalculationLog } from '../App';

interface Props {
  onLog: (log: Omit<CalculationLog, 'id' | 'timestamp'>) => void;
}

const ConverterSlide: React.FC<Props> = ({ onLog }) => {
  const [gaugePressure, setGaugePressure] = useState<string>('15');
  const [selectedConversion, setSelectedConversion] = useState<string>('WATT_J');
  const [convInput, setConvInput] = useState<string>('1');

  const pfValue = useMemo(() => {
    const p = parseFloat(gaugePressure || '0');
    return ((14.73 + p) / 14.73).toFixed(4);
  }, [gaugePressure]);

  const conversions: Record<string, { label: string; formula: (v: number) => number; unit: string }> = {
    WATT_J: { label: '1 Watt = 1 Joule/sec', formula: (v) => v, unit: 'J/sec' },
    HP_WATT: { label: '1 HP = 746 Watt', formula: (v) => v * 746, unit: 'Watt' },
    CAL_J: { label: '1 Cal = 4.186 Joule', formula: (v) => v * 4.186, unit: 'Joule' },
    BTU_CAL: { label: '1 BTU = 252 Cal', formula: (v) => v * 252, unit: 'Cal' },
    CFT_BTU: { label: '1 cft = 930 BTU', formula: (v) => v * 930, unit: 'BTU' },
    M3_CFT: { label: '1 m³ = 35.3147 cft gas', formula: (v) => v * 35.3147, unit: 'cft' },
    KG_CFT: { label: '1 kg Steam = 3 cft gas', formula: (v) => v * 3, unit: 'cft' },
    PSIG_WC: { label: '1 Psig = 28" WC', formula: (v) => v * 28, unit: '" WC' },
    WC8_PSIG: { label: '8" WC = 0.289 Psig', formula: (v) => v * (0.289/8), unit: 'Psig' },
    WC14_PSIG: { label: '14" WC = 0.504 Psig', formula: (v) => v * (0.504/14), unit: 'Psig' },
    IN_CM: { label: '1 inch = 2.54 cm', formula: (v) => v * 2.54, unit: 'cm' },
    FT_CM: { label: '1 foot = 30.48 cm', formula: (v) => v * 30.48, unit: 'cm' },
    SQFT_SQM: { label: '1 sq ft = 0.0929 sq m', formula: (v) => v * 0.0929, unit: 'm²' },
    SQM_SQFT: { label: '1 sq m = 10.76 sq ft', formula: (v) => v * 10.76, unit: 'ft²' },
  };

  const currentConv = conversions[selectedConversion];
  const conversionResult = useMemo(() => {
    const val = parseFloat(convInput || '0');
    return { val: currentConv.formula(val).toLocaleString(undefined, { maximumFractionDigits: 4 }), unit: currentConv.unit };
  }, [selectedConversion, convInput]);

  const logConv = () => {
    onLog({
      type: SlideType.CONVERTER,
      inputs: { Value: convInput, Conversion: currentConv.label },
      result: conversionResult.val,
      unit: conversionResult.unit
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Field Pressure Adjustments</h2>
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-slate-500 uppercase block">Gauge Pressure (Psig)</label>
          <input type="number" value={gaugePressure} onChange={e => setGaugePressure(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-3xl font-black text-slate-800 outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="bg-blue-600 rounded-2xl p-5 text-white flex justify-between items-center shadow-lg">
            <div>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Pressure Factor (PF)</p>
              <h3 className="text-4xl font-black">{pfValue}</h3>
            </div>
            <div className="text-[9px] font-bold opacity-60 text-right">Formula:<br/>(14.73+P)/14.73</div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Conversion Utility (PDF)</h2>
        <div className="space-y-4">
          <select value={selectedConversion} onChange={e => setSelectedConversion(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-bold text-slate-700 outline-none">
            {Object.entries(conversions).map(([key, obj]) => (
              <option key={key} value={key}>{obj.label}</option>
            ))}
          </select>
          <input type="number" value={convInput} onChange={e => setConvInput(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-2xl font-black text-slate-800 outline-none" />
          <div className="bg-[#0f172a] rounded-[24px] p-6 text-white text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{conversionResult.unit}</p>
            <h2 className="text-4xl font-black">{conversionResult.val}</h2>
            <button onClick={logConv} className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-black transition-all uppercase shadow-lg">SAVE TO LOG</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConverterSlide;
