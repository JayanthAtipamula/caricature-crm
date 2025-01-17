import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { EventFormData, EventStatus, StatusLabel } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: EventFormData) => void;
  initialData?: EventFormData;
  isEditing?: boolean;
  statusLabels: StatusLabel[];
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false,
  statusLabels,
}) => {
  const defaultFormData: EventFormData = {
    clientName: '',
    date: '',
    status: 'OK',
    contactNumber: '',
    instagramId: '',
    location: '',
    startTime: '',
    endTime: '',
    artists: [''],
    marketingCosts: 0,
    price: 0,
    otherCosts: {
      materials: 0,
      travel: 0,
      misc: 0
    },
    advancePayment: 0,
    pendingPayment: 0
  };

  const [formData, setFormData] = useState<EventFormData>(defaultFormData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || defaultFormData);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare the form data
    const preparedData: EventFormData = {
      ...formData,
      // Ensure date is present
      date: formData.date || new Date().toISOString().split('T')[0],
      status: formData.status || 'OK',
      marketingCosts: Number(formData.marketingCosts) || 0,
      price: Number(formData.price) || 0,
      advancePayment: Number(formData.advancePayment) || 0,
      pendingPayment: Number(formData.pendingPayment) || 0,
      otherCosts: {
        materials: Number(formData.otherCosts?.materials) || 0,
        travel: Number(formData.otherCosts?.travel) || 0,
        misc: Number(formData.otherCosts?.misc) || 0
      },
      artists: formData.artists?.filter(artist => artist.trim() !== '') || []
    };

    onSave(preparedData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('otherCosts.')) {
      const costType = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        otherCosts: {
          ...prev.otherCosts,
          [costType]: type === 'number' ? (value ? Number(value) : 0) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? (value ? Number(value) : 0) : value
      }));
    }
  };

  const handleArtistChange = (index: number, value: string) => {
    const newArtists = [...(formData.artists || [''])];
    newArtists[index] = value;
    setFormData({ ...formData, artists: newArtists });
  };

  const addArtist = () => {
    setFormData({ 
      ...formData, 
      artists: [...(formData.artists || ['']), ''] 
    });
  };

  const removeArtist = (index: number) => {
    const newArtists = (formData.artists || ['']).filter((_, i) => i !== index);
    setFormData({ ...formData, artists: newArtists });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Event' : 'Add New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Client Name
              </label>
              <input
                type="text"
                value={formData.clientName || ''}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                {statusLabels.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Number
              </label>
              <input
                type="tel"
                value={formData.contactNumber || ''}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Instagram ID
              </label>
              <input
                type="text"
                value={formData.instagramId || ''}
                onChange={(e) => setFormData({ ...formData, instagramId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime || ''}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime || ''}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Artists
            </label>
            {formData.artists.map((artist, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => handleArtistChange(index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  placeholder="Artist name"
                />
                {formData.artists.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArtist(index)}
                    className="px-2 py-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addArtist}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
            >
              + Add Artist
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Marketing Costs (₹)
              </label>
              <input
                type="number"
                value={formData.marketingCosts || ''}
                onChange={(e) => setFormData({ ...formData, marketingCosts: e.target.value ? Number(e.target.value) : undefined })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Materials Cost (₹)
              </label>
              <input
                type="number"
                value={formData.otherCosts.materials || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  otherCosts: { ...formData.otherCosts, materials: e.target.value ? Number(e.target.value) : undefined }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Travel Cost (₹)
              </label>
              <input
                type="number"
                value={formData.otherCosts.travel || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  otherCosts: { ...formData.otherCosts, travel: e.target.value ? Number(e.target.value) : undefined }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Miscellaneous Cost (₹)
              </label>
              <input
                type="number"
                value={formData.otherCosts.misc || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  otherCosts: { ...formData.otherCosts, misc: e.target.value ? Number(e.target.value) : undefined }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Advance Payment (₹)
              </label>
              <input
                type="number"
                name="advancePayment"
                value={formData.advancePayment || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Pending Payment
              </label>
              <input
                type="number"
                name="pendingPayment"
                value={formData.pendingPayment || ''}
                onChange={(e) => setFormData({ ...formData, pendingPayment: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
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
              {isEditing ? 'Save Changes' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};