import React from 'react';
import Link from 'next/link';

interface DetailButtonProps {
    href: string;
    label?: string;
    className?: string;
}

const DetailButton: React.FC<DetailButtonProps> = ({ 
    href, 
    label = 'Chi tiết sản phẩm', 
    className = '' 
}) => {
    return (
        <Link 
            href={href} 
            className={`btn-highlight btn-shimmer ${className}`}
        >
            <span className="btn-text">{label}</span>
            <svg 
                className="btn-icon w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14 5l7 7m0 0l-7 7m7-7H3" 
                />
            </svg>
        </Link>
    );
};

export default DetailButton;
