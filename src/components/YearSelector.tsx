import React from 'react';
import { Calendar } from 'lucide-react';

interface YearSelectorProps {
    selectedYear: number;
    onYearChange: (year: number) => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({ selectedYear, onYearChange }) => {
    const currentYear = new Date().getFullYear();
    // Generate years from 2024 up to currentYear + 1
    const years = Array.from({ length: (currentYear + 2) - 2024 }, (_, i) => 2024 + i);

    return (
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="p-2 text-gray-500 dark:text-gray-400">
                <Calendar size={20} />
            </div>
            <select
                value={selectedYear}
                onChange={(e) => onYearChange(Number(e.target.value))}
                className="bg-transparent border-none text-gray-700 dark:text-gray-200 text-sm font-medium focus:ring-0 cursor-pointer pr-8"
            >
                {years.map((year) => (
                    <option key={year} value={year} className="bg-white dark:bg-gray-800">
                        {year}
                    </option>
                ))}
            </select>
        </div>
    );
};
