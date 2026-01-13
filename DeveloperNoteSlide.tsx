import React from 'react';

const DeveloperNoteSlide: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn pb-12 px-1">
      <section className="bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100/50 flex flex-col items-center">
        
        <div className="w-full space-y-6">
          <div className="text-center mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-blue-200">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-blue-700 uppercase tracking-[0.15em] mb-1 [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">Developer's Note</h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-blue-600 to-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-7 border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500/5 rounded-full blur-xl"></div>
            
            <div className="relative z-10 text-slate-800 leading-[1.6] space-y-4">
              <p className="font-black text-blue-900 text-base [text-shadow:0_1px_1px_rgba(0,0,0,0.05)]">Dear Colleagues,</p>
              
              <p className="font-black text-slate-700 text-[13px] tracking-tight">
                Assalamu Alaikum.
              </p>
              
              <p className="font-black text-slate-700 text-[13px] tracking-tight text-left">
                I am pleased to share a small application I have developed to assist with our daily technical calculations. 
                This tool is designed to simplify tasks like Gas Consumption (Boiler/Generator), Meter Selection, 
                and Unit Conversions, ensuring efficiency and accuracy in our workflow.
              </p>
              
              <p className="font-black text-slate-700 text-[13px] tracking-tight text-left">
                I hope you find this resource beneficial. I look forward to your feedback and suggestions to make it even better.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 text-center relative">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Sincerely,</p>
            <div className="space-y-1">
              <p className="text-lg font-black text-slate-900 tracking-tighter [text-shadow:0_1px_2px_rgba(0,0,0,0.05)]">Md. Nazim Uddin</p>
              <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 inline-block px-3 py-1 rounded-full">Sub-Assistant Engineer</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-2 block">Titas Gas Transmission and Distribution PLC</p>
            </div>
          </div>
        </div>
      </section>

      {/* Engineer's Toolkit Section */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-3xl p-6 text-white text-center shadow-2xl border border-white/5">
        <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-xl">🛠️</span>
            <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em]">Engineer's Toolkit</p>
            <span className="text-xl">⚠️</span>
        </div>
        <p className="text-[11px] font-bold text-slate-300 leading-relaxed px-2">
          This application has been developed to make the tasks of Titas Gas engineers simpler and more efficient. 
          To ensure quick access anytime, please click the <span className="text-blue-400 font-black">"Install App"</span> button at the top to save it to your home screen.
        </p>
      </div>
    </div>
  );
};

export default DeveloperNoteSlide;