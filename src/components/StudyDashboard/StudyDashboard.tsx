"use client";

import React, { useState } from 'react';
import styles from './StudyDashboard.module.css';
import { useStudy } from '@/context/StudyContext';
import { motion, AnimatePresence } from 'framer-motion';
import Flashcard from '../Flashcard/Flashcard';
import Quiz from '../Quiz/Quiz';
import FillInTheGaps from '../FillInTheGaps/FillInTheGaps';

const StudyDashboard = () => {
    const { studyData } = useStudy();
    const [activeSection, setActiveSection] = useState('summary');
    const [flashcardIdx, setFlashcardIdx] = useState(0);

    if (!studyData) return null;

    const sections = [
        { id: 'summary', name: 'Overview', icon: '📘' },
        { id: 'keypoints', name: 'Key Points', icon: '📍' },
        { id: 'flashcards', name: 'Flashcards', icon: '🧠' },
        { id: 'fillgaps', name: 'Fill In Gaps', icon: '📝' },
        { id: 'quiz', name: 'Quiz & Tests', icon: '❓' },
        { id: 'exam', name: 'Exam Prep', icon: '🔥' },
        { id: 'funbox', name: 'Fun Facts', icon: '🎉' },
    ];

    return (
        <div className={styles.dashboard}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarSticky}>
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            <span className={styles.sectionIcon}>{section.icon}</span>
                            <span className={styles.sectionName}>{section.name}</span>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.content}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={styles.sectionView}
                    >
                        {activeSection === 'summary' && (
                            <div className={styles.card}>
                                <h1>📝 Topic Summary</h1>
                                <p className={styles.summaryText}>{studyData.summary}</p>
                            </div>
                        )}

                        {activeSection === 'keypoints' && (
                            <div className={styles.card}>
                                <h1>📍 Key Exam Points</h1>
                                <div className={styles.pointsGrid}>
                                    {studyData.keyPoints.map((point, i) => (
                                        <div key={i} className={styles.pointItem}>
                                            <span className={styles.pointBadge}>LIKELY EXAM ITEM</span>
                                            <p>{point}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === 'flashcards' && (
                            <div className={styles.card}>
                                <h1>🧠 Flashcards</h1>
                                <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
                                    Card {flashcardIdx + 1} of {studyData.flashcards.length}
                                </p>
                                <Flashcard
                                    question={studyData.flashcards[flashcardIdx].question}
                                    answer={studyData.flashcards[flashcardIdx].answer}
                                />
                                <div className={styles.flashcardActions}>
                                    <button
                                        disabled={flashcardIdx === 0}
                                        onClick={() => setFlashcardIdx(flashcardIdx - 1)}
                                    >Previous</button>
                                    <button
                                        disabled={flashcardIdx === studyData.flashcards.length - 1}
                                        onClick={() => setFlashcardIdx(flashcardIdx + 1)}
                                        className={styles.primaryBtn}
                                    >Next Card</button>
                                </div>
                            </div>
                        )}

                        {activeSection === 'fillgaps' && (
                            <div className={styles.card}>
                                <h1>📝 Fill In The Gaps</h1>
                                <FillInTheGaps questions={studyData.fillInTheGaps || []} />
                            </div>
                        )}

                        {activeSection === 'quiz' && (
                            <div className={styles.card}>
                                <h1>❓ Quiz & Assessment</h1>
                                <Quiz questions={studyData.quiz} />
                            </div>
                        )}

                        {activeSection === 'exam' && (
                            <div className={styles.card}>
                                <h1>🔥 Likely Exam Questions</h1>
                                <div className={styles.examQuestions}>
                                    {studyData.examQuestions.map((q, i) => (
                                        <div key={i} className={styles.examQuestionItem}>
                                            <div className={styles.qNum}>Q{i + 1}</div>
                                            <p>{q}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === 'funbox' && (
                            <div className={styles.card}>
                                <h1>🎉 Fun Facts & Hooks</h1>
                                <div className={styles.funGrid}>
                                    {studyData.funFacts.map((fact, i) => (
                                        <div key={i} className={styles.funCard}>
                                            <span className={styles.hookIcon}>🤯</span>
                                            <p>{fact}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default StudyDashboard;
