/**
 * File Upload Security & Validation Module
 * 
 * Enforces strict client-side validation rules for user file attachments.
 * NOTE: Client-side validation improves user experience and prevents client memory
 * exhaustion. Equivalent server-side validation MUST be enforced on all backend endpoints.
 */

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB strict limit
export const MAX_FILE_SIZE_MB = 10;

export const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".pdf", ".txt"] as const;
export type AllowedExtension = typeof ALLOWED_EXTENSIONS[number];

export const ALLOWED_MIME_TYPES: Record<AllowedExtension, string[]> = {
  ".png": ["image/png"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".pdf": ["application/pdf"],
  ".txt": ["text/plain"]
};

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedName?: string;
}

/**
 * Sanitizes a filename to prevent path traversal, control character injection,
 * and script/HTML injection attacks.
 */
export function sanitizeFilename(rawName: string): string {
  if (!rawName || typeof rawName !== "string") return "attachment";

  // 1. Strip path components (both POSIX and Windows delimiters)
  let clean = rawName.replace(/^.*[\\\/]/, "");

  // 2. Remove null bytes and non-printable control characters
  clean = clean.replace(/[\x00-\x1F\x7F]/g, "");

  // 3. Remove dangerous HTML/shell characters
  clean = clean.replace(/[<>:"/\\|?*`'$#&;{}()]/g, "_");

  // 4. Remove leading dots (e.g., prevent hidden or extension-only names like ".htaccess")
  clean = clean.replace(/^\.+/, "");

  // 5. Collapse consecutive underscores/spaces
  clean = clean.replace(/[_\s]+/g, "_").trim();

  // 6. Enforce safe length limit (max 100 chars, preserving extension)
  if (clean.length > 100) {
    const extIndex = clean.lastIndexOf(".");
    if (extIndex !== -1 && extIndex > clean.length - 10) {
      const ext = clean.slice(extIndex);
      clean = clean.slice(0, 100 - ext.length) + ext;
    } else {
      clean = clean.slice(0, 100);
    }
  }

  return clean || "attachment";
}

/**
 * Validates a single File object against size, extension, MIME type, and emptiness.
 */
export function validateFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, error: "No file was provided." };
  }

  // 1. Reject empty files (0 bytes)
  if (file.size === 0) {
    return {
      valid: false,
      error: `File "${file.name}" is empty (0 bytes) and cannot be attached.`
    };
  }

  // 2. Reject oversized files (> 10 MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File "${file.name}" exceeds the strict ${MAX_FILE_SIZE_MB} MB limit (${sizeMb} MB).`
    };
  }

  // 3. Extract and validate file extension
  const filename = file.name || "";
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === 0 || lastDotIndex === filename.length - 1) {
    return {
      valid: false,
      error: `File "${filename}" lacks a valid file extension. Only PNG, JPG, JPEG, PDF, and TXT are permitted.`
    };
  }

  const ext = filename.slice(lastDotIndex).toLowerCase() as AllowedExtension;
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `File extension "${ext}" is not permitted. Only PNG, JPG, JPEG, PDF, and TXT files are accepted.`
    };
  }

  // 4. Validate MIME type
  const allowedMimes = ALLOWED_MIME_TYPES[ext] || [];
  const fileMime = (file.type || "").toLowerCase().trim();

  // If the browser provides a MIME type, it must match the expected MIME list for this extension
  if (fileMime && !allowedMimes.includes(fileMime)) {
    return {
      valid: false,
      error: `File "${filename}" has an invalid MIME type (${fileMime}). Expected ${allowedMimes.join(" or ")}.`
    };
  }

  const sanitized = sanitizeFilename(filename);

  return {
    valid: true,
    sanitizedName: sanitized
  };
}

/**
 * Validates a batch of files. Separates approved files from rejected files with detailed error messages.
 */
export function validateFiles(fileList: File[]): { validFiles: File[]; errors: string[] } {
  const validFiles: File[] = [];
  const errors: string[] = [];

  for (const file of fileList) {
    const result = validateFile(file);
    if (!result.valid) {
      errors.push(result.error || `File "${file.name}" failed security validation.`);
    } else {
      // Re-wrap file with sanitized filename if filename changed
      if (result.sanitizedName && result.sanitizedName !== file.name) {
        try {
          const renamedFile = new File([file], result.sanitizedName, {
            type: file.type,
            lastModified: file.lastModified
          });
          validFiles.push(renamedFile);
        } catch {
          validFiles.push(file);
        }
      } else {
        validFiles.push(file);
      }
    }
  }

  return { validFiles, errors };
}

