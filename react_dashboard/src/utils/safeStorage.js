// Safe storage utility to handle QuotaExceededError across Safari/Private Mode
export const safeStorage = {
  get(key) {
    try { 
      return window.localStorage.getItem(key); 
    } catch { 
      return null; 
    }
  },
  
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (e) {
      // Quota exceeded or storage unavailable -> silently ignore
      console.warn('Storage unavailable or quota exceeded, falling back in-memory', e);
      return false;
    }
  },
  
  remove(key) {
    try { 
      window.localStorage.removeItem(key); 
    } catch {}
  }
};

// Image downscaling utility to reduce file sizes
export async function downscaleImage(file, maxDim = 1280, quality = 0.8) {
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = URL.createObjectURL(file);
  });

  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);

  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
  return new File([blob], (file.name || 'photo') + '.jpg', { type: 'image/jpeg' });
}
