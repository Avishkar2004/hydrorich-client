import React from 'react';

const CircularStats = ({ percentage, color, size = 120, strokeWidth = 10, label, value }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    const colors = {
        blue: '#3B82F6',
        green: '#10B986',
        purple: '#8B5CF6',
        yellow: '#F59E0B',
        red: '#EF4444'
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                {/* Background circle */}
                <svg className="transform -rotate-90" width={size} height={size}>
                    <circle
                        className="text-gray-200"
                        strokeWidth={strokeWidth}
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    {/* Progress circle */}
                    <circle
                        className="transition-all duration-1000 ease-in-out"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke={colors[color] || colors.blue}
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-2xl font-bold" style={{ color: colors[color] || colors.blue }}>
                            {percentage}%
                        </span>
                    </div>
                </div>
            </div>
            {/* Label and value */}
            <div className="mt-4 text-center">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-lg font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

export default CircularStats; 