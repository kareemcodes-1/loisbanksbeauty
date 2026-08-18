import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatModel = genAI.getGenerativeModel({
  model: "gemini-3.5-flash-lite", // fast + cheap
});

