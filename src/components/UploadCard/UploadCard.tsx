"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './UploadCard.module.css';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadCardProps {
    onUpload: (file: File) => void;
    isLoading: boolean;
}

const UploadCard: React.FC<UploadCardProps> = ({ onUpload, isLoading }) => {
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file && file.type === 'application/pdf') {
            if (file.size > 20 * 1024 * 1024) {
                setError('File is too large (max 20MB)');
            } else {
                setError(null);
                onUpload(file);
            }
        } else {
            setError('Please upload a valid PDF file');
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    return (
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
                            <h2>Drop your PDF here</h2>
                            <p>or click to browse your notes</p>
                            <div className={styles.meta}>
                                <span>Supported: PDF only</span>
                                <span>Max size: 20MB</span>
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
    );
};

export default UploadCard;
