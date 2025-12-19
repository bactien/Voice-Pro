
import React, { useState, useEffect, useRef } from 'react';
import { Settings, Maximize2, Minus, X, Grid, Image, Video, PenTool, Sparkles, ExternalLink, Mic, Layout } from 'lucide-react';

interface HeaderProps {
  onOpenAbout: () => void;
  onOpenHelp: () => void; 
}

export const Header: React.FC<HeaderProps> = ({ onOpenAbout, onOpenHelp }) => {
  const [avatarGif, setAvatarGif] = useState("");
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Random Tom & Jerry Avatar
    const gifs = [
      "https://media.giphy.com/media/3o7aD2e1E06GehjZkc/giphy.gif",
      "https://media.giphy.com/media/8vQSQ3cNXuDGo/giphy.gif",
      "https://media.giphy.com/media/l41lFw057lAJcYWF2/giphy.gif",
      "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
      "https://media.giphy.com/media/tXL4FHPSnVJ0A/giphy.gif",
      "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif"
    ];
    setAvatarGif(gifs[Math.floor(Math.random() * gifs.length)]);

    // Click outside to close tools menu
    function handleClickOutside(event: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setShowToolsMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const vqkTools = [
    {
      name: "AI Ảnh VQK",
      url: "https://ai.studio/apps/drive/1RWm3qdOf-G80wXDBbv6vrlRFt0DFo4E7?fullscreenApplet=true",
      icon: Image,
      desc: "Tạo ảnh nghệ thuật"
    },
    {
      name: "TRÌNH TẠO ẢNH PRO - VQK",
      url: "https://ai.studio/apps/drive/1KBimD_G8rBWcdVZFKT1Hk1Jx4lJUypmQ?fullscreenApplet=true",
      icon: Sparkles,
      desc: "Chất lượng cao 4K"
    },
    {
      name: "AI VIẾT PROMT NHÂN VẬT",
      url: "https://ai.studio/apps/drive/1fA9_2E_aBiiBZVB5jZ27CQ6aAsGLZqJA?fullscreenApplet=true",
      icon: PenTool,
      desc: "Tạo mẫu nhân vật chuẩn"
    },
    {
      name: "Phân tích video - VQK",
      url: "https://ai.studio/apps/drive/1zg2rM2ThyZ8oCA6BM6oWHfkzcA4-W7a9?fullscreenApplet=true",
      icon: Video,
      desc: "Phân tích nội dung Video"
    },
    {
      name: "Tool Tạo Thumbnail bằng AI",
      url: "https://ai.studio/apps/drive/1jcitVppc63d01iya9FtNnQSBw9A0goaF?fullscreenApplet=true",
      icon: Layout,
      desc: "Thiết kế ảnh bìa tự động"
    },
    {
      name: "AI Voice VQK Thật 95%",
      url: "https://ai.studio/apps/drive/1wtvF-nGrjF5iEja1E6E9u6l_zQ3BYBhN?fullscreenApplet=true",
      icon: Mic,
      desc: "Giọng đọc cảm xúc như thật"
    }
  ];

  return (
    <header className="h-12 bg-black border-b border-vqk-border flex items-center justify-between px-4 select-none shrink-0 z-50">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-vqk-gold shadow-[0_0_10px_rgba(255,215,0,0.5)] bg-black">
           <img src={avatarGif || "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif"} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-bold text-vqk-gold leading-none tracking-wider">
            TEXT TO VOICE PRO VQK
          </h1>
          <span className="text-[10px] text-gray-500 font-mono tracking-tight mt-0.5">
             © Developed by VQK - All Rights Reserved
          </span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        
        {/* --- TOOLS DROPDOWN --- */}
        <div className="relative" ref={toolsRef}>
            <button 
              onClick={() => setShowToolsMenu(!showToolsMenu)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all border ${showToolsMenu ? 'bg-vqk-gold text-black border-vqk-gold' : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-vqk-gold hover:text-vqk-gold'}`}
            >
               <Grid size={14} />
               Công Cụ Hữu Ích Khác
            </button>

            {showToolsMenu && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-[#1e1e1e] border border-vqk-gold rounded-lg shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-150">
                 <div className="bg-black/50 p-2 border-b border-gray-800 text-[10px] text-gray-400 uppercase font-bold text-center">
                    Hệ sinh thái AI VQK
                 </div>
                 <div className="p-1 max-h-[80vh] overflow-y-auto">
                    {vqkTools.map((tool, idx) => (
                       <a 
                         key={idx}
                         href={tool.url}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 group transition-colors"
                       >
                          <div className="w-8 h-8 rounded bg-gray-900 flex items-center justify-center border border-gray-700 group-hover:border-vqk-gold/50 group-hover:bg-black transition-colors shrink-0">
                             <tool.icon size={16} className="text-gray-400 group-hover:text-vqk-gold" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="text-xs font-bold text-gray-200 group-hover:text-vqk-gold truncate">{tool.name}</div>
                             <div className="text-[10px] text-gray-500 truncate">{tool.desc}</div>
                          </div>
                          <ExternalLink size={12} className="text-gray-600 group-hover:text-white shrink-0" />
                       </a>
                    ))}
                 </div>
              </div>
            )}
        </div>

        <div className="h-4 w-px bg-gray-700 mx-1"></div>

        {/* Zalo Link */}
        <a 
          href="https://zalo.me/g/hcvgjx613" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#0068FF]/10 px-3 py-1 rounded-full border border-[#0068FF]/30 hover:bg-[#0068FF]/20 transition-all group"
        >
            <div className="w-4 h-4 bg-[#0068FF] rounded flex items-center justify-center shadow-lg">
              <span className="text-[7px] font-black text-white">Zalo</span>
            </div>
            <span className="text-xs text-[#0068FF] font-bold group-hover:text-blue-400 hidden lg:inline">Cộng đồng AI</span>
        </a>

        <button 
          onClick={onOpenHelp}
          className="text-xs text-vqk-accentBlue hover:underline hover:text-blue-400 transition-colors whitespace-nowrap"
        >
          Hướng dẫn
        </button>
        
        <div className="h-4 w-px bg-gray-700 mx-1"></div>

        <button onClick={onOpenAbout} className="text-gray-400 hover:text-white transition-colors" title="Settings / About">
          <Settings size={18} />
        </button>

        <div className="flex items-center gap-2 ml-2">
          <button className="p-1 hover:bg-gray-800 rounded transition-colors text-gray-400">
            <Minus size={16} />
          </button>
          <button className="p-1 hover:bg-gray-800 rounded transition-colors text-gray-400">
            <Maximize2 size={16} />
          </button>
          <button className="p-1 hover:bg-red-900/50 hover:text-red-500 rounded transition-colors text-gray-400">
            <X size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
