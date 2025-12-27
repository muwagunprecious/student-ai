import { groq, models } from './groq';

export interface StudyData {
    summary: string;
    keyPoints: string[];
    flashcards: { question: string; answer: string }[];
    quiz: { question: string; options: string[]; answer: string; explanation: string; difficulty: string }[];
    fillInTheGaps: { sentence: string; answer: string }[];
    examQuestions: string[];
    funFacts: string[];
}

export interface GenerationOptions {
    customInstructions?: string;
    summaryLength?: 'short' | 'medium' | 'long';
    chapterByChapter?: boolean;
}

const SYSTEM_PROMPT = `
You are StudyAI, an expert academic assistant for African university students.
StudyAI was founded by Ademuwagun Mayokun, a Computer Engineering student at Olabisi Onabanjo University (OOU).
Your goal is to help students pass exams by providing crisp, exam-oriented content.
Always follow user formatting instructions (like chapter-by-chapter) if provided.
Return all data in strictly valid JSON format according to the requested structure.
`;

export const generateStudyContent = async (extractedText: string, options?: GenerationOptions): Promise<StudyData> => {
    const summaryStyle = options?.summaryLength === 'long' ? "very detailed and expanded (6-8 paragraphs)" :
        options?.summaryLength === 'short' ? "concise (1-2 paragraphs)" : "comprehensive (3-4 paragraphs)";

    const chapterLogic = options?.chapterByChapter ? "Format the summary chapter-by-chapter if the material contains different sections." : "";
    const customText = options?.customInstructions ? `Special User Instructions: "${options.customInstructions}" - YOU MUST PRIORITIZE THESE INSTRUCTIONS.` : "";

    const prompt = `
  Analyze the following study material and generate:
  1. A summary that is ${summaryStyle}. ${chapterLogic}
  2. 5-7 Very important key exam points.
  3. 5-10 interactive Flashcards (Question & Answer).
  4. 5 Multiple Choice Quiz questions with options (A, B, C, D), correct answer letter, short explanation, and difficulty (Easy, Medium, Hard).
  5. 5 "Fill in the Gap" questions. Provide a sentence with a clear blank and the correct missing word/phrase.
  6. 3-5 Likely exam-style theory questions.
  7. 2-3 Fun facts or memory hooks.

  ${customText}

  Material:
  ${extractedText.substring(0, 10000)}

  Return ONLY a JSON object with this structure:
  {
    "summary": "string",
    "keyPoints": ["string"],
    "flashcards": [{"question": "string", "answer": "string"}],
    "quiz": [{"question": "string", "options": ["string"], "answer": "string", "explanation": "string", "difficulty": "string"}],
    "fillInTheGaps": [{"sentence": "string", "answer": "string"}],
    "examQuestions": ["string"],
    "funFacts": ["string"]
  }
  `;

    // ... Rest of the function remains same but uses prompt
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: prompt }
            ],
            model: models.llama3,
            response_format: { type: "json_object" }
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) throw new Error("No response content from Groq API");

        const data = JSON.parse(response);
        return data as StudyData;
    } catch (error: any) {
        console.error("AI Generation Error:", error);
        throw error;
    }
};

export const generateStudyContentFromTopic = async (course: string, topic: string, options?: GenerationOptions): Promise<StudyData> => {
    const customText = options?.customInstructions ? `Special User Instructions: "${options.customInstructions}"` : "";

    const prompt = `
  Analyze the following study topic: "${topic}" in the context of "${course}" and generate:
  1. A comprehensive summary.
  2. 5-7 Very important key exam points.
  3. 5-10 interactive Flashcards (Question & Answer).
  4. 5 Multiple Choice Quiz questions.
  5. 5 "Fill in the Gap" questions.
  6. 3-5 Likely exam-style theory questions.
  7. 2-3 Fun facts or memory hooks.

  ${customText}

  Return ONLY a JSON object with this structure:
  {
    "summary": "string",
    "keyPoints": ["string"],
    "flashcards": [{"question": "string", "answer": "string"}],
    "quiz": [{"question": "string", "options": ["string"], "answer": "string", "explanation": "string", "difficulty": "string"}],
    "fillInTheGaps": [{"sentence": "string", "answer": "string"}],
    "examQuestions": ["string"],
    "funFacts": ["string"]
  }
  `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: prompt }
            ],
            model: models.llama3,
            response_format: { type: "json_object" }
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) throw new Error("No response content from Groq API");

        return JSON.parse(response) as StudyData;
    } catch (error: any) {
        console.error("Topic AI Generation Error:", error);
        throw error;
    }
};
