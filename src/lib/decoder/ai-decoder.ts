import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type DecodedResult = {
  summary: string;
  keyTerms: Array<{
    term: string;
    definition: string;
    category: string;
  }>;
  questions: string[];
  nextSteps: string[];
  safetyNote: string;
};

const DECODER_PROMPT = `You are a medical document decoder designed to help patients understand their medical documents in plain English. You will receive extracted text from a medical document (lab result, prescription, visit note, medical bill, etc.).

Your task is to analyze the document and provide:

1. **Plain-English Summary**: A clear, concise summary of what this document says in language a patient can understand. Focus on what matters most to the patient.

2. **Key Terms Explained**: Identify 3-8 medical terms, abbreviations, or codes in the document that patients commonly find confusing. For each, provide:
   - The term as it appears
   - A simple, clear definition
   - Category (medication, diagnosis, lab test, procedure, etc.)

3. **Questions to Ask Your Provider**: Generate 3-5 specific, actionable questions the patient should ask their healthcare provider based on this document. These should help the patient get clarity on next steps, treatment options, or understanding their condition.

4. **What to Do Next**: Provide 3-5 concrete next steps or action items based on the document. These might include scheduling appointments, getting prescriptions filled, monitoring symptoms, lifestyle changes, etc.

5. **Safety Note**: Always include a brief safety note reminding the patient that this is educational information, not medical advice, and that they should contact their provider with questions. If the document contains any urgent findings or red flags, emphasize seeking immediate medical attention.

Return your response as a JSON object with this exact structure:
{
  "summary": "Plain English summary here...",
  "keyTerms": [
    {"term": "CBC", "definition": "Complete Blood Count - a test that measures different components of your blood", "category": "lab test"},
    ...
  ],
  "questions": [
    "What do these lab results mean for my current treatment plan?",
    ...
  ],
  "nextSteps": [
    "Schedule a follow-up appointment within 2 weeks",
    ...
  ],
  "safetyNote": "This analysis is for educational purposes only and is not medical advice..."
}`;

export async function decodeDocument(extractedText: string): Promise<DecodedResult> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: DECODER_PROMPT,
        },
        {
          role: "user",
          content: `Please decode this medical document:\n\n${extractedText}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const decoded = JSON.parse(content) as DecodedResult;
    
    // Validate the structure
    if (!decoded.summary || !decoded.keyTerms || !decoded.questions || !decoded.nextSteps) {
      throw new Error("Invalid response structure from AI");
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding document with AI:", error);
    throw new Error("Failed to decode document. Please try again.");
  }
}
