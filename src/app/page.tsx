"use client";

import Hero from "@/components/Hero/Hero";
import UploadCard from "@/components/UploadCard/UploadCard";
import StudyDashboard from "@/components/StudyDashboard/StudyDashboard";
import { useStudy } from "@/context/StudyContext";
import { extractTextFromPDF } from "@/lib/pdfParser";
import { generateStudyContent } from "@/lib/aiService";
import CourseStepper from "@/components/CourseStepper/CourseStepper";

export default function Home() {
  const { currentStep, setCurrentStep, setStudyData, isLoading, setIsLoading } = useStudy();

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const text = await extractTextFromPDF(file);
      const data = await generateStudyContent(text);
      setStudyData(data);
      setCurrentStep('dashboard');
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to process PDF. Please try again.");
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
