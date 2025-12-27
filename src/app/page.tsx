"use client";

import Hero from "@/components/Hero/Hero";
import UploadCard from "@/components/UploadCard/UploadCard";
import StudyDashboard from "@/components/StudyDashboard/StudyDashboard";
import { useStudy } from "@/context/StudyContext";
import { extractTextFromPDF } from "@/lib/pdfParser";
import { generateStudyContent } from "@/lib/aiService";
import { generateStudyContentAction } from "@/app/actions/aiActions";
import CourseStepper from "@/components/CourseStepper/CourseStepper";

export default function Home() {
  const { currentStep, setCurrentStep, setStudyData, isLoading, setIsLoading } = useStudy();

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      console.log("Starting PDF extraction...");
      let text = "";
      try {
        text = await extractTextFromPDF(file);
      } catch (extractError: any) {
        console.error("Extraction step failed:", extractError);
        alert(`Failed to extract text from PDF: ${extractError.message || "Unknown error"}. Please ensure it's not a scanned image.`);
        return;
      }

      console.log("Sending text to AI via Server Action...");
      try {
        const result = await generateStudyContentAction(text);
        if (result.success && result.data) {
          setStudyData(result.data);
          setCurrentStep('dashboard');
        } else {
          throw new Error(result.error);
        }
      } catch (aiError: any) {
        console.error("AI step failed:", aiError);
        alert(`AI Generation failed: ${aiError.message || "Unknown error"}. This may be because the GROQ_API_KEY is not set correctly in your Vercel Environment Variables.`);
      }
    } catch (error: any) {
      console.error("General upload error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      {currentStep === 'home' && <Hero />}

      {currentStep === 'upload' && (
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <UploadCard onUpload={handleFileUpload} isLoading={isLoading} />
          </div>
        </section>
      )}

      {currentStep === 'stepper' && <CourseStepper />}

      {currentStep === 'dashboard' && <StudyDashboard />}
    </main>
  );
}
