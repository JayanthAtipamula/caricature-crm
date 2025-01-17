import React from 'react';
import { EventStatus } from '../types';

interface StatusLabelProps {
  status: EventStatus;
  label?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const StatusLabel: React.FC<StatusLabelProps> = ({ status, label, onClick, selected }) => {
  const getStatusStyles = () => {
    const baseStyles = 'px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 shadow-lg';
    const selectedStyles = selected ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' : '';
    const glowStyles = 'hover:shadow-xl hover:scale-105 transition-all duration-300';
    
    switch (status) {
      case 'OK':
        return `${baseStyles} ${selectedStyles} ${glowStyles} bg-gradient-to-r from-green-400 to-green-500 text-white shadow-green-500/50 hover:shadow-green-500/50`;
      case 'NOT_OK':
        return `${baseStyles} ${selectedStyles} ${glowStyles} bg-gradient-to-r from-red-400 to-red-500 text-white shadow-red-500/50 hover:shadow-red-500/50`;
      case 'OUTDOOR':
        return `${baseStyles} ${selectedStyles} ${glowStyles} bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-orange-500/50 hover:shadow-orange-500/50`;
      default:
        return baseStyles;
    }
  };

  return (
    <span onClick={onClick} className={getStatusStyles()}>
      {label || status.replace('_', ' ')}
    </span>
  );
};