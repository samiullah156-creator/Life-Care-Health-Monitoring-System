/**
 * Convert a File to a data URL for storing in Firestore (no Storage needed).
 * Enforces size limits so the document stays under Firestore's 1MB limit.
 */

const PROFILE_PHOTO_MAX_BYTES = 200 * 1024;   // 200KB
const DOCUMENT_MAX_BYTES = 400 * 1024;       // 400KB per doc
const IMAGE_MAX_WIDTH = 400;
const IMAGE_JPEG_QUALITY = 0.8;

function isImage(type) {
  return type.startsWith('image/');
}

/**
 * Compress image via canvas and return as data URL.
 */
function compressImage(file, maxBytes) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > IMAGE_MAX_WIDTH || height > IMAGE_MAX_WIDTH) {
        if (width > height) {
          height = (height / width) * IMAGE_MAX_WIDTH;
          width = IMAGE_MAX_WIDTH;
        } else {
          width = (width / height) * IMAGE_MAX_WIDTH;
          height = IMAGE_MAX_WIDTH;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      let quality = IMAGE_JPEG_QUALITY;
      const tryEncode = () => {
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        if (dataUrl.length * 0.75 <= maxBytes || quality <= 0.2) {
          resolve(dataUrl);
        } else {
          quality -= 0.1;
          if (quality < 0.2) resolve(dataUrl);
          else tryEncode();
        }
      };
      tryEncode();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    img.src = url;
  });
}

/**
 * Read file as data URL (for non-images or when not compressing).
 */
function readAsDataUrl(file, maxBytes) {
  return new Promise((resolve, reject) => {
    if (file.size > maxBytes) {
      reject(new Error(`File "${file.name}" is too large. Maximum size: ${Math.round(maxBytes / 1024)}KB. Please use a smaller or compressed file.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Convert a file to a data URL. For images, compresses to stay under maxBytes.
 */
export async function fileToDataUrl(file, maxBytes = DOCUMENT_MAX_BYTES) {
  if (isImage(file.type)) {
    return compressImage(file, maxBytes);
  }
  return readAsDataUrl(file, maxBytes);
}

/**
 * Build doctor document data URLs (no Storage). Use for Firestore-only setup.
 */
export async function getDoctorDocumentDataUrls(files) {
  const out = {};
  if (files.profilePhoto) {
    out.profilePhotoUrl = await fileToDataUrl(files.profilePhoto, PROFILE_PHOTO_MAX_BYTES);
  }
  if (files.degreeCertificate) {
    out.degreeCertificateUrl = await fileToDataUrl(files.degreeCertificate, DOCUMENT_MAX_BYTES);
  }
  if (files.licenseDocument) {
    out.licenseDocumentUrl = await fileToDataUrl(files.licenseDocument, DOCUMENT_MAX_BYTES);
  }
  return out;
}
