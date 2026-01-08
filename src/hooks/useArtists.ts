import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Artist } from '../types';

export const useArtists = () => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const q = query(
            collection(db, 'artists'),
            orderBy('name', 'asc')
        );

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const artistsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name as string,
                }));
                setArtists(artistsData);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching artists:', err);
                setError('Failed to fetch artists');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const addArtist = async (name: string) => {
        try {
            await addDoc(collection(db, 'artists'), {
                name,
                createdAt: serverTimestamp()
            });
            return true;
        } catch (err) {
            console.error('Error adding artist:', err);
            throw err;
        }
    };

    return { artists, loading, error, addArtist };
};
