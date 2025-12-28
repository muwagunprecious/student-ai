"use client";

import { useState, useEffect } from "react";
import styles from "./OneTimePopup.module.css";

export default function OneTimePopup() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the user has already seen and dismissed the popup
        const isDismissed = localStorage.getItem("ebuka_popup_dismissed");
        if (!isDismissed) {
            // Show popup after a short delay for better UX
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem("ebuka_popup_dismissed", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <p className={styles.message}>
                    Ebuka Onyereiri is foolish DO you know ?
                </p>
                <button className={styles.button} onClick={handleDismiss}>
                    Okay
                </button>
            </div>
        </div>
    );
}
