"use server";

import { generateStudyContent, generateStudyContentFromTopic } from "@/lib/aiService";

export async function generateStudyContentAction(text: string) {
    try {
        const data = await generateStudyContent(text);
        return { success: true, data };
    } catch (error: any) {
        console.error("Server Action Error (PDF):", error);
        return {
            success: false,
            error: "Failed to process PDF content. Please check your AI configuration."
        };
    }
}

export async function generateStudyContentFromTopicAction(course: string, topic: string) {
    try {
        const data = await generateStudyContentFromTopic(course, topic);
        return { success: true, data };
    } catch (error: any) {
        console.error("Server Action Error (Topic):", error);
        return {
            success: false,
            error: "Failed to generate study materials for this topic."
        };
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
            model: models.fast,
        });

        return { success: true, content: completion.choices[0]?.message?.content || "No response." };
    } catch (error: any) {
        console.error("Server Action Error (Chat):", error);
        return {
            success: false,
            error: "Chat assistance is currently unavailable."
        };
    }
}
