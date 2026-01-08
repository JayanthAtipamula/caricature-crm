import React from 'react';
import { Phone, Instagram } from 'lucide-react';
import { Event } from '../types';
import { formatDate } from '../utils/dateUtils';

interface EventDetailsProps {
  event: Event;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const netEarnings = event.price - event.marketingCosts - 
    (event.otherCosts.materials + event.otherCosts.travel + event.otherCosts.misc);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">{event.clientName}</h2>
          
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`tel:${event.contactNumber}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Phone size={18} className="mr-2" />
                Call Client
              </a>
              
              <a
                href={`https://instagram.com/${event.instagramId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                <Instagram size={18} className="mr-2" />
                @{event.instagramId}
              </a>
            </div>

            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Date:</span> {formatDate(event.date)}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Location:</span> {event.location}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Time:</span> {event.startTime} - {event.endTime}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Artists</h3>
            <ul className="list-disc list-inside space-y-1">
              {event.artists.map((artist, index) => (
                <li key={index} className="text-gray-600 dark:text-gray-300">{artist}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Financial Details</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <p className="text-gray-600 dark:text-gray-300">Marketing Costs:</p>
              <p className="text-gray-900 dark:text-gray-100">{formatCurrency(event.marketingCosts)}</p>
              
              <p className="text-gray-600 dark:text-gray-300">Price:</p>
              <p className="text-gray-900 dark:text-gray-100">{formatCurrency(event.price)}</p>
              
              <p className="text-gray-600 dark:text-gray-300">Materials:</p>
              <p className="text-gray-900 dark:text-gray-100">{formatCurrency(event.otherCosts.materials)}</p>
              
              <p className="text-gray-600 dark:text-gray-300">Travel:</p>
              <p className="text-gray-900 dark:text-gray-100">{formatCurrency(event.otherCosts.travel)}</p>
              
              <p className="text-gray-600 dark:text-gray-300">Miscellaneous:</p>
              <p className="text-gray-900 dark:text-gray-100">{formatCurrency(event.otherCosts.misc)}</p>
              
              <p className="font-semibold text-gray-800 dark:text-gray-200">Net Earnings:</p>
              <p className={`font-semibold ${netEarnings >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(netEarnings)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};