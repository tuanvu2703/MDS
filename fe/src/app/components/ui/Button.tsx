// components/Button.tsx
import React from 'react';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 font-bold rounded-lg transition-colors duration-200 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;