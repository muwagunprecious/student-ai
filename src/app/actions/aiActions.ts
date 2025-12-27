"use server";

import { generateStudyContent, generateStudyContentFromTopic } from "@/lib/aiService";

export async function generateStudyContentAction(text: string) {
    const allKeys = Object.keys(process.env);
    const groqKeys = allKeys.filter(k => k.toUpperCase().includes("GROQ") || k.toUpperCase().includes("API"));
    const key = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    const sig = key ? `${key.substring(0, 6)}...${key.substring(key.length - 4)} (Len: ${key.length})` : `MISSING (Detected similar keys: ${groqKeys.join(", ") || "NONE"})`;

    try {
        const data = await generateStudyContent(text);
        return { success: true, data };
    } catch (error: any) {
        console.error("Server Action Error (PDF):", error);
        return {
            success: false,
            error: `${error.message}. Debug Info: ${sig}`
        };
    }
}

export async function generateStudyContentFromTopicAction(course: string, topic: string) {
    const allKeys = Object.keys(process.env);
    const groqKeys = allKeys.filter(k => k.toUpperCase().includes("GROQ") || k.toUpperCase().includes("API"));
    const key = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    const sig = key ? `${key.substring(0, 6)}...${key.substring(key.length - 4)} (Len: ${key.length})` : `MISSING (Detected similar keys: ${groqKeys.join(", ") || "NONE"})`;

    try {
        const data = await generateStudyContentFromTopic(course, topic);
        return { success: true, data };
    } catch (error: any) {
        console.error("Server Action Error (Topic):", error);
        return {
            success: false,
            error: `${error.message}. Debug Info: ${sig}`
        };
    }
}

export async function chatCompletionAction(messages: any[]) {
    const { groq, models } = await import("@/lib/groq");
    const allKeys = Object.keys(process.env);
    const groqKeys = allKeys.filter(k => k.toUpperCase().includes("GROQ") || k.toUpperCase().includes("API"));
    const key = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    const sig = key ? `${key.substring(0, 6)}...${key.substring(key.length - 4)} (Len: ${key.length})` : `MISSING (Detected similar keys: ${groqKeys.join(", ") || "NONE"})`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are StudyAI, an expert academic assistant for African university students. You were founded by Ademuwagun Mayokun, a Computer Engineering student at Olabisi Onabanjo University (OOU). Answer questions based on general knowledge and academic context. Keep it concise."
                },
                ...messages
            ],
            model: models.fast,
        });

        return { success: true, content: completion.choices[0]?.message?.content || "No response." };
    } catch (error: any) {
        console.error("Server Action Error (Chat):", error);
        return {
            success: false,
            error: `${error.message}. Debug Info: ${sig}`
        };
    }
}
