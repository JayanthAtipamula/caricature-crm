import React from 'react';
import { EventStatus } from '../types';

interface StatusLabelProps {
  status: EventStatus;
  label?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const StatusLabel: React.FC<StatusLabelProps> = ({
  status,
  label,
  selected,
  onClick,
}) => {
  const getStatusStyles = () => {
    const baseStyles = selected
      ? 'ring-2 ring-offset-2 '
      : '';

    switch (status) {
      case 'OK':
        return baseStyles + 'bg-green-50 text-green-700 ring-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'NOT_OK':
        return baseStyles + 'bg-red-50 text-red-700 ring-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'OUTDOOR':
        return baseStyles + 'bg-yellow-50 text-yellow-700 ring-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'OK_OUTDOOR':
        return baseStyles + 'bg-blue-50 text-blue-700 ring-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return baseStyles + 'bg-gray-50 text-gray-700 ring-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles()}`}
    >
      {label}
    </button>
  );
};