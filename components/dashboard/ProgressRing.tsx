'use client'

import { useState } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({ size = 120, strokeWidth = 8 }: ProgressRingProps) {
  const { progressData } = useDashboardStore();
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const getProgressValue = (): number => {
    switch (viewMode) {
      case 'daily':
        return progressData.daily;
      case 'weekly':
        return progressData.weekly;
      case 'monthly':
        return progressData.monthly;
      default:
        return progressData.daily;
    }
  };

  const progress = getProgressValue();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const viewButtons = [
    { mode: 'daily' as const, label: 'Daily' },
    { mode: 'weekly' as const, label: 'Weekly' },
    { mode: 'monthly' as const, label: 'Monthly' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
      
      <div className="flex flex-col items-center">
        {/* Circular Progress */}
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#10b981"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{progress}%</span>
            <span className="text-xs text-gray-500 capitalize">{viewMode}</span>
          </div>
        </div>

        {/* View mode buttons */}
        <div className="flex space-x-2 mt-6">
          {viewButtons.map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === mode
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
