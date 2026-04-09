import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AnalysisResult {
  issue: string;
  action: string;
  prevention: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export async function analyzeCropIssue(
  cropType: string,
  location: string,
  message: string,
  language: string
): Promise<AnalysisResult> {
  const prompt = `
    A farmer in ${location} is reporting an issue with their ${cropType} crop.
    Farmer's message: "${message}"
    
    Please analyze this report and provide:
    1. The likely issue (pest, disease, or nutrient deficiency).
    2. Immediate action the farmer should take.
    3. Prevention strategies for the future.
    4. Risk level (Low, Medium, or High).
    
    IMPORTANT: Provide the response in ${language}.
  `;

  const systemInstruction = `
    You are an expert agricultural scientist specializing in Nigerian farming conditions. 
    Your goal is to help smallholder farmers diagnose crop issues and provide practical, localized advice.
    You must respond in the language requested by the user (English, Yoruba, Hausa, or Igbo).
    Keep your advice practical, low-cost, and specific to the Nigerian context.
    Return the response strictly in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issue: { type: Type.STRING, description: "The likely issue in the requested language" },
            action: { type: Type.STRING, description: "Immediate action in the requested language" },
            prevention: { type: Type.STRING, description: "Prevention strategy in the requested language" },
            riskLevel: { 
              type: Type.STRING, 
              enum: ["Low", "Medium", "High"],
              description: "The risk level of the issue"
            },
          },
          required: ["issue", "action", "prevention", "riskLevel"],
        },
      },
    });

    const result = JSON.parse(response.text);
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze crop issue. Please try again.");
  }
}
