import React from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  readOnly?: boolean;
}

export function NumberInput({ value, onChange, className = '', readOnly = false }: NumberInputProps) {
  const formatValue = (num: number) => {
    return num ? num.toLocaleString('en-US') : '';
  };

  const parseValue = (str: string) => {
    return parseFloat(str.replace(/,/g, '')) || 0;
  };

  return (
    <input
      type="text"
      value={formatValue(value)}
      onChange={(e) => onChange(parseValue(e.target.value))}
      readOnly={readOnly}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] ${readOnly ? 'bg-gray-50' : ''} ${className}`}
    />
  );
}