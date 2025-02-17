import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

// Initialize Gemini clients for different processing needs
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize reasoning model with flash-thinking for enhanced analytical capabilities
const reasoningModel = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-thinking-exp",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  }
});

// Initialize vision model for PDF processing and data extraction
const visionModel = genAI.getGenerativeModel({ 
  model: "gemini-pro-vision"
});

/**
 * Extracts static building data from a PDF using the gemini-pro-vision model
 * @param pdfBase64 - Base64 encoded PDF document
 * @returns Structured text containing extracted building characteristics
 * @throws {Error} When PDF processing or data extraction fails
 */
async function extractStaticData(pdfBase64: string): Promise<string> {
  try {
    const prompt = `Analyze this building plans PDF and extract key building characteristics 
      in a structured format. Include details about square footage, number of rooms, 
      window specifications, insulation values, and construction materials.`;
    
    const result = await visionModel.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "application/pdf",
          data: pdfBase64
        }
      }
    ]);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error extracting static data:", error);
    throw new Error(`Failed to extract static data: ${error.message}`);
  }
}

/**
 * Generates Manual J calculation assumptions using gemini-2.0-flash-thinking-exp
 * @param location - Geographic location for climate data
 * @param staticData - Extracted building characteristics
 * @returns JSON formatted assumptions for Manual J calculations
 * @throws {Error} When assumption generation fails
 */
async function generateDynamicAssumptions(location: string, staticData: string): Promise<string> {
  try {
    const prompt = `Given the location "${location}" and the following building data:
      ${staticData}
      
      Generate reasonable assumptions for Manual J calculations including:
      1. Local climate data and design temperatures
      2. Insulation effectiveness
      3. Duct system losses
      4. Infiltration rates
      
      Return the assumptions in JSON format.`;

    const result = await reasoningModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error generating assumptions:", error);
    throw new Error(`Failed to generate assumptions: ${error.message}`);
  }
}

/**
 * Performs Manual J load calculations using gemini-2.0-flash-thinking-exp
 * @param staticData - Building characteristics data
 * @param assumptions - Generated assumptions for calculations
 * @returns Structured calculation results including load breakdowns
 * @throws {Error} When load calculations fail
 */
async function calculateManualJResults(staticData: string, assumptions: string): Promise<string> {
  try {
    const prompt = `Using the following building data and assumptions, 
      perform Manual J load calculations:
      
      Building Data:
      ${staticData}
      
      Assumptions:
      ${assumptions}
      
      Calculate and return:
      1. Heating load (BTU/h)
      2. Cooling load (BTU/h)
      3. Room-by-room load breakdown
      4. Peak load conditions`;

    const result = await reasoningModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error calculating results:", error);
    throw new Error(`Failed to calculate results: ${error.message}`);
  }
}

/**
 * Generates visualization data using gemini-2.0-flash-thinking-exp
 * @param results - Manual J calculation results
 * @returns Object containing chart specifications and CSV data
 * @throws {Error} When visualization data generation fails
 */
async function generateVisualizationData(results: string): Promise<{ chartData: string, csvData: string }> {
  try {
    const prompt = `Convert these Manual J results into visualization data:
      ${results}
      
      Generate:
      1. A chart specification (as a base64 encoded PNG string)
      2. CSV data for detailed analysis
      
      Return both in JSON format.`;

    const result = await reasoningModel.generateContent(prompt);
    const response = await result.response;
    const visualData = JSON.parse(response.text());
    
    return {
      chartData: visualData.chartData,
      csvData: visualData.csvData
    };
  } catch (error: any) {
    console.error("Error generating visualization data:", error);
    throw new Error(`Failed to generate visualization data: ${error.message}`);
  }
}

/**
 * Executes the Manual J calculation chain using Gemini AI models
 * 
 * The process follows these steps:
 * 1. PDF extraction using gemini-pro-vision model for accurate document analysis
 * 2. Dynamic assumptions generation using gemini-2.0-flash-thinking-exp for enhanced reasoning
 * 3. Manual J calculations using gemini-2.0-flash-thinking-exp for complex computations
 * 4. Visualization data generation using gemini-2.0-flash-thinking-exp for data formatting
 * 
 * Each step utilizes specialized models:
 * - PDF Analysis: gemini-pro-vision for visual document understanding
 * - Calculations & Logic: gemini-2.0-flash-thinking-exp for analytical processing
 * 
 * @param pdfBuffer - Buffer containing the building plans PDF (converted to base64 for API compatibility)
 * @param location - Geographic location for climate considerations
 * @returns Object containing all calculation results and visualization data
 * @throws {Error} When PDF processing, calculations, or data generation fails
 */
export async function runManualJChain(pdfBuffer: Buffer, location: string): Promise<{
  staticData: string,
  dynamicAssumptions: string,
  manualJResults: string,
  chartData: string,
  csvData: string
}> {
  try {
    // Convert PDF buffer to base64
    const pdfBase64 = pdfBuffer.toString('base64');

    // Step 1: Extract static data from PDF
    const staticData = await extractStaticData(pdfBase64);

    // Step 2: Generate dynamic assumptions based on location and static data
    const dynamicAssumptions = await generateDynamicAssumptions(location, staticData);

    // Step 3: Calculate Manual J results
    const manualJResults = await calculateManualJResults(staticData, dynamicAssumptions);

    // Step 4: Generate visualization data
    const { chartData, csvData } = await generateVisualizationData(manualJResults);

    return {
      staticData,
      dynamicAssumptions,
      manualJResults,
      chartData,
      csvData
    };
  } catch (error: any) {
    console.error("Error in Manual J chain:", error);
    throw new Error(`Manual J calculation failed: ${error.message}`);
  }
}
