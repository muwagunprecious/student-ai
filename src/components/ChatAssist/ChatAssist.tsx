"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatAssist.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { chatCompletionAction } from '@/app/actions/aiActions';

const ChatAssist = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: "Hi! I'm StudyAI, founded by Ademuwagun Mayokun. Need help explaining something from your notes?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chatCompletionAction([...messages, userMsg]);

            if (result.success && result.content) {
                setMessages(prev => [...prev, { role: 'assistant', content: result.content! }]);
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I had trouble connecting. Please check the API key on Vercel." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.chatWrapper}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={styles.chatWindow}
                    >
                        <div className={styles.header}>
                            <h3>💬 Ask StudyAI</h3>
                            <button onClick={() => setIsOpen(false)}>×</button>
                        </div>

                        <div className={styles.messageList} ref={scrollRef}>
                            {messages.map((m, i) => (
                                <div key={i} className={`${styles.message} ${styles[m.role]}`}>
                                    <div className={styles.bubble}>{m.content}</div>
                                </div>
                            ))}
                            {isLoading && <div className={styles.loading}>AI is thinking...</div>}
                        </div>

                        <div className={styles.footer}>
                            <input
                                type="text"
                                placeholder="Type 'Explain this like I'm 5'..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button onClick={handleSend} disabled={isLoading}>Send</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button className={styles.toggleBtn} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '↓' : '💬'}
            </button>
        </div>
    );
};

export default ChatAssist;
