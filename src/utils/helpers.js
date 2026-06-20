/**
 * Formats a size in bytes to a human-readable string (e.g., KB, MB).
 * @param {number} bytes 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const sign = bytes < 0 ? -1 : 1;
  const absBytes = Math.abs(bytes);
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(absBytes) / Math.log(k));
  const value = parseFloat((absBytes / Math.pow(k, i)).toFixed(dm));

  return `${sign < 0 ? '-' : ''}${value} ${sizes[i]}`;
}

/**
 * Returns a Promise that resolves with the width and height of an image file.
 * @param {File} file 
 * @returns {Promise<{width: number, height: number}>}
 */
export function getImageDimensions(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = url;
  });
}

/**
 * Copies text to the user's clipboard.
 * @param {string} text 
 * @returns {Promise<boolean>}
 */
export async function copyTextToClipboard(text) {
  if ('clipboard' in navigator) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text using navigator.clipboard: ', err);
    }
  }
  
  // Fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error('Fallback copy failed: ', err);
    return false;
  }
}

/**
 * Converts an image file to image/webp format using Canvas.
 * @param {File} file 
 * @param {number} qualityValue 
 * @returns {Promise<File>}
 */
export function convertToWebpBlob(file, qualityValue = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const originalName = file.name;
          const lastDotIndex = originalName.lastIndexOf('.');
          const baseName = lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : originalName;
          const newName = `${baseName}.webp`;
          const webpFile = new File([blob], newName, { type: 'image/webp' });
          resolve(webpFile);
        } else {
          reject(new Error('Canvas WebP blob conversion failed'));
        }
      }, 'image/webp', qualityValue);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for WebP conversion'));
    };
    img.src = url;
  });
}

