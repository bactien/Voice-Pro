
import React, { useState, useEffect } from 'react';
import { X, Book, Zap, Mic2, Sparkles, Sliders, ShieldCheck, HelpCircle, FileText, Download, CloudLightning, Key, UserCheck, Copy, Database } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, initialTab = 'start' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const TabButton = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all border-l-2 ${
        activeTab === id
          ? 'bg-vqk-gold/10 border-vqk-gold text-vqk-gold'
          : 'border-transparent text-gray-400 hover:bg-[#252525] hover:text-white'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#1e1e1e] border border-vqk-border rounded-xl shadow-2xl flex flex-col overflow-hidden h-[600px]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-vqk-border bg-[#181818]">
          <div className="flex items-center gap-2">
            <Book size={20} className="text-vqk-gold" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">HƯỚNG DẪN SỬ DỤNG & PRO TIPS</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-64 bg-[#121212] border-r border-vqk-border flex flex-col py-2 shrink-0 overflow-y-auto">
            <TabButton id="start" label="Bắt đầu & Bản quyền" icon={ShieldCheck} />
            <TabButton id="googlekey" label="Fix Lỗi API Key" icon={Database} />
            <TabButton id="elevenlabs" label="Cấu hình ElevenLabs" icon={CloudLightning} />
            <TabButton id="tts" label="Chuyển đổi Giọng nói" icon={Mic2} />
            <TabButton id="ai" label="AI Sáng tạo (Pro)" icon={Sparkles} />
            <TabButton id="mastering" label="Tinh chỉnh Âm thanh" icon={Sliders} />
            <TabButton id="tips" label="Mẹo hay (Tips)" icon={Zap} />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-[#181818] text-gray-300 scrollbar-thin scrollbar-thumb-gray-700">
            
            {activeTab === 'start' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">1. Kích hoạt & Bản quyền</h3>
                
                <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg">
                  <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2"><ShieldCheck size={16}/> Cơ chế bảo mật Device ID</h4>
                  <p className="text-sm leading-relaxed">
                    Hệ thống sử dụng công nghệ <strong>Hardware Fingerprint</strong> (Vân tay phần cứng). 
                    Key bản quyền sẽ gắn chặt vào phần cứng máy tính của bạn. Dù bạn xóa Cache, cài lại trình duyệt hay dùng Tab ẩn danh, 
                    hệ thống vẫn nhận diện được bạn là chủ sở hữu cũ và tự động đăng nhập.
                  </p>
                </div>

                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong className="text-white">Key 18 Ngày (Trial):</strong> Giới hạn <strong>10.000 ký tự</strong> xử lý cùng lúc. Thích hợp dùng thử.</li>
                  <li><strong className="text-vqk-gold">Key Vĩnh Viễn (Lifetime):</strong> <strong>Không giới hạn ký tự (Unlimited)</strong>. Mở khóa toàn bộ tính năng Pro.</li>
                  <li><strong className="text-red-400">Lưu ý:</strong> Mỗi Key chỉ dùng cho 1 máy duy nhất. Nếu nhập Key sang máy thứ 2 sẽ bị báo lỗi. Liên hệ Admin để reset nếu đổi máy.</li>
                </ul>
              </div>
            )}

            {activeTab === 'googlekey' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                     <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Database className="text-blue-400"/> Fix Lỗi API Key (Google Gemini)
                     </h3>
                     <p className="text-sm text-gray-400 italic">
                        Nếu bạn gặp lỗi <span className="text-red-400 font-bold">429 (Quota Exceeded)</span> hoặc <span className="text-red-400 font-bold">Hết dung lượng</span>, hãy làm theo hướng dẫn này để dùng Key cá nhân (miễn phí).
                     </p>
                  </div>

                  <div className="bg-[#202020] border border-gray-700 rounded-xl p-6 shadow-lg">
                     <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
                        <Key size={20} className="text-blue-400"/> Cách lấy Key Google Gemini
                     </h4>
                     
                     <div className="space-y-4">
                        <div className="flex gap-3 items-start">
                           <div className="bg-gray-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">1</div>
                           <div>
                              <p className="text-sm text-gray-300">Truy cập <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline font-bold">aistudio.google.com/app/apikey</a>.</p>
                           </div>
                        </div>

                        <div className="flex gap-3 items-start">
                           <div className="bg-gray-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">2</div>
                           <div>
                              <p className="text-sm text-gray-300">Nhấn nút <strong>Create API key</strong> (Màu xanh dương).</p>
                           </div>
                        </div>

                        <div className="flex gap-3 items-start">
                           <div className="bg-gray-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">3</div>
                           <div>
                              <p className="text-sm text-gray-300">Chọn Project bất kỳ (hoặc tạo mới), sau đó nhấn <strong>Create API key in new project</strong>.</p>
                           </div>
                        </div>

                        <div className="flex gap-3 items-start">
                           <div className="bg-gray-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">4</div>
                           <div>
                              <p className="text-sm text-gray-300">Copy đoạn mã bắt đầu bằng <code>AIzaSy...</code></p>
                           </div>
                        </div>

                        <div className="flex gap-3 items-start">
                           <div className="bg-vqk-gold text-black font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">5</div>
                           <div>
                              <p className="text-sm text-white font-bold">Quay lại App -> Nhấn nút "Fix API Key" -> Dán vào ô nhập liệu.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'elevenlabs' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div>
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                       <CloudLightning className="text-vqk-gold"/> Cấu hình ElevenLabs (Engine Turbo)
                    </h3>
                    <p className="text-sm text-gray-400 italic">
                       ElevenLabs là công nghệ tạo giọng nói AI hàng đầu thế giới (Tự nhiên nhất hiện nay). Để sử dụng, bạn cần có tài khoản và Key riêng từ họ.
                    </p>
                 </div>

                 {/* SECTION 1: API KEY */}
                 <div className="bg-[#202020] border border-gray-700 rounded-xl p-6 hover:border-vqk-gold/50 transition-colors shadow-lg">
                    <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
                       <Key size={20} className="text-vqk-gold"/> 1. Cách lấy API Key (Bắt buộc)
                    </h4>
                    
                    <div className="space-y-4">
                       <div className="flex gap-3 items-start">
                          <div className="bg-gray-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">1</div>
                          <div>
                             <p className="text-sm text-gray-300">Truy cập website <a href="https://elevenlabs.io" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline font-bold">elevenlabs.io</a> và Đăng nhập (Sign In).</p>
                          </div>
                       </div>

                       <div className="flex gap-3 items-start">
                          <div className="bg-gray-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">2</div>
                          <div>
                             <p className="text-sm text-gray-300">Nhấn vào <strong>Avatar (Ảnh đại diện)</strong> của bạn ở góc dưới bên trái màn hình.</p>
                          </div>
                       </div>

                       <div className="flex gap-3 items-start">
                          <div className="bg-gray-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">3</div>
                          <div>
                             <p className="text-sm text-gray-300">Chọn menu <strong>Profile + API Key</strong>.</p>
                          </div>
                       </div>

                       <div className="flex gap-3 items-start">
                          <div className="bg-gray-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">4</div>
                          <div>
                             <p className="text-sm text-gray-300">Nhấn vào biểu tượng <strong>"Con Mắt"</strong> để hiện Key, sau đó bấm nút Copy bên cạnh.</p>
                             <div className="mt-2 bg-black/50 p-2 rounded border border-gray-600 text-xs font-mono text-gray-400">
                                Key mẫu: <span className="text-green-400">0123456789abcdef0123456789abcdef</span>
                             </div>
                          </div>
                       </div>

                       <div className="flex gap-3 items-start">
                          <div className="bg-vqk-gold text-black font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">5</div>
                          <div>
                             <p className="text-sm text-white font-bold">Quay lại App VQK -> Dán Key vào ô "ElevenLabs API Keys" ở cột bên trái -> Bấm "Lưu Key".</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* SECTION 2: VOICE ID */}
                 <div className="bg-[#202020] border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors shadow-lg">
                    <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
                       <UserCheck size={20} className="text-blue-400"/> 2. Cách lấy Voice ID (Thêm giọng mới)
                    </h4>
                    
                    <div className="space-y-4">
                        <div className="bg-blue-900/20 p-3 rounded text-xs text-blue-200 mb-2">
                           Voice ID là mã định danh duy nhất cho mỗi giọng nói (kể cả giọng có sẵn hoặc giọng bạn tự Clone).
                        </div>

                       <div className="flex gap-3 items-start">
                          <div className="bg-gray-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">1</div>
                          <div>
                             <p className="text-sm text-gray-300">Trên ElevenLabs, vào mục <strong>Voices</strong> hoặc <strong>VoiceLab</strong>.</p>
                          </div>
                       </div>

                       <div className="flex gap-3 items-start">
                          <div className="bg-gray-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">2</div>
                          <div>
                             <p className="text-sm text-gray-300">Chọn giọng bạn muốn sử dụng (Giọng có sẵn hoặc giọng đã Clone).</p>
                          </div>
                       </div>

                       <div className="flex gap-3 items-start">
                          <div className="bg-gray-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">3</div>
                          <div>
                             <p className="text-sm text-gray-300">
                                Bấm vào dòng <strong>ID</strong> (thường là một dãy ký tự ngẫu nhiên, ví dụ: <code className="bg-black px-1 py-0.5 rounded text-gray-400">21m00Tcm4TlvDq8ikWAM</code>) để Copy.
                             </p>
                          </div>
                       </div>

                       <div className="flex gap-3 items-start">
                          <div className="bg-blue-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">4</div>
                          <div>
                             <p className="text-sm text-white font-bold">Quay lại App VQK, nhập vào ô "Thêm Giọng" theo đúng cú pháp:</p>
                             <div className="mt-2 p-3 bg-black border border-blue-500/50 rounded text-center">
                                <span className="text-gray-400">Tên Gợi Nhớ</span> <span className="text-vqk-gold mx-2">|</span> <span className="text-green-400">Voice_ID_Vừa_Copy</span>
                             </div>
                             <p className="text-xs text-gray-500 mt-1 text-center">Ví dụ: <strong>Giọng Sếp Tuấn | 21m00Tcm4TlvDq8ikWAM</strong></p>
                          </div>
                       </div>
                       
                       <div className="flex gap-3 items-start">
                          <div className="bg-gray-800 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">5</div>
                          <div>
                             <p className="text-sm text-gray-300">Bấm nút <strong>(+)</strong> màu xanh để thêm. Giọng mới sẽ hiện trong danh sách chọn giọng.</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'tts' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">2. Chuyển đổi Văn bản thành Giọng nói</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#252525] p-4 rounded border border-gray-700">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><FileText size={16}/> Soạn thảo</h4>
                    <p className="text-xs text-gray-400">
                      Nhập văn bản vào khung lớn. Hỗ trợ xuống dòng tự động. Bạn có thể nhập nội dung rất dài (lên tới 100.000 ký tự với bản Pro).
                    </p>
                  </div>
                  <div className="bg-[#252525] p-4 rounded border border-gray-700">
                     <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Download size={16}/> Tải xuống</h4>
                     <p className="text-xs text-gray-400">
                       Bấm nút <span className="text-green-400">Tải về các file đã chọn</span> ở dưới cùng để tải file .WAV chất lượng cao (Lossless).
                     </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-vqk-gold">Quy trình xử lý (Queue System):</h4>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>Chọn giọng đọc ở Sidebar bên trái.</li>
                    <li>Nhập văn bản -> Bấm <strong>"Thêm vào danh sách xử lý"</strong>.</li>
                    <li>Văn bản sẽ vào hàng đợi bên dưới. Hệ thống tự động chạy lần lượt từng dòng (Auto Run).</li>
                    <li>Bạn có thể thêm tiếp văn bản khác trong khi hệ thống đang đọc dòng trước.</li>
                  </ol>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">3. AI Sáng tạo nội dung (VQK Creator)</h3>
                <p className="text-sm italic text-gray-400">
                  Đây là tính năng độc quyền giúp bạn viết kịch bản YouTube, TikTok chỉ trong 30 giây.
                </p>

                <div className="bg-purple-900/20 border border-purple-700 p-4 rounded-lg space-y-3">
                  <h4 className="text-purple-300 font-bold flex items-center gap-2"><Sparkles size={16}/> Cách sử dụng hiệu quả:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <span className="text-white font-bold">Bước 1:</span> Nhập ý tưởng vào ô Prompt. <br/>
                      <span className="text-gray-500">VD: "Viết truyện ma kinh dị về ngôi trường bỏ hoang, có hội thoại."</span>
                    </li>
                    <li>
                      <span className="text-white font-bold">Bước 2:</span> Kéo thanh trượt <strong>Thời lượng đọc</strong>. <br/>
                      <span className="text-gray-500">AI sẽ tự tính toán độ dài văn bản để khớp với số phút bạn chọn (VD: 5 phút ~ 4500 ký tự).</span>
                    </li>
                    <li>
                      <span className="text-white font-bold">Bước 3:</span> Bấm <strong>Tạo Nội Dung</strong> và chờ AI viết.
                    </li>
                    <li>
                      <span className="text-white font-bold">Bước 4:</span> Sửa lại văn bản nếu cần -> Bấm <strong>Chuyển sang giọng đọc ngay</strong>.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'mastering' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">4. Tinh chỉnh Âm thanh (Mastering)</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-vqk-gold font-bold">Tốc độ (Speed)</h4>
                    <p className="text-sm text-gray-400">1.0 là chuẩn. Review phim nên để <strong>1.1 - 1.2</strong>. Kể chuyện ma nên để <strong>0.8 - 0.9</strong>.</p>
                  </div>
                  
                  <div>
                    <h4 className="text-vqk-gold font-bold">Ổn định giọng (Stability)</h4>
                    <p className="text-sm text-gray-400">
                      - <strong>Cao (0.8 - 1.0):</strong> Giọng đều đều, ít cảm xúc, phù hợp đọc tin tức, báo chí.<br/>
                      - <strong>Thấp (0.3 - 0.5):</strong> Giọng biến thiên, nhấn nhá, nhiều cảm xúc, phù hợp kể chuyện, review gắt.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-vqk-gold font-bold">Độ tương đồng (Similarity)</h4>
                    <p className="text-sm text-gray-400">Quyết định mức độ giống giọng gốc hay giọng máy. Nên để mặc định <strong>0.75</strong>.</p>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-700/50 p-3 rounded">
                    <strong className="text-white text-sm">💡 Mẹo:</strong> Dùng nút <strong>AUTO FIX</strong> ở Sidebar để AI tự động cấu hình thông số chuẩn nhất cho từng loại giọng (MC, Review, Kể chuyện...).
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">5. Mẹo hay & Thủ thuật (Pro Tips)</h3>
                
                <div className="grid grid-cols-1 gap-4">
                   <div className="bg-[#202020] p-4 rounded border-l-4 border-green-500">
                      <h4 className="font-bold text-white mb-1">Dùng nhiều giọng trong 1 bài</h4>
                      <p className="text-xs text-gray-400">
                        Bạn có thể chọn giọng A -> Nhập text -> Thêm vào hàng đợi. Sau đó chọn giọng B -> Nhập text -> Thêm vào hàng đợi.
                        App sẽ tự động xử lý lần lượt. Cuối cùng tải tất cả về và ghép lại.
                      </p>
                   </div>

                   <div className="bg-[#202020] p-4 rounded border-l-4 border-blue-500">
                      <h4 className="font-bold text-white mb-1">Cách ngắt nghỉ đúng chỗ</h4>
                      <p className="text-xs text-gray-400">
                        Sử dụng dấu phẩy (,) để nghỉ ngắn. Sử dụng dấu chấm (.) để nghỉ dài. 
                        Muốn nghỉ lâu hơn nữa? Hãy dùng dấu ba chấm (...) hoặc xuống dòng.
                      </p>
                   </div>

                   <div className="bg-[#202020] p-4 rounded border-l-4 border-purple-500">
                      <h4 className="font-bold text-white mb-1">Nạp file lớn (Tiểu thuyết)</h4>
                      <p className="text-xs text-gray-400">
                        Dùng Tab <strong>"Nạp File"</strong> để tải lên file .txt chứa cả quyển truyện. App sẽ tự động tách từng dòng thành từng file audio riêng biệt, giúp bạn dễ dàng kiểm soát lỗi sai từng đoạn.
                      </p>
                   </div>

                   <div className="bg-[#202020] p-4 rounded border-l-4 border-red-500">
                      <h4 className="font-bold text-white mb-1">Xử lý khi bị lỗi Server Busy</h4>
                      <p className="text-xs text-gray-400">
                        Nếu thấy thông báo lỗi đỏ. Đừng lo, chỉ cần đợi 10-15s rồi bấm nút <strong>Play (Tam giác)</strong> ở thanh dưới cùng để App thử lại dòng đó.
                      </p>
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-[#121212] border-t border-vqk-border flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-vqk-gold hover:bg-yellow-400 text-black font-bold rounded uppercase transition-colors"
          >
            Đã Hiểu & Bắt Đầu
          </button>
        </div>

      </div>
    </div>
  );
};
