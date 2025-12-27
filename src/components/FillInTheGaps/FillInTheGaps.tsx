"use client";

import React, { useState } from 'react';
import styles from './FillInTheGaps.module.css';
import { motion, AnimatePresence } from 'framer-motion';

interface GapQuestion {
    sentence: string;
    answer: string;
}

interface FillInTheGapsProps {
    questions: GapQuestion[];
}

const FillInTheGaps: React.FC<FillInTheGapsProps> = ({ questions }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showSelection, setShowSelection] = useState(false);

    const question = questions[currentIdx];

    const handleCheck = () => {
        const correct = userAnswer.trim().toLowerCase() === question.answer.toLowerCase();
        setIsCorrect(correct);
        if (correct) {
            // Wait a bit then move on
            setTimeout(() => {
                if (currentIdx < questions.length - 1) {
                    nextQuestion();
                }
            }, 1000);
        }
    };

    const nextQuestion = () => {
        setCurrentIdx((prev) => (prev + 1) % questions.length);
        setUserAnswer('');
        setIsCorrect(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.progress}>
                Question {currentIdx + 1} of {questions.length}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={styles.questionCard}
                >
                    <p className={styles.sentence}>
                        {question.sentence.replace(question.answer, "________")}
                    </p>

                    <div className={styles.inputArea}>
                        <input
                            type="text"
                            placeholder="Type the missing word..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
                            className={isCorrect === true ? styles.success : isCorrect === false ? styles.error : ''}
                        />
                        <button onClick={handleCheck} className={styles.checkBtn}>Check</button>
                    </div>

                    {isCorrect === false && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={styles.feedback}
                        >
                            Not quite! The correct answer is: <strong>{question.answer}</strong>
                        </motion.p>
                    )}
                </motion.div>
            </AnimatePresence>

            <div className={styles.controls}>
                <button onClick={() => setCurrentIdx(prev => prev > 0 ? prev - 1 : 0)} disabled={currentIdx === 0}>Previous</button>
                <button onClick={nextQuestion}>Skip</button>
            </div>
        </div>
    );
};

export default FillInTheGaps;
