/**
 * File validation parameters.
 */
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a file against allowed MIME types and maximum size constraints.
 */
export function validateFile(
  file: File,
  allowedMimeTypes: string[],
  maxSizeMB: number
): FileValidationResult {
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Unsupported file format (${file.type}). Allowed formats: ${allowedMimeTypes.join(", ")}`,
    };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size exceeds the ${maxSizeMB}MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
    };
  }

  return { isValid: true };
}

/**
 * Retry helper executing a promise-returning callback up to `retries` times with linear backoff.
 */
export async function retryPromise<T>(
  promiseFn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  try {
    return await promiseFn();
  } catch (error) {
    if (retries <= 1) {
      throw error;
    }
    console.warn(`Retry failed. Remaining attempts: ${retries - 1}. Retrying in ${delayMs}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return retryPromise(promiseFn, retries - 1, delayMs * 1.5);
  }
}
