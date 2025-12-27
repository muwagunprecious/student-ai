"use client";

import React, { useState } from 'react';
import styles from './CourseStepper.module.css';
import { useStudy } from '@/context/StudyContext';
import { generateStudyContentFromTopicAction } from '@/app/actions/aiActions';
import { motion, AnimatePresence } from 'framer-motion';

const FORMS = [
    { id: 'course', title: 'What are you studying?', placeholder: 'e.g. Computer Science, Law, Biology...' },
    { id: 'topic', title: 'Which topic specifically?', placeholder: 'e.g. Data Structures, Criminal Law, Photosynthesis...' },
    { id: 'options', title: 'Any special instructions?', placeholder: 'e.g. Focus on definitions, keep it simple...' }
];

const CourseStepper = () => {
    const { setStudyData, setCurrentStep, setIsLoading, isLoading } = useStudy();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        course: '',
        topic: '',
        instructions: '',
        summaryLength: 'medium' as 'short' | 'medium' | 'long'
    });

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
            console.log(`Requesting AI content for topic: ${formData.topic}`);
            const result = await generateStudyContentFromTopicAction(formData.course, formData.topic, {
                customInstructions: formData.instructions,
                summaryLength: formData.summaryLength
            });
            if (result.success && result.data) {
                setStudyData(result.data);
                setCurrentStep('dashboard');
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            console.error("Stepper generation failed", error);
            alert(`AI Generation failed: ${error.message || "Unknown error"}`);
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

                        {step < 2 ? (
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
                        ) : (
                            <div className={styles.finalOptions}>
                                <textarea
                                    autoFocus
                                    placeholder={FORMS[step].placeholder}
                                    value={formData.instructions}
                                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                />
                                <div className={styles.lengthSelect}>
                                    <label>Summary Length:</label>
                                    <select
                                        value={formData.summaryLength}
                                        onChange={(e) => setFormData({ ...formData, summaryLength: e.target.value as any })}
                                    >
                                        <option value="short">Short</option>
                                        <option value="medium">Medium</option>
                                        <option value="long">Long</option>
                                    </select>
                                </div>
                            </div>
                        )}
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
                        disabled={isLoading || (step === 0 ? !formData.course : step === 1 ? !formData.topic : false)}
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
