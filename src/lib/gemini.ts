import { GoogleGenAI } from "@google/genai";

export async function askOracle(query: string, contextNotes: string[]) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    return "The Oracle is silent because the API Key is missing. Please add it to the .env file.";
  }

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
  });

  const context = contextNotes.length > 0 
    ? `\n\nContext from college notes:\n${contextNotes.join("\n---\n")}`
    : "\n\nNo specific notes found for this query.";

  const systemInstruction = `
You are the AI Oracle for M.H. Saboo Siddik College of Engineering students. 
Be helpful, concise, and professional. 
Use the provided context notes to answer the student's query accurately. 
If the information is not in the notes, use your general knowledge but prioritize note content.
Always mention which semester/subject the info belongs to if available in the context.
`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Query: ${query}${context}` }] }],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const response = await result.response;
    return response.text() || "I am thinking... but no words come out.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The Oracle is currently silent. (Check if VITE_GEMINI_API_KEY is set in .env)";
  }
}
