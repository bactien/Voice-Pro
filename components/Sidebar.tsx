
import React, { useState } from 'react';
import { Mic2, ShieldCheck, ChevronDown, Search, Check, PlayCircle, StopCircle, Fingerprint, Crown, Zap, Sliders, RotateCcw, Sparkles } from 'lucide-react';
import { AppConfig, VQKVoice } from '../types';

interface SidebarProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  onPreviewVoice: (voice: string) => void;
  isPreviewing: boolean;
  showNotification: (msg: string, type: 'error' | 'warning' | 'success') => void;
  onOpenVoiceClone: () => void;
  onOpenHelp: () => void; 
}

export const Sidebar: React.FC<SidebarProps> = ({ config, setConfig, onPreviewVoice, isPreviewing }) => {
  const [showVoiceList, setShowVoiceList] = useState(false);
  const [voiceSearch, setVoiceSearch] = useState('');

  const voices = Object.values(VQKVoice);
  const filteredVoices = voices.filter(v => v.toLowerCase().includes(voiceSearch.toLowerCase()));

  const updateMastering = (key: keyof AppConfig['mastering'], value: number) => {
    setConfig(prev => ({ ...prev, mastering: { ...prev.mastering, [key]: value } }));
  };

  return (
    <aside className="w-80 bg-[#121212] border-r border-vqk-border flex flex-col h-full shrink-0 z-40">
      <div className="p-6 border-b border-vqk-border flex flex-col gap-1">
        <div className="flex items-center gap-2 text-vqk-gold">
          <Crown size={18} />
          <h2 className="font-bold text-sm tracking-widest uppercase">VQK PRO VERSION</h2>
        </div>
        <div className="bg-green-900/10 border border-green-800 rounded p-3 mt-4">
           <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
              <ShieldCheck size={14} /> LICENSED: VĨNH VIỄN
           </div>
           <div className="text-[10px] text-gray-500 mt-1 font-mono">{config.licenseKey}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Mic2 size={12}/> Chọn Giọng Đọc Chuyên Nghiệp
          </label>
          <div className="relative">
            <button 
              onClick={() => setShowVoiceList(!showVoiceList)}
              className="w-full bg-[#1e1e1e] border border-gray-800 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between hover:border-vqk-gold transition-all"
            >
              <span className="truncate text-vqk-gold font-bold">{config.selectedVoice}</span>
              <ChevronDown size={14} className={showVoiceList ? 'rotate-180' : ''}/>
            </button>
            {showVoiceList && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e1e1e] border border-vqk-gold rounded-xl shadow-2xl z-50 max-h-80 flex flex-col overflow-hidden">
                <input 
                  autoFocus 
                  placeholder="Tìm giọng..." 
                  className="p-3 bg-black/20 border-b border-gray-800 outline-none text-xs" 
                  value={voiceSearch} 
                  onChange={e => setVoiceSearch(e.target.value)}
                />
                <div className="overflow-y-auto">
                  {filteredVoices.map(v => (
                    <button 
                      key={v} 
                      onClick={() => { setConfig(p => ({ ...p, selectedVoice: v })); setShowVoiceList(false); }}
                      className="w-full p-3 text-left hover:bg-vqk-gold/10 text-xs flex justify-between items-center group"
                    >
                      <span className={config.selectedVoice === v ? 'text-vqk-gold font-bold' : 'text-gray-400 group-hover:text-white'}>{v}</span>
                      {config.selectedVoice === v && <Check size={12} className="text-vqk-gold"/>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => onPreviewVoice(config.selectedVoice)}
            className="w-full py-3 rounded-xl bg-[#1e1e1e] border border-gray-800 text-xs font-bold hover:bg-gray-800 flex items-center justify-center gap-2"
          >
            {isPreviewing ? <StopCircle size={14}/> : <PlayCircle size={14}/>} NGHE THỬ MẪU
          </button>
        </div>

        <div className="pt-6 border-t border-gray-800 space-y-6">
           <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Sliders size={12}/> Audio Mastering
              </label>
              <button onClick={() => setConfig(p => ({ ...p, mastering: { ...p.mastering, speed: 1.0, stability: 0.5, similarity: 0.75 } }))} className="text-[10px] text-gray-600 hover:text-white"><RotateCcw size={10}/></button>
           </div>
           
           <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]"><span className="text-gray-500">Tốc độ</span><span className="text-vqk-gold font-mono">{config.mastering.speed}x</span></div>
                <input type="range" min="0.5" max="2.0" step="0.1" value={config.mastering.speed} onChange={e => updateMastering('speed', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-vqk-gold"/>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]"><span className="text-gray-500">Ổn định</span><span className="text-vqk-gold font-mono">{Math.round(config.mastering.stability * 100)}%</span></div>
                <input type="range" min="0" max="1" step="0.05" value={config.mastering.stability} onChange={e => updateMastering('stability', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-vqk-gold"/>
              </div>
           </div>
        </div>

        <div className="pt-6 border-t border-gray-800">
           <button className="w-full p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl flex items-center gap-3 group hover:border-purple-500 transition-all">
              <div className="p-2 bg-purple-500 rounded-lg text-white group-hover:scale-110 transition-transform"><Fingerprint size={18}/></div>
              <div className="text-left">
                 <div className="text-xs font-bold text-white">CLONE VOICE PRO</div>
                 <div className="text-[9px] text-gray-500">Tạo giọng từ mẫu 10s</div>
              </div>
           </button>
        </div>
      </div>

      <div className="p-6 bg-[#0d0d0d] border-t border-vqk-border">
         <div className="text-[9px] text-gray-600 text-center font-mono">TEXT TO VOICE PRO VQK • v2.0.1<br/>© 2024 VQK Studio</div>
      </div>
    </aside>
  );
};
