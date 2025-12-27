"use client";

import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useStudy } from '@/context/StudyContext';

const Navbar = () => {
    const { setCurrentStep } = useStudy();

    return (
        <nav className={styles.nav}>
            <div className={`${styles.container} container`}>
                <div className={styles.logoGroup} onClick={() => setCurrentStep('home')} style={{ cursor: 'pointer' }}>
                    <div className={styles.logo}>
                        <span className={styles.icon}>🎓</span> StudyAI
                    </div>
                    <span className={styles.tagline}>Learn smarter, pass faster</span>
                </div>

                <div className={styles.navLinks}>
                    <Link href="/help" className={styles.helpIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </Link>
                    <button
                        className={styles.secondaryBtn}
                        onClick={() => setCurrentStep('home')}
                    >
                        Home
                    </button>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => setCurrentStep('upload')}
                    >
                        Upload PDF
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
