'use client';

import { useState } from 'react';

interface AccessCodeModalProps {
  onSuccess: () => void;
  onCancel: () => void;
  actionName: string; // e.g., "crear asado", "crear penalización"
}

const VALID_CODE = '20182024';

export default function AccessCodeModal({ onSuccess, onCancel, actionName }: AccessCodeModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code === VALID_CODE) {
      onSuccess();
    } else {
      setError('Código incorrecto');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setCode('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200 ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-orange-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Código de Acceso
          </h2>
          <p className="text-gray-600">
            Ingresa el código para {actionName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
              placeholder="Ingresa el código"
              autoFocus
              maxLength={8}
              className={`w-full px-4 py-3 border-2 rounded-xl text-center text-lg font-mono tracking-wider focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 text-center font-medium">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!code}
              className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

