import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { StudyProvider } from "@/context/StudyContext";
import ChatAssist from "@/components/ChatAssist/ChatAssist";
import OneTimePopup from "@/components/OneTimePopup/OneTimePopup";

export const metadata: Metadata = {
  title: "StudyAI | Ace Your Exams with AI 📚",
  description: "Learn smarter, pass faster with AI-powered summaries, flashcards, and quizzes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StudyProvider>
          <OneTimePopup />
          <Navbar />
          {children}
          <ChatAssist />
        </StudyProvider>
      </body>
    </html>
  );
}
