import React from 'react';
import { CalculationLog, SlideType } from '../App';

interface Props {
  history: CalculationLog[];
  onClear: () => void;
}

const HistorySlide: React.FC<Props> = ({ history, onClear }) => {
  const getIcon = (type: SlideType) => {
    switch (type) {
      case SlideType.BOILER: return '🌬️';
      case SlideType.GENERATOR: return '⚡';
      case SlideType.CONVERTER: return '⇄';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Enhanced Installation Procedure Note */}
      <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-100">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          How to Install (Netlify Note)
        </h3>
        <div className="space-y-4 text-[11px] leading-relaxed">
          <div className="bg-white/10 p-3 rounded-xl border border-white/20 mb-2">
            <p className="font-bold text-blue-100">Note for Chrome users:</p>
            <p>If the "Install" button doesn't appear, Chrome uses <span className="underline font-black">"Add to Home Screen"</span> or <span className="underline font-black">"Create Shortcut"</span> instead. Both work exactly like an App.</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center font-black flex-shrink-0">1</div>
            <p><span className="font-black text-blue-200">Android/Chrome:</span> Tap <span className="font-black">menu (⋮)</span>, then tap <span className="font-black">"Add to Home Screen"</span>. The app will appear on your desktop.</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center font-black flex-shrink-0">2</div>
            <p><span className="font-black text-blue-200">iPhone/Safari:</span> Tap <span className="font-black">Share (↑)</span>, then scroll down to <span className="font-black">"Add to Home Screen"</span>.</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center font-black flex-shrink-0">3</div>
            <p><span className="font-black text-blue-200">PC/Desktop:</span> Tap <span className="font-black">menu (⋮)</span> → <span className="font-black">Save and Share</span> → <span className="font-black">Install page as App</span>.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-2 mt-8">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Calculation History</h2>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-tight"
          >
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
          <p className="text-slate-400 text-sm font-medium">No calculations recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((log) => (
            <div key={log.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getIcon(log.type)}</span>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs font-bold text-slate-800">{log.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-blue-600 leading-none">{log.result}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{log.unit}</p>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-2.5 flex flex-wrap gap-x-4 gap-y-1">
                {Object.entries(log.inputs).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{key}:</span>
                    <span className="text-[10px] font-bold text-slate-700">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorySlide;