import React from 'react';

const H1 = ({ 
  children, 
  className = '', 
  center = false,
  color = 'text-gray-800'
}) => {
  return (
    <h1 
      className={`
        text-3xl md:text-4xl font-bold mb-6
        ${color}
        ${center ? 'text-center' : ''}
        ${className}
      `}
    >
      {children}
    </h1>
  );
};

export default H1;