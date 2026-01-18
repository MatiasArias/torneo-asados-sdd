'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AccessCodeModal from '@/components/AccessCodeModal';

export default function AdminCleanPage() {
  const router = useRouter();
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleCleanClick = () => {
    if (!confirm('⚠️ ¿Estás seguro de que quieres limpiar TODOS los datos?\n\nEsto eliminará:\n- Todos los asados\n- Todas las participaciones\n- Todas las penalizaciones\n\nLos usuarios se mantendrán pero con 0 puntos.\n\nEsta acción NO se puede deshacer.')) {
      return;
    }

    if (!isAccessGranted) {
      setShowAccessCodeModal(true);
      return;
    }

    executeClean();
  };

  const handleAccessCodeSuccess = () => {
    setShowAccessCodeModal(false);
    setIsAccessGranted(true);
    executeClean();
  };

  const handleAccessCodeCancel = () => {
    setShowAccessCodeModal(false);
  };

  const executeClean = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: '20182024' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al limpiar los datos');
      }

      setResult({ success: true, message: data.message });
      setIsAccessGranted(false);

      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 3000);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
      setIsAccessGranted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4 md:p-8">
      {/* Access Code Modal */}
      {showAccessCodeModal && (
        <AccessCodeModal
          actionName="limpiar los datos"
          onSuccess={handleAccessCodeSuccess}
          onCancel={handleAccessCodeCancel}
        />
      )}

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
            ← Volver al inicio
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Limpiar Datos del Torneo
            </h1>
            <p className="text-gray-600">
              Resetea el torneo eliminando todos los asados, participaciones y penalizaciones.
            </p>
          </div>

          {/* Warning Box */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
              <span>⚠️</span> Advertencia
            </h2>
            <div className="text-red-800 space-y-2">
              <p className="font-semibold">Esta acción eliminará:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Todos los asados</li>
                <li>Todas las participaciones</li>
                <li>Todas las penalizaciones</li>
              </ul>
              <p className="mt-3 font-semibold">Se mantendrán:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Los 9 usuarios (con 0 puntos)</li>
              </ul>
              <p className="mt-4 text-sm">
                <strong>Esta acción NO se puede deshacer.</strong>
              </p>
            </div>
          </div>

          {/* Result Message */}
          {result && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <p className="font-medium">
                {result.success ? '✅ ' : '❌ '}
                {result.message}
              </p>
              {result.success && (
                <p className="text-sm mt-2">Redirigiendo al inicio en 3 segundos...</p>
              )}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleCleanClick}
            disabled={loading}
            className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? '🧹 Limpiando datos...' : '🗑️ Limpiar Todos los Datos'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Se te pedirá el código de acceso para confirmar
          </p>
        </div>
      </div>
    </div>
  );
}

