
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SplashScreen } from './components/SplashScreen';
import { AboutModal } from './components/AboutModal';
import { HelpModal } from './components/HelpModal'; 
import { NotificationPopup } from './components/NotificationPopup'; 
import { SystemLogs } from './components/SystemLogs'; 
import { VoiceCloningModal } from './components/VoiceCloningModal'; 
import { AppConfig, QueueItem, TabType, VQKVoice, LogEntry, CustomVoice, DialogueLine } from './types';
import { generateSpeechVQK, generateContentVQK, parseScriptToDialogue, mergeMultipleAudioBuffers, audioBufferToWavBytes, createWavBlobFromBytes } from './services/geminiService';
import { checkLocalLicense } from './services/licenseService'; 
// Added Sparkles to the list of imported icons from lucide-react to fix "Cannot find name 'Sparkles'" error.
import { Play, Edit2, MessageSquare, PlusCircle, X, Loader2, AlertCircle, Download, Layers, Trash2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ isOpen: boolean; message: string; type: 'error' | 'warning' | 'success' }>({
    isOpen: false, message: '', type: 'error'
  });

  const [config, setConfig] = useState<AppConfig>({
    licenseKey: 'VQK-PRO-UNLIMITED-2025', 
    isLicensed: true, 
    selectedVoice: VQKVoice.MAI_TUAN_TAI_1,
    mastering: { delay: 150, stability: 0.5, similarity: 0.75, speed: 1.0, style: 0.0, speakerBoost: true },
    expiryTimestamp: null,
    maxChars: -1,
    customVoices: [], 
    engine: 'VQK',
    elevenLabsApiKey: '',
    elevenLabsVoices: [],
    elevenLabsModel: 'eleven_multilingual_v2', 
  });

  const [activeTab, setActiveTab] = useState<TabType>('edit');
  const [inputText, setInputText] = useState('');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogueScriptInput, setDialogueScriptInput] = useState(''); 
  const [dialogueLines, setDialogueLines] = useState<DialogueLine[]>([]);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false); 
  const [showVoiceClone, setShowVoiceClone] = useState(false); 
  const [statusMessage, setStatusMessage] = useState('VQK Pro Engine Ready');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLogsOpen, setIsLogsOpen] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const shouldProcessRef = useRef(true);

  useEffect(() => {
    const init = async () => {
      const local = checkLocalLicense();
      setConfig(prev => ({ ...prev, ...local }));
      setLoading(false);
    };
    init();
  }, []);

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' | 'system' = 'info') => {
    setLogs(prev => [...prev.slice(-99), { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), message, type }]);
  };

  const showPopup = (message: string, type: 'error' | 'warning' | 'success' = 'error') => {
    setNotification({ isOpen: true, message, type });
    addLog(message, type);
  };

  const playAudio = async (buffer: AudioBuffer) => {
    if (activeSourceRef.current) activeSourceRef.current.stop();
    if (!audioContextRef.current) audioContextRef.current = new AudioContext();
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start();
    activeSourceRef.current = source;
  };

  const handleQueueAdd = () => {
    if (!inputText.trim()) return;
    setQueue(prev => [...prev, { id: Date.now().toString(), text: inputText.trim(), voiceName: config.selectedVoice, status: 'pending', speed: config.mastering.speed }]);
    setInputText('');
    addLog(`Đã thêm nội dung mới vào hàng đợi`, 'info');
  };

  const processQueue = async () => {
    if (isProcessing) { 
      shouldProcessRef.current = false; 
      setIsProcessing(false); 
      addLog("Tiến trình bị tạm dừng bởi người dùng", "warning");
      return; 
    }
    
    shouldProcessRef.current = true;
    setIsProcessing(true);
    setStatusMessage('Đang xử lý dữ liệu API...');

    for (let i = 0; i < queue.length; i++) {
      if (!shouldProcessRef.current) break;
      if (queue[i].status === 'done') continue;
      
      setQueue(prev => { const n = [...prev]; n[i].status = 'processing'; return n; });
      const res = await generateSpeechVQK(queue[i].text, queue[i].voiceName);
      
      if (res.audioBuffer) {
        setQueue(prev => { const n = [...prev]; n[i] = { ...n[i], status: 'done', audioData: res.audioBuffer!, rawAudio: res.rawAudio }; return n; });
        addLog(`Đã hoàn thành mục #${i+1}`, 'success');
      } else {
        setQueue(prev => { const n = [...prev]; n[i].status = 'error'; return n; });
        showPopup(`Lỗi: ${res.error}`, 'error');
        setIsProcessing(false);
        setStatusMessage('Dừng xử lý do lỗi');
        return;
      }
    }
    
    setIsProcessing(false);
    setStatusMessage('VQK Pro Engine Ready');
    addLog("Toàn bộ hàng đợi đã được xử lý", "system");
  };

  const handleDownloadSingle = (item: QueueItem) => {
    if (!item.rawAudio) return;
    const blob = createWavBlobFromBytes(item.rawAudio);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VQK_${item.voiceName}_${item.id}.wav`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    const finishedItems = queue.filter(item => item.status === 'done' && item.rawAudio);
    if (finishedItems.length === 0) {
      showPopup("Không có file nào đã hoàn thiện để tải về!", "warning");
      return;
    }
    
    addLog(`Đang khởi tạo tải xuống ${finishedItems.length} file...`, 'info');
    finishedItems.forEach((item, index) => {
      setTimeout(() => {
        handleDownloadSingle(item);
      }, index * 400); // Trễ 400ms để tránh chặn browser
    });
  };

  const handleMergeAndDownload = () => {
    const finishedBuffers = queue
      .filter(item => item.status === 'done' && item.audioData)
      .map(item => item.audioData!);
      
    if (finishedBuffers.length < 2) {
      showPopup("Bạn cần ít nhất 2 đoạn đã xử lý xong để thực hiện gộp file!", "warning");
      return;
    }

    addLog("Đang tiến hành gộp tất cả các đoạn âm thanh...", "info");
    // Thêm 0.5 giây nghỉ giữa các đoạn
    const mergedBuffer = mergeMultipleAudioBuffers(finishedBuffers, 0.5);
    const wavBytes = audioBufferToWavBytes(mergedBuffer);
    const blob = createWavBlobFromBytes(wavBytes);
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VQK_PRO_MERGED_${new Date().getTime()}.wav`;
    a.click();
    URL.revokeObjectURL(url);
    addLog("Đã gộp và tải xuống file tổng hợp thành công!", "success");
  };

  const handleGenerateContent = async () => {
    setIsGeneratingContent(true);
    addLog("AI đang soạn thảo kịch bản...", "info");
    const res = await generateContentVQK(aiPrompt);
    setIsGeneratingContent(false);
    if (res.text) {
      setAiOutput(res.text);
      addLog("Kịch bản AI đã hoàn tất", "success");
    } else {
      showPopup(`Lỗi AI: ${res.error}`, "error");
    }
  };

  const handleAnalyzeScript = async () => {
    addLog("AI đang phân tích lời thoại hội thoại...", "info");
    const res = await parseScriptToDialogue(dialogueScriptInput);
    if (res.lines) {
      setDialogueLines(res.lines.map((l: any, i: number) => ({ 
        id: i.toString(), 
        characterName: l.character, 
        text: l.text, 
        voice: l.voice_suggested, 
        avatarColor: '#gold' 
      })));
      addLog("Phân tích hội thoại hoàn tất", "success");
    }
  };

  if (loading) return <SplashScreen />;

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-300 font-sans overflow-hidden">
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <NotificationPopup isOpen={notification.isOpen} message={notification.message} type={notification.type} onClose={() => setNotification(p => ({ ...p, isOpen: false }))} />
      <VoiceCloningModal isOpen={showVoiceClone} onClose={() => setShowVoiceClone(false)} onVoiceCreated={() => {}}/>
      
      <Sidebar 
        config={config} 
        setConfig={setConfig} 
        onPreviewVoice={(v) => generateSpeechVQK("Xin chào, đây là giọng đọc thử nghiệm của VQK Pro.", v).then(r => r.audioBuffer && playAudio(r.audioBuffer))} 
        isPreviewing={false} 
        showNotification={showPopup} 
        onOpenVoiceClone={() => setShowVoiceClone(true)} 
        onOpenHelp={() => setShowHelp(true)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenAbout={() => setShowAbout(true)} onOpenHelp={() => setShowHelp(true)} />
        
        <div className="flex border-b border-vqk-border bg-[#121212] px-4 pt-2 gap-1 shrink-0">
          <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 rounded-t-lg text-sm font-bold flex items-center gap-2 ${activeTab === 'edit' ? 'bg-[#1e1e1e] text-vqk-gold' : 'text-gray-500'}`}><Edit2 size={14} /> SOẠN THẢO</button>
          <button onClick={() => setActiveTab('subtitle')} className={`px-4 py-2 rounded-t-lg text-sm font-bold flex items-center gap-2 ${activeTab === 'subtitle' ? 'bg-[#1e1e1e] text-purple-400' : 'text-gray-500'}`}><Loader2 size={14} /> AI CREATOR</button>
          <button onClick={() => setActiveTab('dialogue')} className={`px-4 py-2 rounded-t-lg text-sm font-bold flex items-center gap-2 ${activeTab === 'dialogue' ? 'bg-[#1e1e1e] text-green-400' : 'text-gray-500'}`}><MessageSquare size={14} /> HỘI THOẠI</button>
          <div className="flex-1"></div>
          <div className={`flex items-center gap-3 text-xs px-2 font-bold transition-all ${isProcessing ? 'text-green-400 animate-pulse' : 'text-vqk-gold'}`}>
             {isProcessing && <Loader2 size={12} className="animate-spin" />}
             {statusMessage}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Watermark */}
          <div className="vqk-watermark">VQK PRO VERSION</div>
          
          <div className="flex-1 bg-[#121212] flex flex-col min-h-0 z-10">
            {activeTab === 'edit' && (
              <div className="p-4 h-full flex flex-col gap-4">
                <div className="flex-1 bg-[#1e1e1e]/80 backdrop-blur border border-vqk-border rounded-lg flex flex-col overflow-hidden shadow-2xl">
                    <textarea 
                      value={inputText} 
                      onChange={(e) => setInputText(e.target.value)} 
                      placeholder="Nhập hoặc dán văn bản cần chuyển đổi vào đây... (Không giới hạn ký tự)" 
                      className="flex-1 bg-transparent p-6 text-lg text-gray-200 focus:outline-none resize-none leading-relaxed"
                    />
                    <div className="p-4 bg-[#181818] flex justify-between items-center border-t border-gray-800">
                        <div className="flex flex-col">
                           <span className="text-xs text-vqk-gold font-bold">MODE: VQK PRO UNLIMITED</span>
                           <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Bản quyền đã kích hoạt cho thiết bị này</span>
                        </div>
                        <button onClick={handleQueueAdd} className="px-8 py-3 bg-vqk-gold hover:bg-yellow-400 text-black font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"><PlusCircle size={20}/> THÊM VÀO HÀNG ĐỢI</button>
                    </div>
                </div>
              </div>
            )}
            
            {activeTab === 'subtitle' && (
              <div className="p-4 h-full flex gap-4">
                <div className="w-1/3 bg-[#1e1e1e] border border-purple-900/30 rounded-lg p-6 flex flex-col gap-4 shadow-xl">
                  <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2"><Sparkles size={20}/> AI SÁNG TẠO</h3>
                  <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Nhập chủ đề video bạn muốn tạo kịch bản..." className="flex-1 bg-black/30 p-4 rounded-lg border border-gray-700 outline-none resize-none text-sm focus:border-purple-500 transition-colors"/>
                  <button onClick={handleGenerateContent} disabled={isGeneratingContent} className="py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50">
                    {isGeneratingContent ? <Loader2 className="animate-spin mx-auto"/> : "TẠO KỊCH BẢN NGAY"}
                  </button>
                </div>
                <div className="flex-1 bg-[#1e1e1e] border border-gray-800 rounded-lg p-6 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-xl">
                  {aiOutput || <div className="text-gray-600 italic">Kịch bản sáng tạo bởi AI sẽ xuất hiện tại đây...</div>}
                </div>
              </div>
            )}

            {activeTab === 'dialogue' && (
              <div className="p-4 h-full flex flex-col gap-4">
                 <div className="bg-[#1e1e1e] p-6 rounded-lg border border-green-900/30 flex gap-4 shadow-xl">
                    <textarea value={dialogueScriptInput} onChange={(e) => setDialogueScriptInput(e.target.value)} placeholder="Dán kịch bản có nhiều nhân vật thoại vào đây để AI tự động phân tích..." className="flex-1 bg-black/30 p-4 rounded-lg border border-gray-700 outline-none h-24 focus:border-green-500 transition-colors"/>
                    <button onClick={handleAnalyzeScript} className="px-8 bg-green-900/30 hover:bg-green-800 text-green-400 rounded-xl border border-green-700 font-bold transition-all">PHÂN TÍCH AI</button>
                 </div>
                 <div className="flex-1 bg-[#1e1e1e] rounded-lg border border-gray-800 p-4 overflow-y-auto shadow-inner">
                    {dialogueLines.length > 0 ? dialogueLines.map(line => (
                      <div key={line.id} className="flex gap-4 mb-4 items-start bg-black/20 p-4 rounded-xl border border-gray-800/50 hover:border-vqk-gold/30 transition-colors">
                        <div className="w-24 shrink-0 font-bold text-vqk-gold text-[10px] uppercase tracking-wider bg-black/40 p-2 rounded text-center">{line.characterName}</div>
                        <div className="flex-1 text-sm text-gray-200">{line.text}</div>
                        <div className="text-[10px] text-gray-500 italic bg-gray-800/30 px-2 py-1 rounded">{line.voice}</div>
                      </div>
                    )) : <div className="h-full flex items-center justify-center text-gray-600 italic">Chưa có dữ liệu hội thoại...</div>}
                 </div>
              </div>
            )}
          </div>

          <div className="h-[320px] border-t border-vqk-border bg-[#0d0d0d] flex flex-col z-20">
             <div className="h-10 bg-[#181818] flex items-center justify-between px-6 border-b border-gray-800">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <Layers size={14} className="text-vqk-gold" /> HÀNG ĐỢO XỬ LÝ ÂM THANH
                </div>
                <div className="flex gap-4">
                   <button onClick={handleDownloadAll} className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors"><Download size={12}/> TẢI TẤT CẢ FILE RỜI</button>
                   <button onClick={() => setQueue([])} className="text-[10px] text-red-500 hover:text-red-400 font-bold flex items-center gap-1 transition-colors"><Trash2 size={12}/> XÓA TOÀN BỘ</button>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left text-xs">
                   <thead className="bg-[#121212] text-gray-500 sticky top-0 z-10">
                     <tr>
                       <th className="p-3 w-12 text-center">#</th>
                       <th className="p-3">NỘI DUNG VĂN BẢN</th>
                       <th className="p-3 w-40">GIỌNG ĐỌC</th>
                       <th className="p-3 w-32">TRẠNG THÁI</th>
                       <th className="p-3 w-32 text-right">THAO TÁC</th>
                     </tr>
                   </thead>
                   <tbody>
                      {queue.length > 0 ? queue.map((item, i) => (
                        <tr key={item.id} className={`border-b border-gray-800/50 hover:bg-white/5 transition-colors ${item.status === 'processing' ? 'bg-blue-900/10' : ''}`}>
                          <td className="p-3 text-center text-gray-600 font-mono">{i+1}</td>
                          <td className="p-3"><div className="truncate max-w-md">{item.text}</div></td>
                          <td className="p-3 text-vqk-gold font-bold">{item.voiceName}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 w-fit ${
                              item.status === 'done' ? 'bg-green-900/50 text-green-400 border border-green-800' : 
                              item.status === 'processing' ? 'bg-blue-900/50 text-blue-400 border border-blue-800 animate-pulse' :
                              item.status === 'error' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                              'bg-gray-800 text-gray-500'
                            }`}>
                              {item.status === 'processing' && <Loader2 size={10} className="animate-spin"/>}
                              {item.status === 'error' && <AlertCircle size={10}/>}
                              {item.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-right flex justify-end gap-3">
                            {item.status === 'done' && (
                              <>
                                <button onClick={() => playAudio(item.audioData!)} className="text-green-500 hover:scale-110 transition-transform"><Play size={16}/></button>
                                <button onClick={() => handleDownloadSingle(item)} className="text-blue-500 hover:scale-110 transition-transform"><Download size={16}/></button>
                              </>
                            )}
                            <button onClick={() => setQueue(q => q.filter(x => x.id !== item.id))} className="text-gray-600 hover:text-red-500 transition-colors"><X size={16}/></button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="p-10 text-center text-gray-600 italic">Hàng đợi đang trống. Hãy thêm văn bản để bắt đầu.</td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>

             <div className="p-4 bg-[#1a1a1a] border-t border-gray-800 flex justify-between items-center shadow-2xl">
                <div className="flex gap-4">
                   <button 
                     onClick={processQueue} 
                     disabled={queue.length === 0}
                     className={`px-12 py-3 rounded-xl font-bold transition-all shadow-xl disabled:opacity-30 flex items-center gap-2 ${isProcessing ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'} text-white active:scale-95`}
                   >
                      {isProcessing ? "DỪNG LẠI" : "BẮT ĐẦU XỬ LÝ"}
                   </button>
                   
                   <button 
                     onClick={handleMergeAndDownload}
                     disabled={isProcessing || queue.filter(item => item.status === 'done').length < 2}
                     className="px-8 py-3 bg-gradient-to-r from-vqk-gold to-yellow-600 hover:from-yellow-400 hover:to-vqk-gold text-black font-bold rounded-xl shadow-xl transition-all disabled:opacity-20 disabled:grayscale flex items-center gap-2 active:scale-95"
                   >
                     <Layers size={18}/> GỘP & TẢI FILE TỔNG (PRO)
                   </button>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <div className="text-[10px] text-gray-500 font-bold uppercase">Thống kê phiên làm việc</div>
                   <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-400">Tổng: <b className="text-white">{queue.length}</b></span>
                      <span className="text-green-500">Hoàn thành: <b>{queue.filter(i => i.status === 'done').length}</b></span>
                      <span className="text-red-500">Lỗi: <b>{queue.filter(i => i.status === 'error').length}</b></span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Logs System */}
      <SystemLogs logs={logs} isProcessing={isProcessing} onClear={() => setLogs([])} isOpen={isLogsOpen} onToggle={() => setIsLogsOpen(!isLogsOpen)} />
    </div>
  );
};

export default App;
