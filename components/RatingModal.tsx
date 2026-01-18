'use client';

import { useState } from 'react';

interface RatingModalProps {
  userName: string;
  initialRating?: number;
  onSubmit: (rating: number) => void;
  onCancel: () => void;
}

export default function RatingModal({ userName, initialRating, onSubmit, onCancel }: RatingModalProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(initialRating || 0);

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmit = () => {
    if (selectedRating > 0) {
      onSubmit(selectedRating);
    }
  };

  const displayRating = hoveredStar !== null ? hoveredStar : selectedRating;

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Malo';
      case 2: return 'Regular';
      case 3: return 'Bueno';
      case 4: return 'Muy Bueno';
      case 5: return 'Excelente';
      default: return 'Sin calificar';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          ¿Cómo estuvo el asado?
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Califica el asado de <span className="font-semibold text-orange-600">{userName}</span>
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              className="transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
            >
              <svg
                className={`w-12 h-12 transition-colors ${
                  star <= displayRating
                    ? 'fill-orange-500 text-orange-500'
                    : 'fill-gray-200 text-gray-200'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>

        {/* Rating text */}
        <p className="text-center text-lg font-semibold mb-8 h-8 transition-colors">
          {displayRating > 0 ? (
            <span className="text-orange-600">{getRatingText(displayRating)}</span>
          ) : (
            <span className="text-gray-400">Selecciona una calificación</span>
          )}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedRating === 0}
            className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

