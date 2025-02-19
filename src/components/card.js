// src/components/ui/card.js
import React from 'react';

export const Card = ({ children, className }) => {
    return (
        <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
            {children}
        </div>
    );
};
