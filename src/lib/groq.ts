import Groq from "groq-sdk";

// Secure environment variable access for Groq API

const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

if (!apiKey) {
  console.error("❌ CRITICAL: NEXT_PUBLIC_GROQ_API_KEY is missing! Vercel deployment will fail to generate content.");
  if (typeof window !== 'undefined') {
    console.error("Please add NEXT_PUBLIC_GROQ_API_KEY to your Vercel Environment Variables.");
  }
} else {
  console.log(`✅ API Key detected (Length: ${apiKey.length})`);
}

export const groq = new Groq({
  apiKey: apiKey?.trim() || "MISSING_KEY",
  dangerouslyAllowBrowser: true,
});

export const models = {
  llama3: "llama-3.3-70b-versatile",
  mixtral: "mixtral-8x7b-32768", // Mixtral is usually still active, but Llama 3.3 is better.
  fast: "llama-3.1-8b-instant"
};
