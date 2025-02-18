import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerativeModel,
} from "@google/generative-ai";

const MODEL_CONFIG = {
  vision: {
    model: 'gemini-pro-vision',
    generationConfig: {
      temperature: 0.4,
      topP: 1,
      topK: 32,
      maxOutputTokens: 2048
    }
  },
  reasoning: {
    model: 'gemini-pro',
    generationConfig: {
      temperature: 0.9,
      topP: 1,
      topK: 32,
      maxOutputTokens: 2048
    }
  }
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export const getModel = (type: 'vision' | 'reasoning'): GenerativeModel => {
  const config = MODEL_CONFIG[type];
  const model = genAI.getGenerativeModel({ 
    model: config.model,
    generationConfig: config.generationConfig,
  });
  model.setSafetySettings(SAFETY_SETTINGS);
  return model;
};

export const getReasoningModel = (): GenerativeModel => {
  return getModel('reasoning');
};

export const getVisionModel = (): GenerativeModel => {
  return getModel('vision');
};
