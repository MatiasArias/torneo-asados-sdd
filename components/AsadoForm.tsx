'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Participation } from '@/lib/types';
import RatingModal from './RatingModal';
import AccessCodeModal from './AccessCodeModal';

interface AsadoFormProps {
  users: User[];
  initialData?: {
    name: string;
    date: string;
    time: string;
    location: string;
    hostId: string;
    notes: string;
    participations: Participation[];
  };
  asadoId?: string;
}

export default function AsadoForm({ users, initialData, asadoId }: AsadoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Rating modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentAsadorIndex, setCurrentAsadorIndex] = useState(0);
  const [asadoresNeedingRating, setAsadoresNeedingRating] = useState<string[]>([]);
  
  // Access code modal state
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  
  // Form state
  const [name, setName] = useState(initialData?.name || '');
  // Auto-set today's date if creating new asado
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(initialData?.time || '20:00');
  const [location, setLocation] = useState(initialData?.location || '');
  const [hostId, setHostId] = useState(initialData?.hostId || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  
  // Participations state (one per user)
  const [participations, setParticipations] = useState<Record<string, Partial<Participation>>>(
    users.reduce((acc, user) => {
      const existing = initialData?.participations.find(p => p.userId === user.id);
      acc[user.id] = existing || {
        userId: user.id,
        asador: false,
        calificacionAsado: undefined,
        comprador: false,
        asistio: false,
        llegoATiempo: false,
        llegoTarde: false,
        hosteo: user.id === initialData?.hostId, // Auto-set hosteo based on hostId
        carneEspecial: false,
        compraDividida: false,
      };
      // Override hosteo for existing participations to match current hostId
      if (existing) {
        acc[user.id].hosteo = user.id === initialData?.hostId;
      }
      return acc;
    }, {} as Record<string, Partial<Participation>>)
  );
  
  const updateParticipation = (userId: string, field: keyof Participation, value: any) => {
    setParticipations(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };
  
  // Auto-update hosteo when hostId changes
  const handleHostChange = (newHostId: string) => {
    setHostId(newHostId);
    
    // Update all participations: set hosteo=true for the host, false for others
    setParticipations(prev => {
      const updated = { ...prev };
      users.forEach(user => {
        if (updated[user.id]) {
          updated[user.id] = {
            ...updated[user.id],
            hosteo: user.id === newHostId,
          };
        }
      });
      return updated;
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check access code first
    if (!isAccessGranted) {
      setShowAccessCodeModal(true);
      return;
    }
    
    // Validate basic fields
    if (!name || !date || !hostId) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }
    
    // Get asadores that need rating
    const asadores = Object.entries(participations)
      .filter(([_, p]) => p.asador)
      .map(([userId, _]) => userId);
    
    // Check if any asador is missing rating
    const asadoresWithoutRating = asadores.filter(userId => {
      const rating = participations[userId].calificacionAsado;
      return !rating || rating < 1 || rating > 5;
    });
    
    // If there are asadores without rating, show modal for the first one
    if (asadoresWithoutRating.length > 0) {
      setAsadoresNeedingRating(asadoresWithoutRating);
      setCurrentAsadorIndex(0);
      setShowRatingModal(true);
      return;
    }
    
    // All ratings are complete, proceed to save
    await saveAsado();
  };
  
  const handleAccessCodeSuccess = () => {
    setShowAccessCodeModal(false);
    setIsAccessGranted(true);
    // Retry submit after granting access
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };
  
  const handleAccessCodeCancel = () => {
    setShowAccessCodeModal(false);
  };
  
  const handleRatingSubmit = (rating: number) => {
    const userId = asadoresNeedingRating[currentAsadorIndex];
    updateParticipation(userId, 'calificacionAsado', rating);
    
    // Check if there are more asadores to rate
    if (currentAsadorIndex < asadoresNeedingRating.length - 1) {
      setCurrentAsadorIndex(currentAsadorIndex + 1);
    } else {
      // All ratings complete, close modal and save
      setShowRatingModal(false);
      setAsadoresNeedingRating([]);
      setCurrentAsadorIndex(0);
      
      // Save asado after modal closes
      setTimeout(() => {
        saveAsado();
      }, 100);
    }
  };
  
  const handleRatingCancel = () => {
    setShowRatingModal(false);
    setAsadoresNeedingRating([]);
    setCurrentAsadorIndex(0);
  };
  
  const saveAsado = async () => {
    setLoading(true);
    
    try {
      const asadoData = {
        name,
        date,
        time,
        location,
        hostId,
        notes,
      };
      
      const participationsArray = Object.values(participations).filter(p => 
        p.asistio || p.asador || p.comprador || p.hosteo
      ) as Participation[];
      
      const url = asadoId ? `/api/asados/${asadoId}` : '/api/asados';
      const method = asadoId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asado: asadoId ? { ...asadoData, id: asadoId } : asadoData,
          participations: participationsArray,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar el asado');
      }
      
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
    }
  };
  
  const attendees = Object.values(participations).filter(p => p.asistio).length;
  
  const currentRatingUser = asadoresNeedingRating[currentAsadorIndex] 
    ? users.find(u => u.id === asadoresNeedingRating[currentAsadorIndex])
    : null;
  
  return (
    <>
      {/* Access Code Modal */}
      {showAccessCodeModal && (
        <AccessCodeModal
          actionName={asadoId ? 'actualizar el asado' : 'crear el asado'}
          onSuccess={handleAccessCodeSuccess}
          onCancel={handleAccessCodeCancel}
        />
      )}
      
      {/* Rating Modal */}
      {showRatingModal && currentRatingUser && (
        <RatingModal
          userName={currentRatingUser.name}
          initialRating={participations[currentRatingUser.id].calificacionAsado}
          onSubmit={handleRatingSubmit}
          onCancel={handleRatingCancel}
        />
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Información del Asado</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Ej: Asado de Juan"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Ej: Casa de Juan"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anfitrión *
          </label>
          <select
            value={hostId}
            onChange={(e) => handleHostChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          >
            <option value="">Selecciona...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            rows={3}
            placeholder="Notas o anécdotas del asado..."
          />
        </div>
      </div>
      
      {/* Participants */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Participantes</h2>
        <p className="text-sm text-gray-600 mb-4">
          Asistentes: {attendees} {attendees < 4 && <span className="text-red-600 font-semibold">(⚠️ Mínimo 4 para sumar puntos)</span>}
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-2 py-2 text-left font-medium text-gray-700">Nombre</th>
                <th className="px-2 py-2 text-center font-medium text-gray-700">Asistió</th>
                <th className="px-2 py-2 text-center font-medium text-gray-700">Asador</th>
                <th className="px-2 py-2 text-center font-medium text-gray-700">Calificación</th>
                <th className="px-2 py-2 text-center font-medium text-gray-700">C. Esp.</th>
                <th className="px-2 py-2 text-center font-medium text-gray-700">Compró</th>
                <th className="px-2 py-2 text-center font-medium text-gray-700">A tiempo</th>
                <th className="px-2 py-2 text-center font-medium text-gray-700">Tarde</th>
                <th className="px-2 py-2 text-center font-medium text-gray-700" title="Se asigna automáticamente según el anfitrión">
                  Hosteó*
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(user => {
                const p = participations[user.id];
                return (
                  <tr key={user.id}>
                    <td className="px-2 py-2 font-medium">{user.name}</td>
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={p.asistio || false}
                        onChange={(e) => updateParticipation(user.id, 'asistio', e.target.checked)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={p.asador || false}
                        onChange={(e) => updateParticipation(user.id, 'asador', e.target.checked)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center justify-center gap-1">
                        {p.asador ? (
                          <>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => updateParticipation(user.id, 'calificacionAsado', star)}
                                className="focus:outline-none hover:scale-110 transition-transform"
                              >
                                <svg
                                  className={`w-5 h-5 ${
                                    star <= (p.calificacionAsado || 0)
                                      ? 'fill-orange-500 text-orange-500'
                                      : 'fill-gray-300 text-gray-300'
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              </button>
                            ))}
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={p.carneEspecial || false}
                        onChange={(e) => updateParticipation(user.id, 'carneEspecial', e.target.checked)}
                        disabled={!p.asador}
                        className="w-4 h-4 disabled:opacity-30"
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={p.comprador || false}
                        onChange={(e) => updateParticipation(user.id, 'comprador', e.target.checked)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={p.llegoATiempo || false}
                        onChange={(e) => {
                          updateParticipation(user.id, 'llegoATiempo', e.target.checked);
                          if (e.target.checked) updateParticipation(user.id, 'llegoTarde', false);
                        }}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={p.llegoTarde || false}
                        onChange={(e) => {
                          updateParticipation(user.id, 'llegoTarde', e.target.checked);
                          if (e.target.checked) updateParticipation(user.id, 'llegoATiempo', false);
                        }}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={p.hosteo || false}
                        disabled
                        className="w-4 h-4 opacity-50 cursor-not-allowed"
                        title="Se asigna automáticamente según el anfitrión del asado"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          * C. Esp. = Carne Especial (bicho/costillar, solo disponible si es asador)<br />
          * Hosteó se asigna automáticamente según el anfitrión seleccionado
        </p>
      </div>
      
      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Guardando...' : asadoId ? 'Actualizar Asado' : 'Crear Asado'}
        </button>
      </div>
    </form>
    </>
  );
}

