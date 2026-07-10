export interface ValidationResult {
  isValid: boolean
  error?: string
}

const ALLOWED_MIME_TYPES = [
  'text/csv',
  'text/tab-separated-values',
  'application/vnd.ms-excel',
]

const ALLOWED_EXTENSIONS = ['.csv', '.tsv']

/**
 * Validates a file before parsing: type/extension and size.
 */
export function validateFile(
  file: File,
  maxFileSize: number
): ValidationResult {
  const hasValidType = ALLOWED_MIME_TYPES.includes(file.type)
  const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  )

  if (!hasValidType && !hasValidExtension) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a CSV or TSV file.',
    }
  }

  if (file.size > maxFileSize) {
    return {
      isValid: false,
      error: `File size exceeds ${(maxFileSize / (1024 * 1024)).toFixed(1)}MB limit.`,
    }
  }

  return { isValid: true }
}
