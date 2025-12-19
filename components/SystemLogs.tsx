
import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Activity, Cpu, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { LogEntry } from '../types';

interface SystemLogsProps {
  logs: LogEntry[];
  isProcessing: boolean;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const SystemLogs: React.FC<SystemLogsProps> = ({ logs, isProcessing, onClear, isOpen, onToggle }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Fake System Stats
  const [cpuUsage, setCpuUsage] = useState(12);
  const [ramUsage, setRamUsage] = useState(45);
  const [gifIndex, setGifIndex] = useState(0);
  
  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  // Simulate System fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isProcessing) {
         setCpuUsage(prev => Math.min(99, Math.max(40, prev + (Math.random() * 20 - 10))));
         setRamUsage(prev => Math.min(80, Math.max(50, prev + (Math.random() * 5 - 2))));
      } else {
         setCpuUsage(prev => Math.min(20, Math.max(5, prev + (Math.random() * 10 - 5))));
         setRamUsage(prev => Math.min(50, Math.max(40, prev + (Math.random() * 2 - 1))));
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [isProcessing]);

  // Rotate GIF every 8 seconds to keep it fresh but not too chaotic
  useEffect(() => {
    const interval = setInterval(() => {
      setGifIndex(prev => prev + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // --- TOM & JERRY GIF COLLECTION (EXPANDED) ---
  const tomJerryWorking = [
    "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif", // Tom typing fast
    "https://media.giphy.com/media/4ZnXKaGTW6mJO/giphy.gif", // Tom conducting (busy)
    "https://media.giphy.com/media/ule4vhcY1xEKQ/giphy.gif", // Jerry running
    "https://media.giphy.com/media/Zdg7kl9bnyqXrPH2jq/giphy.gif", // Jerry writing
    "https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif", // Tom reading newspaper fast
    "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif", // Cat typing
    "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif", // Computer cat
    "https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif", // Gamer cat
    "https://media.giphy.com/media/ule4vhcY1xEKQ/giphy.gif", // Jerry running wheel
    "https://media.giphy.com/media/Q81NcsY6YxK7jxnr4v/giphy.gif" // Tom planning
  ];
  
  const tomJerryIdle = [
     "https://media.giphy.com/media/tXL4FHPSnVJ0A/giphy.gif", // Tom Waiting (Tapping fingers)
     "https://media.giphy.com/media/mguPrVJAnEHIY/giphy.gif", // Tom Sleeping
     "https://media.giphy.com/media/pBj0EoGSYjGms/giphy.gif", // Jerry Relaxing
     "https://media.giphy.com/media/NWg7oQBwFcn7cRlIi6/giphy.gif", // Tom Relaxing
     "https://media.giphy.com/media/l41lFw057lAJcYWF2/giphy.gif", // Tom & Jerry Friends
     "https://media.giphy.com/media/8vQSQ3cNXuDGo/giphy.gif", // Tom drinking milk
     "https://media.giphy.com/media/CF93KWqOLHGlW/giphy.gif", // Tom eating
     "https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif", // Jerry eating cheese
     "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif", // Cat OMG
     "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif" // Tom smiling
  ];

  const activeList = isProcessing ? tomJerryWorking : tomJerryIdle;
  const currentGif = activeList[gifIndex % activeList.length];

  return (
    <div className={`border-t border-vqk-border bg-[#0d0d0d] flex flex-col transition-all duration-300 ${isOpen ? 'h-48' : 'h-8'}`}>
      
      {/* HEADER BAR */}
      <div 
        onClick={onToggle}
        className="h-8 bg-[#181818] flex items-center justify-between px-4 cursor-pointer hover:bg-[#202020] select-none relative group"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
           <Terminal size={14} className="text-vqk-gold"/>
           <span className="uppercase tracking-wider hidden sm:inline">System Logs (VQK Core)</span>
           {isProcessing && (
              <span className="ml-2 px-2 py-0.5 bg-green-900/50 text-green-400 rounded text-[9px] animate-pulse border border-green-800">
                PROCESSING...
              </span>
           )}
        </div>

        {/* --- INSTRUCTION TEXT (BLINKING) --- */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-vqk-gold animate-pulse flex items-center gap-2 shadow-black drop-shadow-md">
                {isOpen ? "▼ Ấn vào đây để ẩn thanh trạng thái ▼" : "▲ Ấn vào đây để hiện chi tiết ▲"}
            </span>
        </div>

        <div className="flex items-center gap-2 text-gray-500">
           {isOpen ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}
        </div>
      </div>

      {/* CONTENT AREA */}
      {isOpen && (
        <div className="flex flex-1 overflow-hidden">
           
           {/* LEFT: LOG CONSOLE */}
           <div className="flex-1 p-2 font-mono text-[10px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent relative" ref={scrollRef}>
              <button 
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="absolute top-2 right-2 p-1 hover:bg-red-900/30 text-gray-600 hover:text-red-500 rounded z-10"
                title="Clear Logs"
              >
                 <Trash2 size={12}/>
              </button>

              {logs.length === 0 && (
                 <div className="text-gray-600 italic pt-2 pl-2">System initialized. Waiting for tasks...</div>
              )}
              
              {logs.map((log) => (
                 <div key={log.id} className="mb-0.5 flex gap-2">
                    <span className="text-gray-600">[{log.timestamp}]</span>
                    <span className={`
                       ${log.type === 'error' ? 'text-red-500 font-bold' : ''}
                       ${log.type === 'warning' ? 'text-yellow-500' : ''}
                       ${log.type === 'success' ? 'text-green-400' : ''}
                       ${log.type === 'system' ? 'text-blue-400' : ''}
                       ${log.type === 'info' ? 'text-gray-300' : ''}
                    `}>
                       {log.type === 'system' && <span className="text-blue-600 mr-1">[SYS]</span>}
                       {log.message}
                    </span>
                 </div>
              ))}
              <div className="h-2"></div> {/* Spacer */}
           </div>

           {/* RIGHT: MONITOR & CAT */}
           <div className="w-64 border-l border-vqk-border bg-[#111] p-2 flex flex-col gap-2 shrink-0">
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                 <div className="bg-black border border-gray-800 p-1.5 rounded flex flex-col justify-between group hover:border-vqk-gold/50 transition-colors">
                    <div className="text-gray-500 flex items-center gap-1"><Cpu size={10}/> CPU Usage</div>
                    <div className="text-right font-bold text-vqk-gold">{cpuUsage.toFixed(1)}%</div>
                    <div className="h-1 bg-gray-800 rounded mt-1 overflow-hidden">
                       <div className="h-full bg-vqk-gold transition-all duration-500" style={{width: `${cpuUsage}%`}}></div>
                    </div>
                 </div>
                 <div className="bg-black border border-gray-800 p-1.5 rounded flex flex-col justify-between group hover:border-vqk-gold/50 transition-colors">
                    <div className="text-gray-500 flex items-center gap-1"><Activity size={10}/> RAM Usage</div>
                    <div className="text-right font-bold text-green-500">{ramUsage.toFixed(1)}%</div>
                     <div className="h-1 bg-gray-800 rounded mt-1 overflow-hidden">
                       <div className="h-full bg-green-500 transition-all duration-500" style={{width: `${ramUsage}%`}}></div>
                    </div>
                 </div>
              </div>

              {/* TOM & JERRY GIF FRAME */}
              <div className="flex-1 bg-black border border-gray-800 rounded relative overflow-hidden flex items-center justify-center group">
                 <img 
                   src={currentGif} 
                   alt="VQK AI Visual" 
                   className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                 />
                 
                 {/* Status Text Overlay */}
                 <div className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[8px] text-white font-mono uppercase border border-gray-600">
                    STATUS: {isProcessing ? <span className="text-green-400 animate-pulse">WORKING...</span> : <span className="text-gray-400">IDLE</span>}
                 </div>
              </div>

           </div>
        </div>
      )}
    </div>
  );
};
