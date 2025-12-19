
// DỊCH VỤ QUẢN LÝ LICENSE VQK - PRO BY DEFAULT
export const getDeviceId = (): string => {
  try {
    const nav = window.navigator;
    const screen = window.screen;
    const screenInfo = `${screen.width}x${screen.height}-${screen.colorDepth}`;
    const cpuInfo = nav.hardwareConcurrency || '8';
    const localeInfo = `${Intl.DateTimeFormat().resolvedOptions().timeZone}-${nav.language}`;
    const platformInfo = nav.platform || 'Win32';
    
    const fingerprintString = [screenInfo, cpuInfo, localeInfo, platformInfo, nav.userAgent].join('||VQK||');
    
    let hash = 0;
    for (let i = 0; i < fingerprintString.length; i++) {
      hash = ((hash << 5) - hash) + fingerprintString.charCodeAt(i);
      hash |= 0;
    }
    return `VQK-DEVICE-${Math.abs(hash).toString(16).toUpperCase()}`;
  } catch (e) {
    return `VQK-DEVICE-FALLBACK-${Date.now()}`;
  }
};

export const verifyAndLogLicense = async (key: string) => {
  // Mock successful verification for default Pro experience
  return { 
    isValid: true, 
    message: "Bản quyền Pro đã được kích hoạt!", 
    expiry: "Vĩnh viễn (Lifetime)",
    maxChars: -1 
  };
};

export const checkLocalLicense = () => {
  // Default to PRO status
  return { 
    isLicensed: true, 
    key: 'VQK-PRO-UNLIMITED-2025', 
    deviceId: getDeviceId(), 
    expiryTimestamp: null, 
    maxChars: -1 
  };
};
