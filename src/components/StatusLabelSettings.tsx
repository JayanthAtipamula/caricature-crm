import React, { useState } from 'react';
import { X } from 'lucide-react';
import { EventStatus, StatusLabel } from '../types';

interface StatusLabelSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  statusLabels: StatusLabel[];
  onSave: (labels: StatusLabel[]) => void;
}

export const StatusLabelSettings: React.FC<StatusLabelSettingsProps> = ({
  isOpen,
  onClose,
  statusLabels,
  onSave,
}) => {
  const [labels, setLabels] = useState<StatusLabel[]>(statusLabels);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(labels);
    onClose();
  };

  const handleLabelChange = (status: EventStatus, newLabel: string) => {
    setLabels(labels.map(label => 
      label.value === status ? { ...label, label: newLabel } : label
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Status Labels
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {labels.map(({ value, label }) => (
            <div key={value} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {value} Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => handleLabelChange(value, e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
          ))}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};