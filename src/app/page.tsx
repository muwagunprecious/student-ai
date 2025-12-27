"use client";

import Hero from "@/components/Hero/Hero";
import UploadCard from "@/components/UploadCard/UploadCard";
import StudyDashboard from "@/components/StudyDashboard/StudyDashboard";
import { useStudy } from "@/context/StudyContext";
import { extractTextFromFile } from "@/lib/fileParser";
import { generateStudyContent, GenerationOptions } from "@/lib/aiService";
import { generateStudyContentAction } from "@/app/actions/aiActions";
import CourseStepper from "@/components/CourseStepper/CourseStepper";

export default function Home() {
  const { currentStep, setCurrentStep, setStudyData, isLoading, setIsLoading } = useStudy();

  const handleFileUpload = async (file: File, options: GenerationOptions) => {
    setIsLoading(true);
    try {
      console.log(`Starting extraction for ${file.name}...`);
      let text = "";
      try {
        text = await extractTextFromFile(file);
      } catch (extractError: any) {
        console.error("Extraction failed:", extractError);
        alert(`Failed to extract text: ${extractError.message || "Unknown error"}`);
        return;
      }

      console.log("Sending text to AI via Server Action...");
      try {
        const result = await generateStudyContentAction(text, options);
        if (result.success && result.data) {
          setStudyData(result.data);
          setCurrentStep('dashboard');
        } else {
          throw new Error(result.error);
        }
      } catch (aiError: any) {
        console.error("AI step failed:", aiError);
        alert(`AI Generation failed: ${aiError.message || "Unknown error"}.`);
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
