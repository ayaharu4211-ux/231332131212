
import React from 'react';
import { GENRES } from '../constants';

interface GenreSelectorProps {
  activeGenreId: string;
  onSelect: (id: string) => void;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({ activeGenreId, onSelect }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    onSelect(id);
    const target = e.currentTarget;
    target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <div className="sticky top-[60px] z-10 bg-white shadow-sm border-b border-gray-200">
      <div className="relative max-w-4xl mx-auto">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none md:hidden"></div>
        
        {/* Scrollable Container */}
        <div className="flex overflow-x-auto whitespace-nowrap no-scrollbar p-3 space-x-2 px-6">
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={(e) => handleClick(e, genre.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeGenreId === genre.id
                  ? 'bg-red-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none md:hidden"></div>
      </div>
    </div>
  );
};

export default GenreSelector;
