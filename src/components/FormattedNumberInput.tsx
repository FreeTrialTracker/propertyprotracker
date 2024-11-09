import React from 'react';

interface FormattedNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FormattedNumberInput({ value, onChange, className = '' }: FormattedNumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    const formattedValue = rawValue ? parseInt(rawValue).toLocaleString('en-US') : '';
    onChange(formattedValue);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      className={`h-12 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] ${className}`}
      placeholder="Enter value"
    />
  );
}