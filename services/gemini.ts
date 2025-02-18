import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerativeModel,
} from "@google/generative-ai";

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

export const getModel = (modelName: string): GenerativeModel => {
  return genAI.getGenerativeModel({ model: modelName });
};

export const getSafeModel = (modelName: string): GenerativeModel => {
  const model = getModel(modelName);
  model.setSafetySettings(SAFETY_SETTINGS);
  return model;
};

// Environment variables for model names:
// GEMINI_REASONING_MODEL - Used for text-based reasoning tasks
// GEMINI_VISION_MODEL - Used for vision-related tasks
export const getReasoningModel = (): GenerativeModel => {
  return getModel(process.env.GEMINI_REASONING_MODEL || "gemini-pro");
};

export const getVisionModel = (): GenerativeModel => {
  return getModel(process.env.GEMINI_VISION_MODEL || "gemini-pro-vision");
};
