import React, { useState, useMemo, useEffect } from 'react';

type Category = 'BASIC' | 'LIVING' | 'SCIENCE' | 'MISC';

interface UnitDefinition {
  id: string;
  name: string;
  ratio: number; // Ratio relative to 1 Base Unit (Base * Ratio = UnitValue)
  isSpecial?: boolean;
  toBase?: (val: number) => number;
  fromBase?: (base: number) => number;
}

interface SubCategory {
  id: string;
  name: string;
  icon: string;
  units: UnitDefinition[];
  defaultUnitId: string;
}

const UniversalConverterSlide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category>('BASIC');
  const [activeSub, setActiveSub] = useState<string>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [inputUnit, setInputUnit] = useState<string>('m');
  const [showToast, setShowToast] = useState(false);

  // Requirement 2: Scientific Notation Logic (1E-9 uppercase)
  const formatSmartValue = (num: number): string => {
    if (num === 0) return '0';
    const absNum = Math.abs(num);
    
    if (absNum < 0.0001 || absNum >= 1000000) {
      // Use uppercase Scientific Notation
      let formatted = num.toExponential(6).toUpperCase();
      // Clean up scientific notation (remove + in E+05)
      formatted = formatted.replace(/\+/g, '');
      const [mantissa, exponent] = formatted.split('E');
      const cleanMantissa = parseFloat(mantissa).toString(); // strips trailing zeros
      return `${cleanMantissa}E${exponent}`;
    } else {
      // Normal Decimal (max 6 places, strip trailing zeros)
      let formatted = num.toFixed(6);
      if (formatted.includes('.')) {
        formatted = formatted.replace(/\.?0+$/, '');
      }
      // Add commas for readability
      const parts = formatted.split('.');
      parts[0] = parseInt(parts[0]).toLocaleString();
      return parts.join('.');
    }
  };

  // Requirement 3: Exact Conversion Ratios
  const CATEGORIES: Record<Category, SubCategory[]> = {
    BASIC: [
      {
        id: 'length', name: 'Length', icon: '📏', defaultUnitId: 'm',
        units: [
          { id: 'm', name: 'm', ratio: 1 },
          { id: 'mm', name: 'mm', ratio: 1000 },
          { id: 'cm', name: 'cm', ratio: 100 },
          { id: 'km', name: 'km', ratio: 0.001 },
          { id: 'inch', name: 'inch', ratio: 39.3701 },
          { id: 'ft', name: 'ft', ratio: 3.28084 },
          { id: 'mile', name: 'mile', ratio: 0.000621371 },
        ]
      },
      {
        id: 'area', name: 'Area', icon: '🟦', defaultUnitId: 'm2',
        units: [
          { id: 'm2', name: 'm²', ratio: 1 },
          { id: 'mm2', name: 'mm²', ratio: 1000000 },
          { id: 'cm2', name: 'cm²', ratio: 10000 },
          { id: 'in2', name: 'in²', ratio: 1550.0031 },
          { id: 'ft2', name: 'ft²', ratio: 10.7639 },
          { id: 'yd2', name: 'yd²', ratio: 1.19599 },
          { id: 'ha', name: 'ha', ratio: 0.0001 },
          { id: 'acre', name: 'acre', ratio: 0.000247105 },
        ]
      },
      {
        id: 'weight', name: 'Weight', icon: '⚖️', defaultUnitId: 'kg',
        units: [
          { id: 'g', name: 'g', ratio: 1 },
          { id: 'kg', name: 'kg', ratio: 0.001 },
          { id: 'mg', name: 'mg', ratio: 1000 },
          { id: 'lb', name: 'lb', ratio: 0.00220462 },
          { id: 'oz', name: 'oz', ratio: 0.035274 },
          { id: 'tonne', name: 'tonne', ratio: 0.000001 },
        ]
      }
    ],
    LIVING: [
      {
        id: 'time', name: 'Time', icon: '🕒', defaultUnitId: 'sec',
        units: [
          { id: 'sec', name: 's', ratio: 1 },
          { id: 'ms', name: 'ms', ratio: 1000 },
          { id: 'min', name: 'min', ratio: 1/60 },
          { id: 'hr', name: 'hr', ratio: 1/3600 },
          { id: 'day', name: 'day', ratio: 1/86400 },
          { id: 'week', name: 'week', ratio: 1/604800 },
          { id: 'year', name: 'year', ratio: 1/31536000 },
        ]
      },
      {
        id: 'temperature', name: 'Temp', icon: '🌡️', defaultUnitId: 'C',
        units: [
          { id: 'C', name: '°C', ratio: 1, toBase: (v) => v, fromBase: (b) => b },
          { id: 'F', name: '°F', ratio: 1, toBase: (v) => (v - 32) * 5/9, fromBase: (b) => (b * 9/5) + 32 },
          { id: 'K', name: 'K', ratio: 1, toBase: (v) => v - 273.15, fromBase: (b) => b + 273.15 },
        ]
      },
      {
        id: 'speed', name: 'Speed', icon: '🚀', defaultUnitId: 'ms',
        units: [
          { id: 'ms', name: 'm/s', ratio: 1 },
          { id: 'kmh', name: 'km/h', ratio: 3.6 },
          { id: 'mph', name: 'mph', ratio: 2.23694 },
          { id: 'knot', name: 'knot', ratio: 1.94384 },
          { id: 'mach', name: 'mach', ratio: 0.002938 },
        ]
      }
    ],
    SCIENCE: [
      {
        id: 'force', name: 'Force', icon: '🧲', defaultUnitId: 'N',
        units: [
          { id: 'N', name: 'N', ratio: 1 },
          { id: 'kN', name: 'kN', ratio: 0.001 },
          { id: 'dyn', name: 'dyn', ratio: 100000 },
          { id: 'kgf', name: 'kgf', ratio: 0.10197 },
          { id: 'lbf', name: 'lbf', ratio: 0.224809 },
        ]
      },
      {
        id: 'pressure', name: 'Pressure', icon: '🔽', defaultUnitId: 'bar',
        units: [
          { id: 'bar', name: 'bar', ratio: 1 },
          { id: 'psi', name: 'psi', ratio: 14.5038 },
          { id: 'mmhg', name: 'mmHg', ratio: 750.062 },
          { id: 'kpa', name: 'kPa', ratio: 100 },
          { id: 'atm', name: 'atm', ratio: 0.986923 },
        ]
      }
    ],
    MISC: [
      {
        id: 'data', name: 'Data', icon: '💾', defaultUnitId: 'byte',
        units: [
          { id: 'byte', name: 'B', ratio: 1 },
          { id: 'kb', name: 'KB', ratio: 0.001 },
          { id: 'mb', name: 'MB', ratio: 0.000001 },
          { id: 'gb', name: 'GB', ratio: 1e-9 },
          { id: 'kib', name: 'KiB', ratio: 1/1024 },
          { id: 'mib', name: 'MiB', ratio: 1/(1024*1024) },
        ]
      },
      {
        id: 'fuel', name: 'Fuel', icon: '⛽', defaultUnitId: 'kml',
        units: [
          { id: 'kml', name: 'km/L', ratio: 1 },
          { id: 'mpg_us', name: 'mpg(US)', ratio: 2.35215 },
          { id: 'mpg_uk', name: 'mpg(UK)', ratio: 2.82481 },
          { id: 'l100km', name: 'L/100km', ratio: 1, isSpecial: true, toBase: (v) => 100/v, fromBase: (b) => 100/b },
        ]
      }
    ]
  };

  const activeSubCategory = useMemo(() => {
    return CATEGORIES[activeTab].find(s => s.id === activeSub) || CATEGORIES[activeTab][0];
  }, [activeTab, activeSub]);

  // Requirement 5: UI Reactivity - Reset defaults when changing category
  useEffect(() => {
    const sub = CATEGORIES[activeTab][0];
    setActiveSub(sub.id);
    setInputUnit(sub.defaultUnitId);
  }, [activeTab]);

  // Requirement 1: Pivot-Based Calculation Engine
  const results = useMemo(() => {
    const val = parseFloat(inputValue || '0');
    const sourceUnit = activeSubCategory.units.find(u => u.id === inputUnit) || activeSubCategory.units[0];
    
    // Step 1: Convert to Base Unit
    let baseValue: number;
    if (sourceUnit.toBase) {
      baseValue = sourceUnit.toBase(val);
    } else {
      baseValue = val / sourceUnit.ratio;
    }

    // Step 2: Convert from Base Unit to all Target Units
    return activeSubCategory.units.map(targetUnit => {
      let targetValue: number;
      if (targetUnit.fromBase) {
        targetValue = targetUnit.fromBase(baseValue);
      } else {
        targetValue = baseValue * targetUnit.ratio;
      }

      return {
        ...targetUnit,
        displayValue: formatSmartValue(targetValue),
      };
    });
  }, [inputValue, inputUnit, activeSubCategory]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.replace(/,/g, ''));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl z-[100] font-black text-xs uppercase tracking-widest animate-bounce">
          Copied
        </div>
      )}

      {/* Requirement 4: UI Style - Header Theme */}
      <div className="flex bg-[#3E2723] rounded-xl p-1 shadow-md overflow-x-auto no-scrollbar">
        {(['BASIC', 'LIVING', 'SCIENCE', 'MISC'] as Category[]).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`flex-1 min-w-[80px] py-2.5 text-[10px] font-black tracking-widest transition-all rounded-lg ${
              activeTab === cat ? 'bg-white text-[#3E2723] shadow' : 'text-white/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES[activeTab].map(sub => (
          <button
            key={sub.id}
            onClick={() => {
              setActiveSub(sub.id);
              setInputUnit(sub.defaultUnitId);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all whitespace-nowrap ${
              activeSub === sub.id 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                : 'bg-white border-slate-100 text-slate-400'
            }`}
          >
            <span className="text-sm">{sub.icon}</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">{sub.name}</span>
          </button>
        ))}
      </div>

      {/* Requirement 4: UI Style - Input Box */}
      <section className="bg-white rounded-[24px] p-5 shadow-inner border border-slate-200">
        <div className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-2xl border border-slate-200">
          <div className="flex-1 flex items-center bg-white rounded-xl border border-slate-100 px-3 shadow-sm">
             <span className="text-orange-500 text-xl mr-2">✏️</span>
             <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent py-4 text-3xl font-black text-slate-800 outline-none"
              placeholder="0"
            />
          </div>
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value)}
            className="bg-[#3E2723] border-none rounded-xl px-4 py-4 font-bold text-white outline-none shadow-md text-sm min-w-[80px] text-center appearance-none"
          >
            {activeSubCategory.units.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Requirement 4: UI Style - Result List */}
      <div className="bg-[#f8f9fa] rounded-[24px] shadow-lg border border-slate-200 divide-y divide-slate-200 overflow-hidden">
        {results.map(res => (
          <button
            key={res.id}
            onClick={() => copyToClipboard(res.displayValue)}
            className={`w-full flex items-center justify-between p-4 px-6 hover:bg-slate-100 active:bg-blue-50 transition-colors text-left group ${
              res.id === inputUnit ? 'bg-slate-200' : ''
            }`}
          >
            <div className="text-right flex-1 pr-6">
              <span 
                className="text-xl font-black tracking-tight"
                style={{ color: '#D35400' }} // Orange text for numbers
              >
                {res.displayValue}
              </span>
            </div>
            <div className="flex flex-col min-w-[80px] border-l border-slate-300 pl-4">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                {res.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center pt-2">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Mathematical Accuracy: Pivot Base Engine Active
        </p>
      </div>
    </div>
  );
};

export default UniversalConverterSlide;