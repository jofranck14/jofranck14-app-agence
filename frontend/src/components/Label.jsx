import React from 'react';

const Label = ({ 
  htmlFor, 
  children, 
  required = false, 
  className = '',
  size = 'medium'
}) => {
  const sizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <label
      htmlFor={htmlFor}
      className={`
        font-medium text-gray-700
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;