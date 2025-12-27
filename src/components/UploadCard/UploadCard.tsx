"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './UploadCard.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { GenerationOptions } from '@/lib/aiService';

interface UploadCardProps {
    onUpload: (file: File, options: GenerationOptions) => void;
    isLoading: boolean;
}

const UploadCard: React.FC<UploadCardProps> = ({ onUpload, isLoading }) => {
    const [error, setError] = useState<string | null>(null);
    const [customInstructions, setCustomInstructions] = useState('');
    const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
    const [chapterByChapter, setChapterByChapter] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            if (file.size > 20 * 1024 * 1024) {
                setError('File is too large (max 20MB)');
            } else {
                setError(null);
                onUpload(file, {
                    customInstructions,
                    summaryLength,
                    chapterByChapter
                });
            }
        }
    }, [onUpload, customInstructions, summaryLength, chapterByChapter]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt']
        },
        multiple: false,
        disabled: isLoading
    });

    return (
        <div className={styles.uploadContainer}>
            <div className={styles.optionsPanel}>
                <div className={styles.optionGroup}>
                    <label>✨ Special Instructions (Optional)</label>
                    <textarea
                        placeholder="e.g. 'Summarize chapter by chapter', 'Focus on mathematical formulas', 'Write in simple Nigerian English'..."
                        value={customInstructions}
                        onChange={(e) => setCustomInstructions(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.settingsRow}>
                    <div className={styles.optionGroup}>
                        <label>📝 Summary Depth</label>
                        <select
                            value={summaryLength}
                            onChange={(e) => setSummaryLength(e.target.value as any)}
                            disabled={isLoading}
                        >
                            <option value="short">Quick Overview (Short)</option>
                            <option value="medium">Standard Study (Medium)</option>
                            <option value="long">In-depth Analysis (Long)</option>
                        </select>
                    </div>

                    <div className={`${styles.optionGroup} ${styles.checkboxGroup}`}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={chapterByChapter}
                                onChange={(e) => setChapterByChapter(e.target.checked)}
                                disabled={isLoading}
                            />
                            Chapter by Chapter?
                        </label>
                    </div>
                </div>
            </div>

            <div className={styles.uploadCard}>
                <div
                    {...getRootProps()}
                    className={`${styles.dropzone} ${isDragActive ? styles.active : ''} ${isLoading ? styles.loading : ''}`}
                >
                    <input {...getInputProps()} />

                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={styles.statusContent}
                            >
                                <div className={styles.spinner}></div>
                                <h3>Relax 😌, I’m reading your material…</h3>
                                <p>Analyzing document and prepping your study tools...</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={styles.statusContent}
                            >
                                <div className={styles.iconContainer}>
                                    📄
                                </div>
                                <h2>Drop your notes here</h2>
                                <p>or click to browse</p>
                                <div className={styles.meta}>
                                    <span>Supported: PDF, DOCX, TXT</span>
                                    <span>Max: 20MB</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={styles.error}
                    >
                        ⚠️ {error}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default UploadCard;
