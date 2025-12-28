"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInterface.module.css';
import { chatCompletionAction } from '@/app/actions/aiActions';
import { extractTextFromFile } from '@/lib/fileParser';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    isFile?: boolean;
}

const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        try {
            const text = await extractTextFromFile(file);

            // Add system message with file content (hidden from view or shown as summary)
            const systemMsg: Message = {
                role: 'system',
                content: `Context from uploaded file "${file.name}":\n\n${text}\n\n---\nUser will now ask questions about this file.`
            };

            // Add visual user message showing file was uploaded
            const userFileMsg: Message = {
                role: 'user',
                content: `📄 Uploaded: ${file.name}`,
                isFile: true
            };

            setMessages(prev => [...prev, systemMsg, userFileMsg]);

            // Trigger initial AI response acknowledging the file
            const conversation = [...messages, systemMsg, userFileMsg].map(m => ({
                role: m.role,
                content: m.content
            }));

            const result = await chatCompletionAction([
                ...conversation,
                { role: 'user', content: "I have uploaded a file. Please analyze it briefly and tell me you are ready to answer questions." }
            ]);

            if (result.success && result.content) {
                setMessages(prev => [...prev, { role: 'assistant', content: result.content }]);
            }

        } catch (error: any) {
            console.error("File parsing error:", error);
            alert(`Failed to read file: ${error.message}`);
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', content: inputValue.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Prepare messages for API (clean history)
            const apiMessages = [...messages, userMsg].map(m => ({
                role: m.role,
                content: m.content
            }));

            const result = await chatCompletionAction(apiMessages);

            if (result.success && result.content) {
                const aiMsg: Message = { role: 'assistant', content: result.content };
                setMessages(prev => [...prev, aiMsg]);
            } else {
                throw new Error(result.error || "Failed to get response");
            }
        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg: Message = {
                role: 'assistant',
                content: "Sorry, I encountered an error. Please try again."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.messageList}>
                {messages.length === 0 && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>💬</div>
                        <h3>Ask me anything!</h3>
                        <p>Upload lecture notes or ask specific questions.</p>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.filter(m => m.role !== 'system').map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage} ${msg.isFile ? styles.fileMessage : ''}`}
                        >
                            {msg.isFile ? <span className={styles.fileIcon}>📎</span> : null}
                            {msg.content}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <div className={styles.loadingDots}>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className={styles.inputArea} onSubmit={handleSendMessage}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    accept=".pdf,.docx,.pptx,.txt"
                />
                <button
                    type="button"
                    className={styles.attachBtn}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    title="Attach Study Material"
                >
                    📎
                </button>

                <input
                    type="text"
                    className={styles.input}
                    placeholder="Type your question..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className={styles.sendBtn}
                    disabled={isLoading || !inputValue.trim()}
                >
                    {isLoading ? '...' : '➤'}
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
