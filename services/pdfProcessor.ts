import { getVisionModel, getSafeVisionModel } from './gemini';
import { buildFilePart } from './apiUtils';

export async function processPDF(pdfBuffer: Buffer) {
  try {
    // Try unsafe model first
    const visionModel = getVisionModel();
    const filePart = buildFilePart(pdfBuffer, 'application/pdf');

    const systemInstruction = `
      Analyze this PDF document and extract key information.
      Return your response as a structured JSON object with the following format:
      {
        "success": boolean,
        "data": {
          // extracted information
        },
        "error": string (optional)
      }
    `;

    try {
      const result = await visionModel.generateContent([
        systemInstruction,
        filePart
      ]);
      
      const response = await result.response;
      return {
        success: true,
        data: response.text()
      };
    } catch (unsafeModelError) {
      // If unsafe model fails, try safe model as fallback
      const safeModel = getSafeVisionModel();
      const safeResult = await safeModel.generateContent([
        systemInstruction,
        filePart
      ]);
      
      const safeResponse = await safeResult.response;
      return {
        success: true,
        data: safeResponse.text()
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred during PDF processing'
    };
  }
}