import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, Mic2, Activity, CheckCircle, Fingerprint, Lock, ShieldCheck, PlayCircle, PauseCircle, Layers, Cpu, Database, ShoppingBag, BookOpen, Radio, Heart } from 'lucide-react';
import { CustomVoice } from '../types';

interface VoiceCloningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceCreated: (newVoice: CustomVoice) => void;
}

type CloneStyle = 'REVIEW' | 'STORY' | 'NEWS' | 'SOFT';

export const VoiceCloningModal: React.FC<VoiceCloningModalProps> = ({ isOpen, onClose, onVoiceCreated }) => {
  const [step, setStep] = useState<'upload' | 'style' | 'analyzing' | 'training' | 'done'>('upload');
  const [voiceName, setVoiceName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<CloneStyle>('REVIEW');
  
  // State for 3 separate samples
  const [samples, setSamples] = useState<(File | null)[]>([null, null, null]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([null, null, null]);

  // Analysis Animation States
  const [progress, setProgress] = useState(0);
  const [logText, setLogText] = useState("");

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setStep('upload');
      setVoiceName('');
      setSamples([null, null, null]);
      setPlayingIndex(null);
      setProgress(0);
      setSelectedStyle('REVIEW');
    }
  }, [isOpen]);

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSamples(prev => {
        const newSamples = [...prev];
        newSamples[index] = file;
        return newSamples;
      });
    }
  };

  const togglePreview = (index: number) => {
    const audioEl = audioRefs.current[index];
    if (!audioEl || !samples[index]) return;

    if (playingIndex === index) {
      audioEl.pause();
      setPlayingIndex(null);
    } else {
      // Stop others
      audioRefs.current.forEach(a => a?.pause());
      
      // Play this one
      audioEl.src = URL.createObjectURL(samples[index]!);
      audioEl.play();
      setPlayingIndex(index);
    }
  };

  const goToStyleSelection = () => {
    if (samples.some(s => s === null) || !voiceName.trim()) return;
    setStep('style');
  };

  const startCloning = () => {
    setStep('analyzing');
    
    // Simulate complex analysis process for 3 files with Style integration
    const logs = [
      "Khởi tạo phiên VQK Deep Learning...",
      "Tải lên 3 Mẫu âm thanh...",
      `Cấu hình Core Style: ${selectedStyle} MODE...`,
      "Phân tích chéo 3 mẫu (Tri-Vector Analysis)...",
      "Trích xuất đặc trưng âm vực (Pitch/Timbre)...",
      "Đồng bộ ngữ điệu với Style đã chọn...",
      "Loại bỏ tạp âm môi trường (Noise Reduction)...",
      "Tổng hợp Vector giọng nói gốc (Voice Fusion)...",
      "Fine-tuning Gemini 2.5 Pro Model...",
      "Kiểm tra độ chính xác (Accuracy Check)...",
      "Hoàn tất! Lưu trữ Neural Voice..."
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('done');
          return 100;
        }
        return prev + 1; // 100 ticks
      });

      // Update log text
      if (currentLog < logs.length && Math.random() > 0.85) {
         setLogText(logs[currentLog]);
         currentLog++;
      }
    }, 120); 
  };

  const handleFinish = () => {
    const newVoice: CustomVoice = {
      id: `custom_${Date.now()}`,
      name: `[CLONE - ${selectedStyle}] ${voiceName}`, // Save Style in Name for Parser
      createdAt: Date.now()
    };
    onVoiceCreated(newVoice);
    onClose();
  };

  const styles: {id: CloneStyle, label: string, desc: string, icon: any}[] = [
    { id: 'REVIEW', label: 'Review / Bán Hàng', desc: 'Năng lượng cao, Sôi nổi, Nhanh', icon: ShoppingBag },
    { id: 'STORY', label: 'Kể Chuyện / Vụ Án', desc: 'Trầm ấm, Sâu lắng, Huyền bí', icon: BookOpen },
    { id: 'NEWS', label: 'Tin Tức / Thời Sự', desc: 'Rõ ràng, Đanh thép, Chuẩn mực', icon: Radio },
    { id: 'SOFT', label: 'Trợ Lý / Tâm Sự', desc: 'Nhẹ nhàng, Thân thiện, Êm ái', icon: Heart },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-vqk-gold rounded-xl shadow-[0_0_80px_rgba(255,215,0,0.15)] overflow-hidden flex flex-col relative h-[650px]">
        
        {/* Header */}
        <div className="h-16 border-b border-gray-800 bg-[#121212] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-vqk-gold/20 rounded-full border border-vqk-gold/50">
               <Fingerprint size={24} className="text-vqk-gold" />
            </div>
            <div>
               <h2 className="font-bold text-lg text-white tracking-widest uppercase">VQK CLONE MASTER</h2>
               <p className="text-[10px] text-gray-500 font-mono">AI Neural Engine V2 • Tri-Sample Technology</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar">
          
          {step === 'upload' && (
            <div className="w-full h-full flex flex-col animate-in slide-in-from-bottom-5 duration-300">
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Bước 1: Nạp dữ liệu Training</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  Vui lòng cung cấp 3 đoạn ghi âm mẫu để đảm bảo độ chính xác <span className="text-vqk-gold font-bold">100%</span>.
                </p>
              </div>

              {/* 3 Upload Boxes Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[0, 1, 2].map((index) => (
                   <div key={index} className="relative group">
                      <div className={`h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden ${samples[index] ? 'border-green-500 bg-green-900/10' : 'border-gray-700 bg-[#151515] hover:border-vqk-gold'}`}>
                         
                         <input 
                           type="file" 
                           accept="audio/*"
                           onChange={(e) => handleFileChange(index, e)}
                           className="absolute inset-0 opacity-0 cursor-pointer z-10"
                         />
                         
                         {samples[index] ? (
                            <>
                               <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                                  <CheckCircle size={16} className="text-black" />
                               </div>
                               <div className="px-2 text-center z-20 pointer-events-none">
                                  <p className="text-[10px] text-green-400 font-bold truncate w-24">{samples[index]?.name}</p>
                                  <p className="text-[9px] text-gray-500">{(samples[index]!.size / 1024 / 1024).toFixed(2)} MB</p>
                               </div>
                            </>
                         ) : (
                            <>
                               <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-vqk-gold/20 transition-colors">
                                  <UploadCloud size={16} className="text-gray-400 group-hover:text-vqk-gold" />
                               </div>
                               <div className="text-center">
                                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-white block">MẪU {index + 1}</span>
                               </div>
                            </>
                         )}

                         {/* Play Button */}
                         {samples[index] && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); togglePreview(index); }}
                              className="absolute bottom-1 right-1 z-30 p-1 bg-black/50 hover:bg-black rounded-full text-white border border-gray-600 hover:border-vqk-gold transition-all"
                            >
                               {playingIndex === index ? <PauseCircle size={12} className="text-vqk-gold"/> : <PlayCircle size={12}/>}
                            </button>
                         )}
                         <audio ref={(el) => { audioRefs.current[index] = el; }} onEnded={() => setPlayingIndex(null)} className="hidden" />
                      </div>
                   </div>
                ))}
              </div>

              {/* Name Input */}
              <div className="mb-6">
                 <label className="text-xs text-gray-500 font-bold uppercase mb-2 block flex items-center gap-2">
                    <Mic2 size={12}/> Tên định danh giọng nói
                 </label>
                 <input 
                    type="text" 
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    placeholder="Đặt tên cho giọng (Ví dụ: Giọng Chính Chủ, Sếp Tuấn...)"
                    className="w-full bg-[#151515] border border-gray-700 rounded-lg p-4 text-white focus:border-vqk-gold focus:outline-none text-sm placeholder-gray-600"
                 />
              </div>

              <div className="mt-auto">
                 <button 
                  onClick={goToStyleSelection}
                  disabled={samples.some(s => s === null) || !voiceName.trim()}
                  className="w-full py-4 bg-vqk-gold hover:bg-yellow-400 text-black font-bold uppercase rounded-lg shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm tracking-wider"
                >
                  TIẾP TỤC: CHỌN PHONG CÁCH
                </button>
              </div>
            </div>
          )}

          {step === 'style' && (
            <div className="w-full h-full flex flex-col animate-in slide-in-from-right-5 duration-300">
               <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Bước 2: Chọn Phong Cách Cốt Lõi</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  Chọn đúng phong cách giúp AI tối ưu ngữ điệu (Intonation) chuẩn xác nhất cho nội dung của bạn.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                 {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-3 text-center group ${
                        selectedStyle === style.id 
                        ? 'border-vqk-gold bg-vqk-gold/10' 
                        : 'border-gray-800 bg-[#151515] hover:border-gray-600'
                      }`}
                    >
                       <div className={`p-3 rounded-full ${selectedStyle === style.id ? 'bg-vqk-gold text-black' : 'bg-gray-800 text-gray-400 group-hover:text-white'}`}>
                          <style.icon size={24} />
                       </div>
                       <div>
                          <h4 className={`font-bold ${selectedStyle === style.id ? 'text-vqk-gold' : 'text-white'}`}>{style.label}</h4>
                          <p className="text-[10px] text-gray-500 mt-1">{style.desc}</p>
                       </div>
                    </button>
                 ))}
              </div>

              <div className="mt-auto flex gap-3">
                 <button 
                    onClick={() => setStep('upload')}
                    className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold uppercase rounded-lg transition-all"
                 >
                    Quay lại
                 </button>
                 <button 
                  onClick={startCloning}
                  className="flex-1 py-4 bg-vqk-gold hover:bg-yellow-400 text-black font-bold uppercase rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all flex items-center justify-center gap-3 text-sm tracking-wider"
                >
                  <Cpu size={20} />
                  BẮT ĐẦU TRAINING (DEEP LEARNING)
                </button>
              </div>
            </div>
          )}

          {(step === 'analyzing' || step === 'training') && (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in">
               
               {/* Central Animation */}
               <div className="relative w-48 h-48">
                  {/* Outer Rings */}
                  <div className="absolute inset-0 border border-gray-800 rounded-full animate-ping opacity-20" style={{animationDuration: '3s'}}></div>
                  <div className="absolute inset-4 border border-gray-700 rounded-full animate-ping opacity-20" style={{animationDuration: '2s'}}></div>
                  
                  {/* Rotating Elements */}
                  <div className="absolute inset-0 border-2 border-transparent border-t-vqk-gold rounded-full animate-spin" style={{animationDuration: '2s'}}></div>
                  <div className="absolute inset-2 border-2 border-transparent border-r-green-500 rounded-full animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}}></div>
                  
                  {/* Core Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Layers size={48} className="text-white animate-pulse" />
                  </div>

                  {/* Sample Nodes */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 px-2 py-1 rounded text-[10px] text-gray-400">Sample 1</div>
                  <div className="absolute bottom-4 -left-4 bg-gray-900 border border-gray-700 px-2 py-1 rounded text-[10px] text-gray-400">Sample 2</div>
                  <div className="absolute bottom-4 -right-4 bg-gray-900 border border-gray-700 px-2 py-1 rounded text-[10px] text-gray-400">Sample 3</div>
               </div>

               <div className="w-full max-w-md space-y-3 text-center">
                 <h3 className="text-xl font-bold text-white tracking-widest animate-pulse flex items-center justify-center gap-2">
                    <Database size={20} className="text-vqk-gold"/>
                    AI TRAINING PROCESS
                 </h3>
                 <div className="h-6 overflow-hidden">
                    <p className="text-xs text-vqk-gold font-mono">{logText}</p>
                 </div>
               </div>

               {/* Pro Progress Bar */}
               <div className="w-full max-w-lg space-y-2">
                   <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold">
                      <span>Analyzing</span>
                      <span>Merging</span>
                      <span>Fine-tuning</span>
                   </div>
                   <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800 relative">
                      <div 
                        className="h-full bg-gradient-to-r from-vqk-gold to-yellow-200 shadow-[0_0_15px_rgba(255,215,0,0.6)] transition-all duration-100 ease-out"
                        style={{width: `${progress}%`}}
                      ></div>
                   </div>
                   <div className="text-center text-xs font-bold text-white">{progress}%</div>
               </div>
            </div>
          )}

          {step === 'done' && (
            <div className="w-full text-center space-y-8 animate-in zoom-in duration-500">
               <div className="w-24 h-24 bg-green-900/10 border-4 border-green-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)] relative">
                  <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-ping opacity-20"></div>
                  <CheckCircle size={48} className="text-green-500" />
               </div>
               
               <div>
                 <h3 className="text-3xl font-bold text-white mb-2">CLONE HOÀN TẤT!</h3>
                 <p className="text-gray-400 text-sm">
                   Đã tạo thành công giọng <span className="text-vqk-gold font-bold text-base">"{voiceName}"</span> với phong cách <span className="text-vqk-gold font-bold">{styles.find(s => s.id === selectedStyle)?.label}</span>.
                 </p>
                 <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-gray-900 rounded border border-gray-800 text-xs text-gray-500">
                    <ShieldCheck size={12}/> Đã lưu vào VQK Secure Cloud
                 </div>
               </div>

               <button 
                onClick={handleFinish}
                className="w-full max-w-xs mx-auto py-4 bg-green-600 hover:bg-green-500 text-white font-bold uppercase rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Sử dụng ngay
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};