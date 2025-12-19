
import { GoogleGenAI, Modality } from "@google/genai";
import { VQKVoice, CustomVoice } from "../types";

// Giải mã Base64 an toàn cho luồng dữ liệu lớn
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function mergeRawPCM(buffers: Uint8Array[]): Uint8Array {
  const totalLength = buffers.reduce((acc, b) => acc + b.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const b of buffers) {
    result.set(b, offset);
    offset += b.length;
  }
  return result;
}

async function pcmToAudioBuffer(
  pcmData: Uint8Array,
  sampleRate: number = 24000
): Promise<AudioBuffer> {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
  // Gemini trả về raw PCM 16-bit, mỗi sample chiếm 2 byte
  const dataInt16 = new Int16Array(pcmData.buffer, pcmData.byteOffset, pcmData.length / 2);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    // Chuyển đổi Int16 (-32768 đến 32767) sang Float32 (-1.0 đến 1.0)
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

export function audioBufferToWavBytes(buffer: AudioBuffer): Uint8Array {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numChannels * 2;
  const bufferWav = new ArrayBuffer(44 + length);
  const view = new DataView(bufferWav);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 32 + length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM Mono
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length, true);

  const offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      view.setInt16(offset + (i * numChannels + channel) * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    }
  }

  return new Uint8Array(bufferWav);
}

// Chức năng gộp nhiều AudioBuffer thành 1 với khoảng lặng (silence)
export function mergeMultipleAudioBuffers(buffers: AudioBuffer[], silenceSeconds: number = 0.5): AudioBuffer {
  if (buffers.length === 0) {
    const ctx = new AudioContext();
    return ctx.createBuffer(1, 1, 24000);
  }
  
  const sampleRate = buffers[0].sampleRate;
  const silenceLength = Math.floor(silenceSeconds * sampleRate);
  const totalLength = buffers.reduce((acc, buf, idx) => acc + buf.length + (idx < buffers.length - 1 ? silenceLength : 0), 0);
  
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
  const mergedBuffer = ctx.createBuffer(buffers[0].numberOfChannels, totalLength, sampleRate);
  
  for (let channel = 0; channel < mergedBuffer.numberOfChannels; channel++) {
    const channelData = mergedBuffer.getChannelData(channel);
    let offset = 0;
    for (let i = 0; i < buffers.length; i++) {
      channelData.set(buffers[i].getChannelData(channel), offset);
      offset += buffers[i].length + silenceLength;
    }
  }
  return mergedBuffer;
}

export function createWavBlobFromBytes(wavBytes: Uint8Array): Blob {
  return new Blob([wavBytes], { type: 'audio/wav' });
}

// Giả lập logic mapping giọng từ UI sang Voice Name của Gemini
const getVoiceProfile = (uiVoiceName: string): { modelVoice: string } => {
  const name = uiVoiceName.toLowerCase();
  if (name.includes("nữ") || name.includes("mai") || name.includes("vy") || name.includes("giang")) return { modelVoice: 'Kore' };
  if (name.includes("ngạn") || name.includes("lão")) return { modelVoice: 'Fenrir' };
  if (name.includes("thành") || name.includes("sâm")) return { modelVoice: 'Charon' };
  if (name.includes("robot") || name.includes("chuột")) return { modelVoice: 'Puck' };
  return { modelVoice: 'Zephyr' };
};

export const splitTextSafe = (text: string, maxLength: number = 800): string[] => {
  if (!text) return [];
  const chunks: string[] = [];
  let remaining = text.replace(/\r\n/g, '\n');
  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      chunks.push(remaining.trim());
      break;
    }
    let splitIndex = -1;
    const searchArea = remaining.substring(0, maxLength);
    const lastDoubleNewLine = searchArea.lastIndexOf('\n\n');
    if (lastDoubleNewLine > maxLength * 0.3) splitIndex = lastDoubleNewLine;
    if (splitIndex === -1) {
       const lastNewLine = searchArea.lastIndexOf('\n');
       if (lastNewLine > maxLength * 0.5) splitIndex = lastNewLine;
    }
    if (splitIndex === -1) {
       const matches = [...searchArea.matchAll(/[.!?]\s/g)];
       if (matches.length > 0) splitIndex = matches[matches.length - 1].index! + 1;
    }
    if (splitIndex === -1) splitIndex = searchArea.lastIndexOf(' ');
    if (splitIndex === -1) splitIndex = maxLength;
    chunks.push(remaining.substring(0, splitIndex).trim());
    remaining = remaining.substring(splitIndex).trim();
  }
  return chunks;
};

export const generateSpeechVQK = async (
  text: string,
  uiVoiceName: string,
  _ignoredKey?: string,
  _ignoredBackup?: string,
  _speed: number = 1.0
): Promise<{ audioBuffer: AudioBuffer | null; rawAudio?: Uint8Array; error?: string }> => {
  if (!process.env.API_KEY) return { audioBuffer: null, error: "Lỗi: Hệ thống chưa được cấp API Key" };
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const profile = getVoiceProfile(uiVoiceName);
  const chunks = splitTextSafe(text, 800);
  const rawChunks: Uint8Array[] = [];

  for (let i = 0; i < chunks.length; i++) {
    let success = false;
    let lastError = "";
    // Thử lại tối đa 3 lần cho mỗi đoạn
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts", // Model bắt buộc cho Audio Modality
          contents: [{ parts: [{ text: chunks[i] }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: profile.modelVoice } },
            }
          },
        });
        
        const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (data) {
          rawChunks.push(decode(data));
          success = true;
          break;
        } else {
          lastError = "API phản hồi không có dữ liệu âm thanh.";
        }
      } catch (e: any) { 
        lastError = e.message || "Lỗi kết nối API Gemini.";
        console.error(`Attempt ${attempt + 1} failed:`, e);
        await wait(1500 * (attempt + 1)); // Nghỉ lâu hơn sau mỗi lần lỗi
      }
    }
    if (!success) return { audioBuffer: null, error: `Lỗi tại đoạn ${i + 1}: ${lastError}` };
    if (chunks.length > 1) await wait(1000); // Tránh bị Rate Limit
  }

  const finalRaw = mergeRawPCM(rawChunks);
  const finalBuffer = await pcmToAudioBuffer(finalRaw);
  // Gemini TTS output là PCM raw, để download cần đóng gói WAV
  const wavBytes = audioBufferToWavBytes(finalBuffer);
  return { audioBuffer: finalBuffer, rawAudio: wavBytes };
};

export const generateContentVQK = async (prompt: string): Promise<{ text: string | null; error?: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: { 
        systemInstruction: "Bạn là VQK AI Writer. Viết nội dung kịch bản video ngắn, hấp dẫn, ngôn ngữ hiện đại.",
        maxOutputTokens: 2048 
      }
    });
    return { text: response.text || "" };
  } catch (e: any) { return { text: null, error: e.message }; }
};

export const parseScriptToDialogue = async (script: string): Promise<{ lines: any[] | null; error?: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Phân tích kịch bản và trả về JSON [{ "character": "Tên", "text": "Lời thoại", "voice_suggested": "Giọng gợi ý" }]:\n${script}` }] }],
      config: { responseMimeType: "application/json" }
    });
    return { lines: JSON.parse(response.text || "[]") };
  } catch (e: any) { return { lines: null, error: e.message }; }
};
