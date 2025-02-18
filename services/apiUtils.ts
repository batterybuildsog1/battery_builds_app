/**
 * Utility functions for API call file handling
 */

/**
 * Builds a file part object for API requests with base64 encoded data
 * @param buffer The file buffer to encode
 * @param mimeType The MIME type of the file
 * @returns Object containing the file data with MIME type and base64 encoded content
 */
export function buildFilePart(buffer: Buffer, mimeType: string): { fileData: { mimeType: string; data: string } } {
  return {
    fileData: {
      mimeType: mimeType,
      data: buffer.toString('base64')
    }
  };
}