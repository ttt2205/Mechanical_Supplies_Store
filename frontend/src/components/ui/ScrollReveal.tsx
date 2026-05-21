'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    animation?: 'reveal' | 'reveal-left' | 'reveal-right' | 'reveal-scale';
    className?: string;
    threshold?: number;
    delay?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
    children, 
    animation = 'reveal', 
    className = '',
    threshold = 0.1,
    delay = 0
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true);
                    }, delay);
                    // Once visible, we can stop observing
                    if (ref.current) {
                        observer.unobserve(ref.current);
                    }
                }
            },
            {
                threshold: threshold,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold, delay]);

    return (
        <div 
            ref={ref} 
            className={`${animation} ${isVisible ? 'active' : ''} ${className}`}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
