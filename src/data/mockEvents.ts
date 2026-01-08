import { Event } from '../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    date: '2024-03-15',
    status: 'OK',
    contactNumber: '+1234567890',
    instagramId: 'sarahj_events',
    location: 'Crystal Gardens, 123 Main St',
    startTime: '14:00',
    endTime: '22:00',
    artists: ['DJ Blake', 'The Melodies'],
    marketingCosts: 500,
    price: 3000,
    otherCosts: {
      materials: 300,
      travel: 200,
      misc: 100
    }
  },
  {
    id: '2',
    clientName: 'Michael Chen',
    date: '2024-03-20',
    status: 'OUTDOOR',
    contactNumber: '+1987654321',
    instagramId: 'mchenevents',
    location: 'Sunset Park',
    startTime: '16:00',
    endTime: '23:00',
    artists: ['Live Band Echo', 'Solo Artist Jane'],
    marketingCosts: 800,
    price: 4500,
    otherCosts: {
      materials: 500,
      travel: 300,
      misc: 200
    }
  },
  {
    id: '3',
    clientName: 'Emma Wilson',
    date: '2024-03-25',
    status: 'NOT_OK',
    contactNumber: '+1122334455',
    instagramId: 'emmaw_celebrations',
    location: 'Grand Hotel Ballroom',
    startTime: '18:00',
    endTime: '00:00',
    artists: ['Jazz Quartet', 'DJ Smith'],
    marketingCosts: 1000,
    price: 5500,
    otherCosts: {
      materials: 800,
      travel: 400,
      misc: 300
    }
  }
];