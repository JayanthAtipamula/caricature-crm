import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { Artist } from '../types';

interface ArtistMultiSelectProps {
    artists: Artist[];
    selectedArtists: string[];
    onChange: (selected: string[]) => void;
    onAddNewRequest: () => void;
}

export const ArtistMultiSelect: React.FC<ArtistMultiSelectProps> = ({
    artists,
    selectedArtists,
    onChange,
    onAddNewRequest,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleArtist = (artistName: string) => {
        const isSelected = selectedArtists.includes(artistName);
        let newSelected;
        if (isSelected) {
            newSelected = selectedArtists.filter(a => a !== artistName);
        } else {
            newSelected = [...selectedArtists, artistName];
        }
        onChange(newSelected);
    };

    return (
        <div className="relative" ref={containerRef}>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Artists
                </label>
                <button
                    type="button"
                    onClick={onAddNewRequest}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                    <Plus size={14} />
                    Add New Artist
                </button>
            </div>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white flex justify-between items-center"
            >
                <span className="truncate block">
                    {selectedArtists.length > 0 ? selectedArtists.join(', ') : <span className="text-gray-400">Select artists...</span>}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {artists.length === 0 ? (
                        <div className="py-2 px-4 text-gray-500 dark:text-gray-400 italic">
                            No artists found. Add one!
                        </div>
                    ) : (
                        artists.map((artist) => {
                            const isSelected = selectedArtists.includes(artist.name);
                            return (
                                <div
                                    key={artist.id}
                                    onClick={() => toggleArtist(artist.name)}
                                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-600 ${isSelected ? 'text-blue-900 dark:text-blue-100 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-900 dark:text-white'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => { }} // Handled by div click
                                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 bg-white dark:bg-gray-600 dark:border-gray-500"
                                        />
                                        <span className={`ml-3 block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                                            {artist.name}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};
