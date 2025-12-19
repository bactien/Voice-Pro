
export interface QueueItem {
  id: string;
  text: string;
  voiceName: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  audioData?: AudioBuffer; // Store decoded audio buffer for playback
  rawAudio?: Uint8Array;   // Store raw PCM data for download
  selected?: boolean;      // For bulk actions
  speed?: number;          // Playback speed
  // New fields for Merged Dialogue Processing
  isDialogueSequence?: boolean; 
  dialogueLines?: DialogueLine[];
  progressStr?: string; // To show "Processing 3/10..."
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
}

export interface CustomVoice {
  id: string;
  name: string;
  createdAt: number;
}

export interface DialogueLine {
  id: string;
  characterName: string;
  avatarColor: string; // Hex color for UI
  voice: string;
  text: string;
}

export enum VQKVoice {
  // --- GIỌNG TRẺ CON & HOẠT HÌNH (NEW UPDATE 100%) ---
  KID_BABY_CUTE = 'Kid Baby Cute - Em Bé 3 Tuổi (Ngọng líu)',
  KID_BOY_ACTIVE = 'Kid Boy Active - Bé Trai Năng Động (6-8 tuổi)',
  KID_GIRL_SWEET = 'Kid Girl Sweet - Bé Gái Dịu Dàng (6-8 tuổi)',
  KID_BOY_TEEN = 'Kid Boy Teen - Thiếu Niên (12-15 tuổi)',
  KID_GIRL_TEEN = 'Kid Girl Teen - Thiếu Nữ (12-15 tuổi)',
  CARTOON_MOUSE = 'Cartoon Mouse - Giọng Chuột (Vui nhộn/High Pitch)',
  CARTOON_ROBOT_KID = 'Cartoon Robot Kid - Robot Nhí (Thông minh)',
  CARTOON_PRINCESS = 'Cartoon Princess - Công Chúa Nhỏ (Trong trẻo)',
  CARTOON_VILLAIN_KID = 'Cartoon Villain Kid - Nhóc Trùm (Tinh nghịch)',
  KID_STORYTELLER = 'Kid Storyteller - Bé Kể Chuyện (Truyền cảm)',

  // --- GEMINI 2.5 FLASH PREVIEW TTS (TỐC ĐỘ CAO/INTERACTIVE) ---
  GEMINI_FLASH_FAST = 'Gemini 2.5 Flash - Tốc độ cao (Thông báo nhanh)',
  GEMINI_FLASH_FRIENDLY = 'Gemini 2.5 Flash - Thân thiện (CSKH/Trợ lý)',
  GEMINI_FLASH_GAME = 'Gemini 2.5 Flash - Bình luận Game (Sôi động)',
  GEMINI_FLASH_COMMAND = 'Gemini 2.5 Flash - Đọc Lệnh (Dứt khoát)',
  GEMINI_FLASH_LIVE = 'Gemini 2.5 Flash - Livestream (Năng lượng)',

  // --- GEMINI 2.5 PRO PREVIEW TTS (CHẤT LƯỢNG CAO/STUDIO) ---
  GEMINI_PRO_DEEP = 'Gemini 2.5 Pro - Trầm ấm (Podcast/Radio)',
  GEMINI_PRO_WHISPER = 'Gemini 2.5 Pro - Thì thầm (ASMR/Kể chuyện đêm)',
  GEMINI_PRO_EMOTIONAL = 'Gemini 2.5 Pro - Xúc động (Lồng tiếng phim)',
  GEMINI_PRO_EDU = 'Gemini 2.5 Pro - Giáo dục (Tài liệu/Bài giảng)',
  GEMINI_PRO_EPIC = 'Gemini 2.5 Pro - Hùng hồn (Thuyết minh/Sử thi)',

  // --- GIỌNG HOT TREND (THEO YÊU CẦU) ---
  HOT_REVIEW_BDS = 'Review Bất Động Sản (Sang Trọng/Triệu Đô)',
  HOT_TIN_GIAO_THONG = 'Tin Tức Giao Thông (Cảnh Báo/Gay Cấn)',

  // --- VIP STAR: MC TRUYỀN HÌNH & KỂ CHUYỆN (LEGEND) ---
  VIP_LAI_VAN_SAM = 'VIP MC Lại Văn Sâm (VTV3 - Hóm Hỉnh/Sâu Sắc)',
  VIP_NGUYEN_NGOC_NGAN = 'VIP Nguyễn Ngọc Ngạn (Kể Chuyện Ma/Huyền Bí)',
  VIP_TAO_QUAN_NAM_TAO = 'VIP Nam Tào (Chua Ngoa/Hài Hước)',
  VIP_TAO_QUAN_BAC_DAU = 'VIP Bắc Đẩu (Đanh Đá/Xéo Xắc)',
  VIP_MC_QUYEN_LINH = 'VIP MC Quyền Linh (Bình Dân/Chân Chất)',
  VIP_MC_TRAN_THANH = 'VIP MC Trấn Thành (Cảm Xúc/Năng Lượng)',
  VIP_BLV_QUANG_HUY = 'VIP BLV Quang Huy (Bóng Đá/Lửa)',
  VIP_BLV_QUANG_TUNG = 'VIP BLV Quang Tùng (Chuyên Môn/Trầm)',
  VIP_MC_HANH_PHUC = 'VIP MC Hạnh Phúc (Chuyển Động 24h/Chính Luận)',
  VIP_MC_THAO_VAN = 'VIP MC Thảo Vân (Gặp Nhau Cuối Tuần/Duyên Dáng)',

  // --- VIP STAR: YOUTUBER & STREAMER (HOT) ---
  VIP_DO_MIXI = 'VIP Tộc Trưởng (Streamer/Thẳng Thắn)',
  VIP_KHOA_PUG = 'VIP Khoa Pug (Review/Sang Chảnh/Tưng Tửng)',
  VIP_HEU_DEN = 'VIP Hieu Den (Ẩm Thực/Dân Dã)',
  VIP_SANG_VLOG = 'VIP Sang Vlog (Nghị Lực/Chân Thật)',
  VIP_TAM_MAO = 'VIP Tam Mao (Hài Hước/Lầy Lội)',
  VIP_CRIS_DEVIL = 'VIP Cris Devil (React/Hét/Vui Nhộn)',
  VIP_HAU_HOANG = 'VIP Hậu Hoàng (Nhạc Chế/Nhí Nhảnh)',
  VIP_VIRUSS = 'VIP ViruSs (Reaction/Phân Tích/Điềm Đạm)',
  VIP_PEWPEW = 'VIP PewPew (Talkshow/Nghiêm Túc/Gắt)',
  VIP_MISTHY = 'VIP MisThy (Game/Năng Động/Cao Vút)',

  // --- VIP STAR: REVIEW CÔNG NGHỆ & XE (TECH) ---
  VIP_VINH_XO = 'VIP Vinh Xô (Review Xe/Sành Sỏi)',
  VIP_DUY_LUAN = 'VIP Duy Luân (Tinhte/Dễ Hiểu)',
  VIP_VAT_VO = 'VIP Vật Vờ (Review Tech/Nhanh/Thực Tế)',
  VIP_TAN_MOT_CU = 'VIP Tân Một Cú (Schannel/Hài Hước)',
  VIP_HAI_TRIEU = 'VIP Hải Triều (Schannel/Xéo Xắc)',

  // --- VIP STAR: PODCAST & CHỮA LÀNH (HEALING) ---
  VIP_HIEU_TV = 'VIP Hieu.TV (Tài Chính/Trầm Ấm/Sâu Sắc)',
  VIP_SUN_HUYEN = 'VIP Sun Huyn (Podcast/Chữa Lành/Nhẹ Nhàng)',
  VIP_GIANG_OI = 'VIP Giang Ơi (Vlog/Hiện Đại/Tự Tin)',
  VIP_KHANH_VY = 'VIP Khánh Vy (Năng Lượng/Thông Minh)',
  VIP_THIEN_HUY = 'VIP Thiền Huy (Đọc Kinh/Tĩnh Tâm)',

  // --- VIP STAR: GIỌNG ĐỌC TRUYỆN HUYỀN THOẠI ---
  VIP_NSUT_HA_PHUONG = 'VIP NSƯT Hà Phương (Đọc Truyện Đêm Khuya)',
  VIP_NSUT_VIET_HUNG = 'VIP NSƯT Việt Hùng (Phim Kiếm Hiệp)',
  VIP_THUY_THUY_HANG = 'VIP Thúy Hằng (Bà Kể Chuyện/Thiếu Nhi)',
  VIP_KIM_TIEN = 'VIP NSƯT Kim Tiến (Huyền Thoại VTV/Vang)',
  VIP_HOAI_LINH = 'VIP Hoài Linh (Hài Kịch/Miền Nam/Đa Dạng)',

  // --- GIỌNG VÙNG MIỀN ĐẶC TRƯNG ---
  VIP_LOC_FUHO = 'VIP Lộc Fuho (Thợ Chính/Chân Quê)',
  VIP_BA_TAN_VLOG = 'VIP Bà Tân Vlog (Siêu To Khổng Lồ)',
  VIP_CHI_CHI = 'VIP Chị Chị (Huế/Ngọt Ngào)',
  VIP_ANH_BA_SAI_GON = 'VIP Anh Ba (Sài Gòn/Hào Sảng)',
  VIP_CO_HAI_MIEN_TAY = 'VIP Cô Hai (Miền Tây/Ngọt Lịm)',

  // --- GIỌNG NHÂN VẬT HƯ CẤU & PHIM ---
  VIP_JOKER_VN = 'VIP Joker Việt (Điên Loạn/Cười)',
  VIP_BATMAN_VN = 'VIP Batman Việt (Trầm/Khàn/Ngầu)',
  VIP_IRONMAN_VN = 'VIP Ironman Việt (Công Nghệ/Tự Tin)',
  VIP_DORAEMON = 'VIP Doraemon (Mèo Máy/Khàn Nhẹ)',
  VIP_XUKA = 'VIP Xuka (Dịu Dàng/Trong Trẻo)',
  VIP_CONAN = 'VIP Conan (Thám Tử/Thông Minh)',
  VIP_GOKU = 'VIP Goku (Hét/Năng Lượng Cao)',
  VIP_NARUTO = 'VIP Naruto (Quyết Tâm/Mạnh Mẽ)',
  VIP_HARRY_POTTER = 'VIP Harry Potter (Phép Thuật/Nhẹ)',
  VIP_VOLDERMORT = 'VIP Voldemort (Gian Ác/Thì Thầm)',

  // --- REVIEW SẢN PHẨM (HOT TREND) - NAM ---
  REVIEW_SP_NAM_1 = 'Review SP Nam 1 - Công Nghệ (Hiện đại/Nhanh)',
  REVIEW_SP_NAM_2 = 'Review SP Nam 2 - Xe Hơi/Xe Sang (Trầm/Ngầu)',
  REVIEW_SP_NAM_3 = 'Review SP Nam 3 - Unboxing (Hào hứng)',
  REVIEW_SP_NAM_4 = 'Review SP Nam 4 - Ẩm Thực/Food (Gần gũi)',
  REVIEW_SP_NAM_5 = 'Review SP Nam 5 - Bất Động Sản (Uy tín)',
  REVIEW_SP_NAM_6 = 'Review SP Nam 6 - Livestream Sale (Thúc giục)',
  REVIEW_SP_NAM_7 = 'Review SP Nam 7 - TikTok Trend (Năng động)',
  REVIEW_SP_NAM_8 = 'Review SP Nam 8 - Đồng Hồ/Trang Sức (Lịch lãm)',
  REVIEW_SP_NAM_9 = 'Review SP Nam 9 - Du Lịch/Trải Nghiệm (Vui vẻ)',
  REVIEW_SP_NAM_10 = 'Review SP Nam 10 - Sách/Khóa Học (Chuyên gia)',

  // --- REVIEW SẢN PHẨM (HOT TREND) - NỮ ---
  REVIEW_SP_NU_1 = 'Review SP Nữ 1 - Mỹ Phẩm/Beauty (Sang chảnh)',
  REVIEW_SP_NU_2 = 'Review SP Nữ 2 - Thời Trang/Haul (Phấn khích)',
  REVIEW_SP_NU_3 = 'Review SP Nữ 3 - Mẹ & Bé (Tin cậy/Ấm áp)',
  REVIEW_SP_NU_4 = 'Review SP Nữ 4 - Đồ Gia Dụng (Nhẹ nhàng)',
  REVIEW_SP_NU_5 = 'Review SP Nữ 5 - Food Reviewer (Dễ thương)',
  REVIEW_SP_NU_6 = 'Review SP Nữ 6 - Chốt Đơn/Sale (Nhanh/Gắt)',
  REVIEW_SP_NU_7 = 'Review SP Nữ 7 - Spa/Thẩm Mỹ (Thư giãn)',
  REVIEW_SP_NU_8 = 'Review SP Nữ 8 - Khách Sạn/Resort (Cao cấp)',
  REVIEW_SP_NU_9 = 'Review SP Nữ 9 - Đồ Ăn Vặt (Teen/Nhí nhảnh)',
  REVIEW_SP_NU_10 = 'Review SP Nữ 10 - Voice Doanh Nghiệp (Chuyên nghiệp)',

  // --- CUSTOM REQUESTED ---
  MAI_TUAN_TAI_1 = 'Mai Tuấn Tài 1 (VQK Pro)',
  MAI_TUAN_TAI_2 = 'Mai Tuấn Tài 2 (VQK Pro)',

  // --- MIỀN BẮC (NORTH) - NAM ---
  NAM_BAC_1 = 'Nam Bắc 1 - Tin Tức VTV (Chuyên nghiệp)',
  NAM_BAC_2 = 'Nam Bắc 2 - Phóng Sự (Trầm ấm)',
  NAM_BAC_3 = 'Nam Bắc 3 - Đọc Truyện (Truyền cảm)',
  NAM_BAC_4 = 'Nam Bắc 4 - Review Phim (Sôi động)',
  NAM_BAC_5 = 'Nam Bắc 5 - Tài Liệu (Nghiêm túc)',
  NAM_BAC_6 = 'Nam Bắc 6 - MC Sự Kiện (Vang)',
  NAM_BAC_7 = 'Nam Bắc 7 - Quảng Cáo (Hào hứng)',
  NAM_BAC_8 = 'Nam Bắc 8 - Đọc Thơ (Nhẹ nhàng)',
  NAM_BAC_9 = 'Nam Bắc 9 - Kể Chuyện Đêm (Sâu lắng)',
  NAM_BAC_10 = 'Nam Bắc 10 - Thuyết Minh (Rõ ràng)',

  // --- MIỀN BẮC (NORTH) - NỮ ---
  NU_BAC_1 = 'Nữ Bắc 1 - Cô Giáo (Dịu dàng)',
  NU_BAC_2 = 'Nữ Bắc 2 - Tin Tức (Sắc sảo)',
  NU_BAC_3 = 'Nữ Bắc 3 - Trợ Lý Ảo (Thân thiện)',
  NU_BAC_4 = 'Nữ Bắc 4 - Kể Chuyện Bé (Ngọt ngào)',
  NU_BAC_5 = 'Nữ Bắc 5 - Review Mỹ Phẩm (Tự nhiên)',
  NU_BAC_6 = 'Nữ Bắc 6 - Thông Báo (Chuẩn mực)',
  NU_BAC_7 = 'Nữ Bắc 7 - Podcast (Thư giãn)',
  NU_BAC_8 = 'Nữ Bắc 8 - Sách Nói (Cảm xúc)',
  NU_BAC_9 = 'Nữ Bắc 9 - Hướng Dẫn Viên (Vui vẻ)',
  NU_BAC_10 = 'Nữ Bắc 10 - Tổng Đài (Chuyên nghiệp)',

  // --- MIỀN NAM (SOUTH) - NAM ---
  NAM_NAM_1 = 'Nam Nam 1 - MC Giải Trí (Vui tính)',
  NAM_NAM_2 = 'Nam Nam 2 - Vlog Đời Sống (Gần gũi)',
  NAM_NAM_3 = 'Nam Nam 3 - Đọc Báo (Rõ ràng)',
  NAM_NAM_4 = 'Nam Nam 4 - Review Công Nghệ (Hiện đại)',
  NAM_NAM_5 = 'Nam Nam 5 - Kể Chuyện Ma (Rùng rợn)',
  NAM_NAM_6 = 'Nam Nam 6 - Bình Luận Game (Nhanh)',
  NAM_NAM_7 = 'Nam Nam 7 - Radio Cảm Xúc (Ấm áp)',
  NAM_NAM_8 = 'Nam Nam 8 - Sale Bán Hàng (Thuyết phục)',
  NAM_NAM_9 = 'Nam Nam 9 - Phim Lồng Tiếng (Hài)',
  NAM_NAM_10 = 'Nam Nam 10 - Thầy Giáo (Điềm đạm)',

  // --- MIỀN NAM (SOUTH) - NỮ ---
  NU_NAM_1 = 'Nữ Nam 1 - Chị Google (Quen thuộc)',
  NU_NAM_2 = 'Nữ Nam 2 - Tâm Sự (Ngọt ngào)',
  NU_NAM_3 = 'Nữ Nam 3 - Review Ăn Uống (Dễ thương)',
  NU_NAM_4 = 'Nữ Nam 4 - Tin Tức Giải Trí (Năng động)',
  NU_NAM_5 = 'Nữ Nam 5 - Đọc Truyện Ngôn Tình (Lãng mạn)',
  NU_NAM_6 = 'Nữ Nam 6 - Tổng Đài Viên (Nhẹ nhàng)',
  NU_NAM_7 = 'Nữ Nam 7 - Quảng Cáo Spa (Sang trọng)',
  NU_NAM_8 = 'Nữ Nam 8 - Hướng Dẫn Nấu Ăn (Ấm cúng)',
  NU_NAM_9 = 'Nữ Nam 9 - Kể Chuyện Cổ Tích (Cao vút)',
  NU_NAM_10 = 'Nữ Nam 10 - MC Truyền Hình (Thanh lịch)',

  // --- SPECIAL ---
  REVIEW_PHIM_PRO_1 = 'Review Phim Pro 1 (Action/Hành Động)',
  REVIEW_PHIM_PRO_2 = 'Review Phim Pro 2 (Drama/Kịch Tính)',
  REVIEW_PHIM_PRO_3 = 'Review Phim Pro 3 (Recap Nhanh)',
  REVIEW_PHIM_PRO_4 = 'Review Phim Pro 4 (Kinh Dị/Rùng Rợn)',
  REVIEW_PHIM_PRO_5 = 'Review Phim Pro 5 (Anime/Hoạt Hình)',
  SPECIAL_1 = 'Giọng AI - Robot (Futuristic)',
  SPECIAL_2 = 'Giọng Cổ Điển - Kể Sử (Hùng hồn)',
  SPECIAL_3 = 'Giọng Thì Thầm - ASMR (Thư giãn)',
  SPECIAL_4 = 'Giọng Hét - Cổ Vũ (Sôi động)',
  SPECIAL_5 = 'Giọng Lão Thành - Ông Già (Trầm khàn)',

  // --- ORIGINAL GEMINI ---
  KORE = 'Kore (Original)',
  PUCK = 'Puck (Original)',
  CHARON = 'Charon (Original)',
  FENRIR = 'Fenrir (Original)',
  ZEPHYR = 'Zephyr (Original)',
}

export interface AppConfig {
  licenseKey: string;
  isLicensed: boolean;
  selectedVoice: string; // Changed from VQKVoice to string to support custom voices
  mastering: {
    delay: number;
    stability: number;
    similarity: number;
    speed: number;
    style: number;       // For ElevenLabs Style Exaggeration
    speakerBoost: boolean; // For ElevenLabs Speaker Boost
  };
  expiryTimestamp?: number | null; 
  maxChars: number; 
  customVoices: CustomVoice[]; // Added custom voices support
  
  // --- ELEVENLABS UPGRADE ---
  engine: 'VQK' | 'ELEVENLABS'; // Core Engine Selection
  elevenLabsApiKey: string;
  elevenLabsVoices: CustomVoice[]; // Reusing CustomVoice structure for ElevenLabs voices
  elevenLabsModel: string; // New field for Model Selection

  // --- FIX API KEY FEATURE ---
  personalApiKey?: string; // Allow user to override with their own key
  useSystemKey?: boolean;  // Allow using system-injected key (e.g. from Google AI Studio)
  usePersonalKeyAsPrimary?: boolean; // NEW: Force user to use their own key (Cost Saving Mode)
}

export type TabType = 'edit' | 'file' | 'subtitle' | 'dialogue' | 'logs';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
