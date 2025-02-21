import { GoogleGenerativeAI } from '@google/generative-ai';

const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024; // 20MB in bytes

type ProcessPDFResponse = {
  success: boolean;
  content?: string;
  error?: string;
};

const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_VISION_MODEL}:generateContent`;

function validateInput(pdfBase64: string): void {
  if (!pdfBase64) {
    throw new PDFProcessingError('PDF base64 string is required');
  }
  
  try {
    const decoded = Buffer.from(pdfBase64, 'base64');
    if (decoded.length > MAX_PDF_SIZE) {
      throw new PDFProcessingError('PDF size exceeds maximum allowed size');
    }
  } catch (error) {
    throw new PDFProcessingError('Invalid base64 string');
  }
}

export async function processPDF(pdfBase64: string): Promise<ProcessPDFResponse> {
  try {
    // Check PDF size (base64 string length * 0.75 gives approximate binary size)
    const estimatedPdfSize = (pdfBase64.length * 0.75);
    if (estimatedPdfSize > MAX_PDF_SIZE_BYTES) {
      return {
        success: false,
        error: `PDF size exceeds maximum allowed size of ${MAX_PDF_SIZE_BYTES / (1024 * 1024)}MB`
      };
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new PDFProcessingError('GEMINI_API_KEY is not configured');
    }

    const modelName = process.env.GEMINI_VISION_MODEL || 'gemini-pro-vision';
    if (!SUPPORTED_MODELS.includes(modelName)) {
      throw new PDFProcessingError('Unsupported model specified');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });

    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const result = await Promise.race([
          model.generateContent({
            contents: [
              {
                parts: [
                  {
                    inlineData: {
                      mimeType: 'application/pdf',
                      data: pdfBase64
                    }
                  }
                ]
              }
            ]
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
          )
        ]);

        clearTimeout(timeout);
        
        const response = await result.response;
        const text = response.text();

        return {
          success: true,
          content: text
        };
      } catch (error) {
        lastError = error as Error;
        if (error instanceof Error && 
            (error.message.includes('timeout') || 
             error.message.includes('network') ||
             error.message.includes('429'))) {
          if (attempt === MAX_RETRIES) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        throw error;
      }
    }

    throw lastError || new Error('Maximum retries exceeded');
  } catch (error) {
    console.error('Error processing PDF:', error);
    return {
      success: false,
      error: error instanceof PDFProcessingError ? 
        error.message : 
        'An unexpected error occurred while processing the PDF'
    };
  }
}
