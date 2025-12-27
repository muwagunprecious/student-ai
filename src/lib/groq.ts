import Groq from "groq-sdk";

// Secure environment variable access for Groq API

// Secure environment variable access for Groq API
const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

if (!apiKey) {
  if (typeof window === 'undefined') {
    console.error("❌ CRITICAL: GROQ_API_KEY is missing on server!");
  } else {
    // Client-side warning (only if we still call it from client)
    console.warn("⚠️ Client-side API key missing. Ensure NEXT_PUBLIC_GROQ_API_KEY is set or use Server Actions.");
  }
}

export const groq = new Groq({
  apiKey: apiKey?.trim() || "",
  // We will transition to server actions, but keeping browser support for now
  dangerouslyAllowBrowser: true,
});

export const models = {
  llama3: "llama-3.3-70b-versatile",
  mixtral: "mixtral-8x7b-32768", // Mixtral is usually still active, but Llama 3.3 is better.
  fast: "llama-3.1-8b-instant"
};
