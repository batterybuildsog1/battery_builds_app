import { buildFilePart } from './apiUtils';

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

export async function processPDF(pdfBuffer: Buffer) {
  try {
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

    const response = await fetch(GEMINI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemInstruction },
              filePart
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.candidates[0].content.parts[0].text
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred during PDF processing'
    };
  }
}
