"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StudyData } from '@/lib/aiService';

interface StudyContextType {
    studyData: StudyData | null;
    setStudyData: (data: StudyData | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    currentStep: 'home' | 'upload' | 'stepper' | 'dashboard';
    setCurrentStep: (step: 'home' | 'upload' | 'stepper' | 'dashboard') => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider = ({ children }: { children: ReactNode }) => {
    const [studyData, setStudyData] = useState<StudyData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<'home' | 'upload' | 'stepper' | 'dashboard'>('home');

    return (
        <StudyContext.Provider value={{
            studyData, setStudyData,
            isLoading, setIsLoading,
            currentStep, setCurrentStep
        }}>
            {children}
        </StudyContext.Provider>
    );
};

export const useStudy = () => {
    const context = useContext(StudyContext);
    if (context === undefined) {
        throw new Error('useStudy must be used within a StudyProvider');
    }
    return context;
};
