import { GoogleGenAI } from "@google/genai";
import { ApodResponse } from "../types";

class GeminiService {
  private getClient(): GoogleGenAI {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async explainApod(apod: ApodResponse, question?: string): Promise<string> {
    try {
      const ai = this.getClient();
      const model = "gemini-2.5-flash"; // Efficient for text/reasoning

      const context = `
        You are an expert AI Astronomer called "Cosmos". 
        You are explaining the NASA Astronomy Picture of the Day (APOD) to a curious user.
        
        Title: ${apod.title}
        Date: ${apod.date}
        Official Explanation: ${apod.explanation}
        Media Type: ${apod.media_type}
        
        User's Question: ${question || "Please give me a concise, engaging summary of why this image is significant, suitable for a general audience. Keep it under 100 words."}
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: context,
      });

      return response.text || "I couldn't generate an explanation at this time.";
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }

  async chatStream(history: {role: string, text: string}[], newMessage: string, apodContext: ApodResponse) {
     const ai = this.getClient();
     
     const systemInstruction = `You are Cosmos, a friendly expert astronomer. 
     You are currently discussing this APOD image: "${apodContext.title}".
     Context from NASA: ${apodContext.explanation}.
     Answer the user's questions about space, astronomy, or this specific image. Be concise and educational.`;

     const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction
        },
        history: history.map(h => ({
            role: h.role === 'model' ? 'model' : 'user',
            parts: [{ text: h.text }]
        }))
     });

     return chat.sendMessageStream({ message: newMessage });
  }
}

export const geminiService = new GeminiService();