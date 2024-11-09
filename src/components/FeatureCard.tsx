import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeaturePoint {
  text: string;
}

interface FeatureCardProps {
  title: string;
  points: FeaturePoint[];
  summary: string;
  icon: LucideIcon;
}

export function FeatureCard({ title, points, summary, icon: Icon }: FeatureCardProps) {
  const renderPoint = (text: string) => {
    return text.split('**').map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <Icon className="h-8 w-8 text-[#db4a2b] flex-shrink-0" />
        <h2 className="text-2xl font-bold text-[#db4a2b]">{title}</h2>
      </div>
      <div className="space-y-4 mb-6 text-gray-600">
        {points.map((point, index) => (
          <div key={index} className="leading-relaxed">
            {renderPoint(point.text)}
          </div>
        ))}
      </div>
      <p className="text-gray-700 mt-auto italic">
        {summary}
      </p>
    </div>
  );
}