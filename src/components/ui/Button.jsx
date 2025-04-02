import React from 'react';

const Button = ({ text, className, onClick }) => {
    const defaultClass = 'cursor-pointer text-sm font-bold px-4 py-1 md:px-6 md:py-2 border border-gray-800 dark:border-white rounded-lg hover:bg-opacity-25 transition-all duration-500';
    
    const buttonClassName = className ? `${defaultClass} ${className}` : defaultClass;

    return (
        <button 
            onClick={onClick} 
            className={buttonClassName}
        >
            {text}
        </button>
    );
};

export default Button;