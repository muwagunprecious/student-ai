import Groq from "groq-sdk";

const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

if (!apiKey) {
  console.warn("GROQ_API_KEY is missing in env variables");
} else {
  console.log(`API Key detected. Length: ${apiKey.length}, Starts with: ${apiKey.substring(0, 4)}, Ends with: ${apiKey.substring(apiKey.length - 4)}`);
}

export const groq = new Groq({
  apiKey: apiKey?.trim() || "",
  dangerouslyAllowBrowser: true,
});

export const models = {
  llama3: "llama-3.3-70b-versatile",
  mixtral: "mixtral-8x7b-32768", // Mixtral is usually still active, but Llama 3.3 is better.
  fast: "llama-3.1-8b-instant"
};
