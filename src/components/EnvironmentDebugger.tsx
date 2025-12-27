"use client";

import React, { useState } from 'react';

const EnvironmentDebugger = () => {
    const [isVisible, setIsVisible] = useState(true);
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: apiKey ? '#d4f8d4' : '#ffdada',
            color: apiKey ? '#1a5e1a' : '#5e1a1a',
            padding: '15px',
            borderRadius: '10px',
            border: `2px solid ${apiKey ? '#52c41a' : '#ff4d4f'}`,
            zIndex: 99999,
            fontSize: '12px',
            fontFamily: 'monospace',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxWidth: '300px'
        }}>
            <button
                onClick={() => setIsVisible(false)}
                style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px'
                }}
            >
                ✕
            </button>
            <h4 style={{ margin: '0 0 10px 0' }}>🛠 Vercel Env Debugger</h4>
            <div style={{ marginBottom: '5px' }}>
                <strong>Key Name:</strong> <br />
                NEXT_PUBLIC_GROQ_API_KEY
            </div>
            <div style={{ marginBottom: '5px' }}>
                <strong>Status:</strong> {apiKey ? '✅ Detected' : '❌ NOT FOUND'}
            </div>
            {apiKey && (
                <>
                    <div style={{ marginBottom: '5px' }}>
                        <strong>Length:</strong> {apiKey.length}
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                        <strong>Masked:</strong> {apiKey.substring(0, 4)}...{apiKey.substring(apiKey.length - 4)}
                    </div>
                </>
            )}
            <p style={{ marginTop: '10px', fontSize: '10px', opacity: 0.8 }}>
                * If Status is ❌, you MUST add the key in Vercel Settings and then **Redeploy with "Clear Cache"**.
            </p>
        </div>
    );
};

export default EnvironmentDebugger;
