import React from 'react';

interface NumberInputWithSeparatorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function NumberInputWithSeparator({ value, onChange, className = '' }: NumberInputWithSeparatorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove existing separators and non-numeric characters except decimal
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = rawValue.split('.');
    const cleanValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    
    onChange(cleanValue);
  };

  const formatDisplayValue = (val: string) => {
    if (!val) return '';
    const num = parseFloat(val);
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US');
  };

  return (
    <input
      type="text"
      value={formatDisplayValue(value)}
      onChange={handleChange}
      className={`w-full rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] ${className}`}
    />
  );
}