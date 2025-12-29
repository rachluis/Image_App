
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async explainStructure(problemTitle: string, treeData: any, question: string): Promise<string> {
    const prompt = `
      Context: We are studying data structures (Binary Trees).
      Problem: ${problemTitle}
      Tree Structure JSON: ${JSON.stringify(treeData)}
      User Question: ${question}

      Task: Explain the tree logic, deletions, or balancing in a concise, student-friendly way.
      Limit response to 2 paragraphs. Use markdown formatting.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "No explanation available.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Sorry, I couldn't generate an explanation right now.";
    }
  }

  async solveSequence(sequence: string, treeType: string): Promise<string> {
    const prompt = `
      Given this sequence of numbers: [${sequence}]
      Task: Describe step-by-step how a ${treeType} would be built.
      For BST: Explain where each number goes.
      For AVL: Note where rotations occur.
      Format the output clearly as a list of steps.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "Calculation failed.";
    } catch (error) {
      return "Error processing sequence.";
    }
  }
}

export const geminiService = new GeminiService();
