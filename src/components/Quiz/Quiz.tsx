"use client";

import React, { useState } from 'react';
import styles from './Quiz.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface QuizProps {
    questions: {
        question: string;
        options: string[];
        answer: string;
        explanation: string;
        difficulty: string;
    }[];
}

const Quiz: React.FC<QuizProps> = ({ questions }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const handleSubmit = () => {
        if (selectedOption === null) return;

        const correctLetter = questions[currentIdx].answer;
        const selectedLetter = String.fromCharCode(65 + selectedOption);

        if (selectedLetter === correctLetter) {
            setScore(score + 1);
        }
        setIsSubmitted(true);
    };

    const handleNext = () => {
        if (currentIdx + 1 < questions.length) {
            setCurrentIdx(currentIdx + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
        } else {
            setIsFinished(true);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    if (isFinished) {
        return (
            <div className={styles.result}>
                <h1>🎉 Quiz Completed!</h1>
                <div className={styles.scoreCircle}>
                    <span>{score}</span> / {questions.length}
                </div>
                <p>You've mastered {Math.round((score / questions.length) * 100)}% of this material!</p>
                <button className={styles.restartBtn} onClick={() => {
                    setCurrentIdx(0);
                    setScore(0);
                    setIsFinished(false);
                    setIsSubmitted(false);
                    setSelectedOption(null);
                }}>Try Again</button>
            </div>
        );
    }

    const q = questions[currentIdx];

    return (
        <div className={styles.quiz}>
            <div className={styles.progress}>
                Question {currentIdx + 1} of {questions.length}
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>

            <div className={styles.questionCard}>
                <div className={styles.difficulty}>Difficulty: {q.difficulty}</div>
                <h2 className={styles.questionText}>{q.question}</h2>

                <div className={styles.options}>
                    {q.options.map((option, i) => (
                        <button
                            key={i}
                            className={`${styles.optionBtn} 
                ${selectedOption === i ? styles.selected : ''} 
                ${isSubmitted && String.fromCharCode(65 + i) === q.answer ? styles.correct : ''}
                ${isSubmitted && selectedOption === i && String.fromCharCode(65 + i) !== q.answer ? styles.wrong : ''}`}
                            onClick={() => !isSubmitted && setSelectedOption(i)}
                            disabled={isSubmitted}
                        >
                            <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
                            {option}
                        </button>
                    ))}
                </div>

                <AnimatePresence>
                    {isSubmitted && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className={styles.feedback}
                        >
                            <div className={styles.feedbackTitle}>
                                {String.fromCharCode(65 + selectedOption!) === q.answer ? '✅ Correct!' : '❌ Wrong!'}
                            </div>
                            <p className={styles.explanation}>{q.explanation}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className={styles.actions}>
                {!isSubmitted ? (
                    <button
                        className={styles.submitBtn}
                        disabled={selectedOption === null}
                        onClick={handleSubmit}
                    >
                        Submit Answer
                    </button>
                ) : (
                    <button className={styles.nextBtn} onClick={handleNext}>
                        {currentIdx + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Quiz;
