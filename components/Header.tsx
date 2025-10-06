
import React from 'react';

const FilmReelIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M4 4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V4ZM2 5V7H4V5H2ZM2 9V11H4V9H2ZM2 13V15H4V13H2ZM2 17V19H4V17H2ZM6 5V7H18V5H6ZM6 17V19H18V17H6ZM20 5V7H22V5H20ZM20 9V11H22V9H20ZM20 13V15H22V13H20ZM20 17V19H22V17H20Z"></path>
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="flex items-center space-x-3 mb-6">
       <FilmReelIcon className="w-10 h-10 text-cyan-400" />
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Veo Vision
        </h1>
        <p className="text-sm text-gray-400">AI Video Generator</p>
      </div>
    </header>
  );
};
