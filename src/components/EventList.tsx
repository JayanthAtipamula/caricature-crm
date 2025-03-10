import React from 'react';
import { Event, StatusLabel } from '../types';
import { StatusLabel as StatusLabelComponent } from './StatusLabel';
import { formatDate } from '../utils/dateUtils';
import { ChevronDown, ChevronUp, Edit, Trash2, Phone, Instagram, Download, MessageCircle } from 'lucide-react';
import { generateInvoice } from '../utils/invoiceGenerator';

interface EventListProps {
  events: Event[];
  selectedEvent: Event | null;
  onEventSelect: (event: Event | null) => void;
  selectedStatus: string | null;
  onStatusSelect: (status: string) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  statusLabels: StatusLabel[];
}

const EventDetails = ({ event }: { event: Event }) => {
  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const handleDownloadInvoice = () => {
    const invoiceData = {
      invoiceNumber: event.id.slice(-3),
      date: new Date(event.date || '').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      clientName: event.clientName || 'Client',
      contactNumber: event.contactNumber,
      location: event.location || 'Location not specified',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      price: event.price || 0,
      advancePayment: event.advancePayment || 0,
      artists: event.artists
    };
    
    generateInvoice(invoiceData);
  };

  const formatWhatsAppNumber = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (cleanNumber.length === 10) {
      return `91${cleanNumber}`;
    }
    
    return cleanNumber;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Contact Information */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Contact Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            {event.contactNumber && (
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${event.contactNumber}`}
                  className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                >
                  <Phone size={16} className="mr-2" />
                  {event.contactNumber}
                </a>
                
                <a
                  href={`https://wa.me/${formatWhatsAppNumber(event.contactNumber)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg"
                >
                  <MessageCircle size={16} className="mr-2" />
                  WhatsApp
                </a>
              </div>
            )}
            {event.instagramId && (
              <div className="flex items-center gap-2">
                <a
                  href={`https://instagram.com/${event.instagramId.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-sm text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 rounded-lg"
                >
                  <Instagram size={16} className="mr-2" />
                  {event.instagramId}
                </a>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {event.location && (
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Location: </span>
                <span className="text-gray-900 dark:text-gray-100">{event.location}</span>
              </div>
            )}
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Time: </span>
              <span className="text-gray-900 dark:text-gray-100">
                {event.startTime && event.endTime 
                  ? `${event.startTime} - ${event.endTime}`
                  : 'Time not specified'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Artists Section */}
      {event.artists && event.artists.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Artists</h4>
          <div className="flex flex-wrap gap-2">
            {event.artists.map((artist, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full text-sm"
              >
                {artist}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Financial Details */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Financial Details</h4>
          {(event.status === 'OK' || event.status === 'OK_OUTDOOR') && (
            <button
              onClick={handleDownloadInvoice}
              className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
            >
              <Download size={16} />
              Download Invoice
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Price:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(event.price)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Advance Payment:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(event.advancePayment)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending Payment:</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                {formatCurrency((event.price || 0) - (event.advancePayment || 0))}
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Marketing Costs:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(event.marketingCosts)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Materials:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(event.otherCosts?.materials)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Travel:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(event.otherCosts?.travel)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Miscellaneous:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(event.otherCosts?.misc)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Net Revenue:</span>
              <span className={`font-bold ${
                ((event.price || 0) - 
                (event.marketingCosts || 0) - 
                ((event.otherCosts?.materials || 0) + 
                (event.otherCosts?.travel || 0) + 
                (event.otherCosts?.misc || 0))) >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(
                  (event.price || 0) - 
                  (event.marketingCosts || 0) - 
                  ((event.otherCosts?.materials || 0) + 
                  (event.otherCosts?.travel || 0) + 
                  (event.otherCosts?.misc || 0))
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EventList: React.FC<EventListProps> = ({
  events,
  selectedEvent,
  onEventSelect,
  selectedStatus,
  onStatusSelect,
  onEditEvent,
  onDeleteEvent,
  statusLabels,
}) => {
  // Calculate counts for each status
  const statusCounts = events.reduce((acc, event) => {
    if (event.status === 'OUTDOOR') {
      // For OUTDOOR events, count them in both OUTDOOR and OK_OUTDOOR based on their status
      acc['OUTDOOR'] = (acc['OUTDOOR'] || 0) + 1;
      if (event.status === 'OK_OUTDOOR') {
        acc['OK_OUTDOOR'] = (acc['OK_OUTDOOR'] || 0) + 1;
      }
    } else {
      const status = event.status || 'OK';
      acc[status] = (acc[status] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Filter events based on selected status
  const filteredEvents = events.filter(event => {
    if (!selectedStatus) return true;
    
    if (selectedStatus === 'OUTDOOR') {
      return event.status === 'OUTDOOR' && event.status !== 'OK_OUTDOOR';
    }
    
    if (selectedStatus === 'OK_OUTDOOR') {
      return event.status === 'OK_OUTDOOR';
    }
    
    // For other statuses, exclude OUTDOOR events
    return event.status === selectedStatus;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2 mb-4">
          {statusLabels.map(({ value, label }) => (
            <StatusLabelComponent
              key={value}
              status={value}
              label={`${label} (${statusCounts[value] || 0})`}
              selected={selectedStatus === value}
              onClick={() => onStatusSelect(value)}
            />
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredEvents.map((event) => (
          <div key={event.id}>
            <div
              className={`transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedEvent?.id === event.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1" onClick={() => onEventSelect(selectedEvent?.id === event.id ? null : event)}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {event.clientName || 'Unnamed Event'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {event.date ? formatDate(event.date) : 'No date'}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <StatusLabelComponent
                          status={event.status || 'OK'}
                          label={statusLabels.find(l => l.value === event.status)?.label || 'OK'}
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditEvent(event);
                            }}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteEvent(event.id);
                            }}
                            className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                          >
                            <Trash2 size={18} />
                          </button>
                          {selectedEvent?.id === event.id ? (
                            <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {selectedEvent?.id === event.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <EventDetails event={event} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};