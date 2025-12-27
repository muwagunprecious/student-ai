"use client";

import React from 'react';
import styles from './Hero.module.css';
import { motion } from 'framer-motion';
import { useStudy } from '@/context/StudyContext';

const Hero = () => {
    const { setCurrentStep } = useStudy();

    return (
        <section className={styles.hero}>
            <div className={`${styles.container} container`}>
                <div className={styles.content}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={styles.title}
                    >
                        Ace Your Exams <br />
                        <span>with AI 📚</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={styles.subtitle}
                    >
                        Upload your notes or choose a course. <br />
                        Get summaries, flashcards, quizzes & exam tips.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={styles.actions}
                    >
                        <button
                            className={styles.primaryBtn}
                            onClick={() => setCurrentStep('upload')}
                        >
                            <span className={styles.btnIcon}>📤</span> Upload PDF
                        </button>
                        <button
                            className={styles.secondaryBtn}
                            onClick={() => setCurrentStep('stepper')}
                        >
                            <span className={styles.btnIcon}>📘</span> Choose Course & Topic
                        </button>
                    </motion.div>
                </div>

                <div className={styles.illustration}>
                    <motion.div
                        className={styles.floatCard}
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ top: '10%', right: '10%' }}
                    >
                        <span>📝</span> Summary
                    </motion.div>
                    <motion.div
                        className={styles.floatCard}
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        style={{ bottom: '20%', left: '0%' }}
                    >
                        <span>🧠</span> Flashcards
                    </motion.div>
                    <motion.div
                        className={styles.floatCard}
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        style={{ top: '40%', right: '-5%' }}
                    >
                        <span>❓</span> Quiz
                    </motion.div>

                    <div className={styles.studentImage}>
                        {/* Placeholder for student illustration */}
                        <div className={styles.studentPlaceholder}>
                            <span style={{ fontSize: '120px' }}>🧑‍🎓</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
