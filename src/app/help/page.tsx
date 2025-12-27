"use client";

import React from 'react';
import styles from './help.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HelpPage = () => {
    const faqs = [
        {
            q: "How do I upload a PDF?",
            a: "Click 'Upload PDF' on the home page or navbar, then drag and drop your file or click to select one from your device."
        },
        {
            q: "Is there a limit to the PDF size?",
            a: "For the best experience, we recommend PDFs under 10MB. Content extraction works best on text-based PDFs rather than scanned images."
        },
        {
            q: "Can I use StudyAI without a PDF?",
            a: "Yes! Click 'Choose Course & Topic' on the home page and type in what you want to study. Our AI will generate everything for you."
        },
        {
            q: "How does the AI generate summaries?",
            a: "We use advanced AI models (Llama 3.3) to analyze your notes and condense them into the most important points for your exams."
        }
    ];

    return (
        <main className={styles.helpPage}>
            <div className="container">
                <header className={styles.header}>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        How can we help? 🎓
                    </motion.h1>
                    <p>Learn how to get the most out of StudyAI for your academic success.</p>
                </header>

                <div className={styles.grid}>
                    <motion.section
                        className={styles.section}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h2>🚀 Quick Start</h2>
                        <ol className={styles.list}>
                            <li><strong>Upload:</strong> Drop your lecture notes (PDF).</li>
                            <li><strong>Learn:</strong> Read the AI-generated summary and key points.</li>
                            <li><strong>Memorize:</strong> Use our 3D interactive flashcards.</li>
                            <li><strong>Test:</strong> Take a quiz to track your progress.</li>
                        </ol>
                    </motion.section>

                    <motion.section
                        className={styles.section}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2>💬 Support</h2>
                        <p>Having issues or have a feature suggestion? We'd love to hear from you!</p>
                        <div className={styles.contactButtons}>
                            <a href="mailto:support@studyai.com" className={styles.contactBtn}>📧 Email Support</a>
                            <a href="#" className={styles.contactBtn}>📱 WhatsApp Community</a>
                        </div>
                    </motion.section>
                </div>

                <section className={styles.faqSection}>
                    <h2>🤔 Frequently Asked Questions</h2>
                    <div className={styles.faqList}>
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                className={styles.faqItem}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                            >
                                <h3>{faq.q}</h3>
                                <p>{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <footer className={styles.footer}>
                    <Link href="/" className={styles.backBtn}>← Back to Home</Link>
                </footer>
            </div>
        </main>
    );
};

export default HelpPage;
