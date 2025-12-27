import { groq, models } from './groq';

export interface StudyData {
    summary: string;
    keyPoints: string[];
    flashcards: { question: string; answer: string }[];
    quiz: { question: string; options: string[]; answer: string; explanation: string; difficulty: string }[];
    examQuestions: string[];
    funFacts: string[];
}

const SYSTEM_PROMPT = `
You are StudyAI, an expert academic assistant for Nigerian & African university students.
StudyAI was founded by Ademuwagun Mayokun, a Computer Engineering student at Olabisi Onabanjo University (OOU) and a passionate programmer/problem-solver.
Your goal is to help students pass exams by providing crisp, exam-oriented content.
Always use simple language first, then go deep.
Use Nigerian/African academic context where helpful.
Return all data in strictly valid JSON format according to the requested structure.
`;

export const generateStudyContent = async (extractedText: string): Promise<StudyData> => {
    const prompt = `
  Analyze the following study material and generate:
  1. A comprehensive summary (3-4 paragraphs).
  2. 5-7 Very important key exam points.
  3. 5-10 interactive Flashcards (Question & Answer).
  4. 5 Multiple Choice Quiz questions with options (A, B, C, D), correct answer letter, short explanation, and difficulty (Easy, Medium, Hard).
  5. 3-5 Likely exam-style theory questions.
  6. 2-3 Fun facts or memory hooks to help remember concepts.

  Material:
  ${extractedText.substring(0, 8000)} // Limit context window

  Return ONLY a JSON object with this structure:
  {
    "summary": "string",
    "keyPoints": ["string"],
    "flashcards": [{"question": "string", "answer": "string"}],
    "quiz": [{"question": "string", "options": ["string"], "answer": "string", "explanation": "string", "difficulty": "string"}],
    "examQuestions": ["string"],
    "funFacts": ["string"]
  }
  `;

    try {
        console.log("Sending prompt to Groq API...");
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: prompt }
            ],
            model: models.llama3,
            response_format: { type: "json_object" }
        });

        const response = completion.choices[0]?.message?.content;
        console.log("Raw AI Response received:", response);

        if (!response) {
            throw new Error("No response content from Groq API");
        }

        try {
            const data = JSON.parse(response);
            console.log("Successfully parsed AI StudyData");
            return data as StudyData;
        } catch (parseError) {
            console.error("JSON Parsing Error:", parseError);
            throw new Error("Failed to parse AI response as JSON");
        }
    } catch (error: any) {
        console.error("AI Generation Detailed Error:", error);
        // Log more info if it's an API error
        if (error.status) console.error("API Status:", error.status);
        if (error.message) console.error("API Message:", error.message);
        throw error;
    }
};

export const generateStudyContentFromTopic = async (course: string, topic: string): Promise<StudyData> => {
    const prompt = `
  Analyze the following study topic: "${topic}" in the context of "${course}" and generate:
  1. A comprehensive summary (3-4 paragraphs).
  2. 5-7 Very important key exam points.
  3. 5-10 interactive Flashcards (Question & Answer).
  4. 5 Multiple Choice Quiz questions with options (A, B, C, D), correct answer letter, short explanation, and difficulty (Easy, Medium, Hard).
  5. 3-5 Likely exam-style theory questions.
  6. 2-3 Fun facts or memory hooks to help remember concepts.

  Return ONLY a JSON object with this structure:
  {
    "summary": "string",
    "keyPoints": ["string"],
    "flashcards": [{"question": "string", "answer": "string"}],
    "quiz": [{"question": "string", "options": ["string"], "answer": "string", "explanation": "string", "difficulty": "string"}],
    "examQuestions": ["string"],
    "funFacts": ["string"]
  }
  `;

    try {
        console.log(`Generating content for Topic: ${topic} (${course})...`);
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: prompt }
            ],
            model: models.llama3,
            response_format: { type: "json_object" }
        });

        const response = completion.choices[0]?.message?.content;
        console.log("Raw AI Response received:", response);

        if (!response) {
            throw new Error("No response content from Groq API");
        }

        try {
            const data = JSON.parse(response);
            console.log("Successfully parsed AI StudyData");
            return data as StudyData;
        } catch (parseError) {
            console.error("JSON Parsing Error:", parseError);
            throw new Error("Failed to parse AI response as JSON");
        }
    } catch (error: any) {
        console.error("AI Generation Detailed Error:", error);
        throw error;
    }
};
