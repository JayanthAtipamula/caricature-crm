import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Event, EventFormData } from '../types';

export const useEvents = (selectedYear: number, selectedMonth: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    // Calculate date range
    const monthIndex = new Date(Date.parse(selectedMonth + " 1, 2000")).getMonth();

    // Start of the month
    const startDate = new Date(selectedYear, monthIndex, 1);
    const startDateStr = startDate.toISOString();

    // Start of the NEXT month (for < query)
    const endDate = new Date(selectedYear, monthIndex + 1, 1);
    const endDateStr = endDate.toISOString();

    console.log(`Fetching events from ${startDateStr} to ${endDateStr}`);

    const q = query(
      collection(db, 'events'),
      where('date', '>=', startDateStr),
      where('date', '<', endDateStr),
      orderBy('date', 'asc')
    );

    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const eventsData: Event[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const event = {
            id: doc.id,
            ...data,
            date: data.date || new Date().toISOString().split('T')[0]
          } as Event;
          eventsData.push(event);
        });

        setEvents(eventsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedYear, selectedMonth]);

  const addEvent = async (eventData: EventFormData) => {
    try {
      const newEvent = {
        ...eventData,
        date: eventData.date || new Date().toISOString(),
        status: eventData.status || 'OK',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        otherCosts: {
          materials: Number(eventData.otherCosts?.materials) || 0,
          travel: Number(eventData.otherCosts?.travel) || 0,
          misc: Number(eventData.otherCosts?.misc) || 0
        }
      };

      const docRef = await addDoc(collection(db, 'events'), newEvent);
      if (!docRef.id) {
        throw new Error('Failed to get document ID');
      }
      return docRef.id;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const updateEvent = async (id: string, eventData: EventFormData) => {
    try {
      const eventRef = doc(db, 'events', id);
      const updatedEvent = {
        ...eventData,
        updatedAt: serverTimestamp(),
      };
      await updateDoc(eventRef, updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
    } catch (err) {
      console.error('Error deleting event:', err);
      throw new Error('Failed to delete event');
    }
  };

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent
  };
};