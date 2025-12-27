"use client";

import React, { useState } from 'react';
import styles from './Flashcard.module.css';
import { motion } from 'framer-motion';

interface FlashcardProps {
    question: string;
    answer: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ question, answer }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className={styles.flashcardContainer} onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
                className={styles.card}
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            >
                <div className={styles.front}>
                    <div className={styles.label}>QUESTION</div>
                    <div className={styles.text}>{question}</div>
                    <div className={styles.hint}>Click to see answer</div>
                </div>

                <div className={styles.back}>
                    <div className={styles.label}>ANSWER</div>
                    <div className={styles.text}>{answer}</div>
                    <div className={styles.hint}>Click to see question</div>
                </div>
            </motion.div>
        </div>
    );
};

export default Flashcard;
