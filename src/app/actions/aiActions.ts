"use server";

import { generateStudyContent, generateStudyContentFromTopic } from "@/lib/aiService";

export async function generateStudyContentAction(text: string) {
    try {
        const data = await generateStudyContent(text);
        return { success: true, data };
    } catch (error: any) {
        console.error("Server Action Error (PDF):", error);
        return { success: false, error: error.message || "Something went wrong on the server." };
    }
}

export async function generateStudyContentFromTopicAction(course: string, topic: string) {
    try {
        const data = await generateStudyContentFromTopic(course, topic);
        return { success: true, data };
    } catch (error: any) {
        console.error("Server Action Error (Topic):", error);
        return { success: false, error: error.message || "Something went wrong on the server." };
    }
}

export async function chatCompletionAction(messages: any[]) {
    const { groq, models } = await import("@/lib/groq");
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are StudyAI, an expert academic assistant for African university students. You were founded by Ademuwagun Mayokun, a Computer Engineering student at Olabisi Onabanjo University (OOU). Answer questions based on general knowledge and academic context. Keep it concise."
                },
                ...messages
            ],
            model: models.fast, // Use fast model for chat
        });

        return { success: true, content: completion.choices[0]?.message?.content || "No response." };
    } catch (error: any) {
        console.error("Server Action Error (Chat):", error);
        return { success: false, error: error.message || "Failed to talk to AI." };
    }
}
