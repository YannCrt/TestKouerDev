'use client';

import { useState } from 'react';

interface FilterBarProps {
    count: number;
    onSortChange?: (sort: string) => void;
}

export default function FilterBar({ count, onSortChange }: FilterBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState('Pertinence');

    const sortOptions = [
        'Pertinence',
        'Nouveauté',
        'Prix croissant',
        'Prix décroissant'
    ];

    const handleSelect = (option: string) => {
        setSelectedSort(option);
        setIsOpen(false);
        if (onSortChange) onSortChange(option);
    };

    return (
        <div className="flex justify-between items-center gap-4 p-4 border-gray border-b-1">
            {/* Compteur de résultats */}
            <div className="flex gap-1">
                <p className="text-lg">
                    {count.toLocaleString()}
                </p>
                <p className="text-lg text-gray">
                    {count > 1 ? "résultats" : "résultat"}
                </p>
            </div>

            {/* Dropdown de tri */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-base"
                >
                    <span className="text-lg">Trier par</span>
                    <span className="font-medium text-gray text-lg">{selectedSort}</span>
                    <svg
                        className={`w-4 h-4 text-gray transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {/* Menu dropdown */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
                        {sortOptions.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleSelect(option)}
                                className={`w-full text-left px-4 py-3 text-base transition-colors ${selectedSort === option
                                    ? 'bg-green text-white'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}