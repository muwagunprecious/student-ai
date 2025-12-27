"use client";

import React, { useState } from 'react';
import styles from './CourseStepper.module.css';
import { useStudy } from '@/context/StudyContext';
import { generateStudyContentFromTopicAction } from '@/app/actions/aiActions';
import { motion, AnimatePresence } from 'framer-motion';

const FORMS = [
    { id: 'course', title: 'What are you studying?', placeholder: 'e.g. Computer Science, Law, Biology...' },
    { id: 'topic', title: 'Which topic specifically?', placeholder: 'e.g. Data Structures, Criminal Law, Photosynthesis...' },
];

const CourseStepper = () => {
    const { setStudyData, setCurrentStep, setIsLoading, isLoading } = useStudy();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({ course: '', topic: '' });

    const handleNext = async () => {
        if (step < FORMS.length - 1) {
            setStep(step + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        if (!formData.course || !formData.topic) return;

        setIsLoading(true);
        try {
            console.log(`Requesting AI content for: ${formData.topic} via Server Action`);
            const result = await generateStudyContentFromTopicAction(formData.course, formData.topic);
            if (result.success && result.data) {
                setStudyData(result.data);
                setCurrentStep('dashboard');
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            console.error("Stepper generation failed", error);
            alert(`AI Generation failed: ${error.message || "Unknown error"}. Check if your GROQ_API_KEY is correctly set on Vercel.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.stepperWrapper}>
            <div className={styles.stepperCard}>
                <div className={styles.progressHeader}>
                    <div className={styles.steps}>
                        {FORMS.map((_, i) => (
                            <div
                                key={i}
                                className={`${styles.stepIndicator} ${i <= step ? styles.active : ''}`}
                            />
                        ))}
                    </div>
                    <span className={styles.stepCount}>Step {step + 1} of {FORMS.length}</span>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={styles.formContent}
                    >
                        <h1>{FORMS[step].title}</h1>
                        <input
                            autoFocus
                            type="text"
                            placeholder={FORMS[step].placeholder}
                            value={step === 0 ? formData.course : formData.topic}
                            onChange={(e) => setFormData({
                                ...formData,
                                [FORMS[step].id]: e.target.value
                            })}
                            onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                        />
                    </motion.div>
                </AnimatePresence>

                <div className={styles.footer}>
                    <button
                        className={styles.backBtn}
                        onClick={() => step > 0 ? setStep(step - 1) : setCurrentStep('home')}
                    >
                        {step === 0 ? 'Cancel' : 'Back'}
                    </button>
                    <button
                        className={styles.nextBtn}
                        disabled={isLoading || (step === 0 ? !formData.course : !formData.topic)}
                        onClick={handleNext}
                    >
                        {isLoading ? 'Generating...' : (step === FORMS.length - 1 ? 'Ready! ✨' : 'Next')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseStepper;
